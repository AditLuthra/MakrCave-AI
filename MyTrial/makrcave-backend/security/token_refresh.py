"""
JWT Token Refresh and Expiration Handling System
Provides secure token refresh capabilities and proactive expiration management
"""

import logging
import time
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import httpx
import json
from dataclasses import dataclass

from fastapi import HTTPException, status, Request, Depends
from fastapi.responses import JSONResponse
from jose import jwt

logger = logging.getLogger(__name__)


@dataclass
class TokenInfo:
    """Token information structure"""
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: int = 900  # 15 minutes default
    token_type: str = "Bearer"
    scope: Optional[str] = None
    issued_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None


class TokenRefreshService:
    """Manages JWT token refresh and expiration handling"""
    
    def __init__(self, keycloak_url: str, realm: str, client_id: str, client_secret: str):
        self.keycloak_url = keycloak_url
        self.realm = realm
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_endpoint = f"{keycloak_url}/realms/{realm}/protocol/openid-connect/token"
        
        # Token refresh configuration
        self.REFRESH_THRESHOLD_SECONDS = 300  # Refresh when 5 minutes left
        self.MAX_REFRESH_ATTEMPTS = 3
        self.REFRESH_RETRY_DELAY = 1  # seconds
    
    async def refresh_access_token(
        self, 
        refresh_token: str,
        request_id: Optional[str] = None
    ) -> TokenInfo:
        """
        Refresh access token using refresh token
        
        Args:
            refresh_token: Valid refresh token
            request_id: Optional request ID for logging
            
        Returns:
            TokenInfo with new access token
            
        Raises:
            HTTPException: If refresh fails
        """
        logger.info(f"Attempting token refresh (request: {request_id})")
        
        refresh_data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "MakrX-Backend/1.0"
        }
        
        for attempt in range(self.MAX_REFRESH_ATTEMPTS):
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.post(
                        self.token_endpoint,
                        data=refresh_data,
                        headers=headers
                    )
                
                if response.status_code == 200:
                    token_data = response.json()
                    return self._parse_token_response(token_data)
                
                elif response.status_code == 400:
                    # Bad request - likely invalid refresh token
                    error_data = response.json()
                    logger.warning(f"Token refresh failed - invalid refresh token: {error_data} (request: {request_id})")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={
                            "error": "invalid_refresh_token",
                            "message": "Refresh token is invalid or expired",
                            "request_id": request_id
                        }
                    )
                
                elif response.status_code == 401:
                    # Unauthorized - refresh token expired
                    logger.warning(f"Token refresh failed - refresh token expired (request: {request_id})")
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={
                            "error": "refresh_token_expired", 
                            "message": "Refresh token has expired, please login again",
                            "request_id": request_id
                        }
                    )
                
                else:
                    # Other error - retry if attempts left
                    logger.warning(f"Token refresh attempt {attempt + 1} failed with status {response.status_code} (request: {request_id})")
                    if attempt < self.MAX_REFRESH_ATTEMPTS - 1:
                        await asyncio.sleep(self.REFRESH_RETRY_DELAY)
                        continue
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail={
                                "error": "token_service_unavailable",
                                "message": "Token refresh service temporarily unavailable",
                                "request_id": request_id
                            }
                        )
                        
            except httpx.TimeoutException:
                logger.error(f"Token refresh timeout on attempt {attempt + 1} (request: {request_id})")
                if attempt < self.MAX_REFRESH_ATTEMPTS - 1:
                    await asyncio.sleep(self.REFRESH_RETRY_DELAY)
                    continue
                else:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail={
                            "error": "token_service_timeout",
                            "message": "Token refresh service timeout",
                            "request_id": request_id
                        }
                    )
            
            except Exception as e:
                logger.error(f"Unexpected error during token refresh: {str(e)} (request: {request_id})")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail={
                        "error": "token_refresh_failed",
                        "message": "Token refresh failed due to internal error",
                        "request_id": request_id
                    }
                )
    
    def _parse_token_response(self, token_data: Dict[str, Any]) -> TokenInfo:
        """Parse token response from Keycloak"""
        current_time = datetime.utcnow()
        expires_in = token_data.get("expires_in", 900)
        
        return TokenInfo(
            access_token=token_data["access_token"],
            refresh_token=token_data.get("refresh_token"),
            expires_in=expires_in,
            token_type=token_data.get("token_type", "Bearer"),
            scope=token_data.get("scope"),
            issued_at=current_time,
            expires_at=current_time + timedelta(seconds=expires_in)
        )
    
    def check_token_expiration(self, token: str) -> Tuple[bool, int]:
        """
        Check if token needs refresh
        
        Args:
            token: JWT access token
            
        Returns:
            Tuple of (needs_refresh, seconds_until_expiry)
        """
        try:
            # Decode without verification to get expiration
            payload = jwt.get_unverified_claims(token)
            exp = payload.get("exp")
            
            if not exp:
                return True, 0  # No expiration claim, needs refresh
            
            current_time = datetime.utcnow().timestamp()
            seconds_until_expiry = exp - current_time
            
            if seconds_until_expiry <= 0:
                return True, 0  # Already expired
            
            # Check if within refresh threshold
            needs_refresh = seconds_until_expiry <= self.REFRESH_THRESHOLD_SECONDS
            
            return needs_refresh, int(seconds_until_expiry)
            
        except Exception as e:
            logger.warning(f"Error checking token expiration: {str(e)}")
            return True, 0  # On error, assume needs refresh
    
    def extract_refresh_token_from_request(self, request: Request) -> Optional[str]:
        """Extract refresh token from request headers or cookies"""
        
        # Check Authorization header for refresh token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Refresh "):
            return auth_header[8:]  # Remove "Refresh " prefix
        
        # Check X-Refresh-Token header
        refresh_header = request.headers.get("X-Refresh-Token")
        if refresh_header:
            return refresh_header
        
        # Check cookies for refresh token
        refresh_cookie = request.cookies.get("refresh_token")
        if refresh_cookie:
            return refresh_cookie
        
        return None
    
    async def revoke_refresh_token(
        self,
        refresh_token: str,
        request_id: Optional[str] = None
    ) -> bool:
        """
        Revoke refresh token (logout)
        
        Args:
            refresh_token: Refresh token to revoke
            request_id: Optional request ID for logging
            
        Returns:
            True if successful, False otherwise
        """
        logger.info(f"Revoking refresh token (request: {request_id})")
        
        revoke_data = {
            "token": refresh_token,
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "MakrX-Backend/1.0"
        }
        
        revoke_endpoint = f"{self.keycloak_url}/realms/{self.realm}/protocol/openid-connect/revoke"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    revoke_endpoint,
                    data=revoke_data,
                    headers=headers
                )
            
            if response.status_code == 200:
                logger.info(f"Refresh token revoked successfully (request: {request_id})")
                return True
            else:
                logger.warning(f"Token revocation failed with status {response.status_code} (request: {request_id})")
                return False
                
        except Exception as e:
            logger.error(f"Error revoking refresh token: {str(e)} (request: {request_id})")
            return False


class TokenExpirationMiddleware:
    """Middleware to handle token expiration and automatic refresh"""
    
    def __init__(self, refresh_service: TokenRefreshService):
        self.refresh_service = refresh_service
    
    async def check_and_refresh_token(self, request: Request) -> Optional[TokenInfo]:
        """
        Check token expiration and refresh if needed
        
        Args:
            request: FastAPI request object
            
        Returns:
            New TokenInfo if refresh was performed, None otherwise
        """
        # Get current access token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        access_token = auth_header[7:]  # Remove "Bearer " prefix
        request_id = getattr(request.state, "request_id", "unknown")
        
        # Check if token needs refresh
        needs_refresh, seconds_left = self.refresh_service.check_token_expiration(access_token)
        
        if not needs_refresh:
            return None
        
        logger.info(f"Token expiring in {seconds_left} seconds, attempting refresh (request: {request_id})")
        
        # Get refresh token
        refresh_token = self.refresh_service.extract_refresh_token_from_request(request)
        if not refresh_token:
            logger.warning(f"No refresh token available for automatic refresh (request: {request_id})")
            return None
        
        try:
            # Perform refresh
            new_token_info = await self.refresh_service.refresh_access_token(
                refresh_token, 
                request_id
            )
            
            logger.info(f"Token refreshed successfully (request: {request_id})")
            return new_token_info
            
        except HTTPException as e:
            logger.warning(f"Automatic token refresh failed: {e.detail} (request: {request_id})")
            return None


# Utility functions for token management

async def refresh_token_endpoint(
    request: Request,
    refresh_service: TokenRefreshService = Depends()
) -> JSONResponse:
    """
    Endpoint for manual token refresh
    
    POST /auth/refresh
    Body: {"refresh_token": "..."}
    """
    try:
        body = await request.json()
        refresh_token = body.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "missing_refresh_token",
                    "message": "Refresh token is required"
                }
            )
        
        request_id = getattr(request.state, "request_id", "unknown")
        token_info = await refresh_service.refresh_access_token(refresh_token, request_id)
        
        return JSONResponse({
            "access_token": token_info.access_token,
            "token_type": token_info.token_type,
            "expires_in": token_info.expires_in,
            "refresh_token": token_info.refresh_token,
            "scope": token_info.scope
        })
        
    except Exception as e:
        logger.error(f"Token refresh endpoint error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "refresh_failed",
                "message": "Token refresh failed"
            }
        )


async def logout_endpoint(
    request: Request,
    refresh_service: TokenRefreshService = Depends()
) -> JSONResponse:
    """
    Endpoint for logout (revoke refresh token)
    
    POST /auth/logout
    Body: {"refresh_token": "..."}
    """
    try:
        body = await request.json()
        refresh_token = body.get("refresh_token")
        
        if refresh_token:
            request_id = getattr(request.state, "request_id", "unknown")
            await refresh_service.revoke_refresh_token(refresh_token, request_id)
        
        return JSONResponse({
            "message": "Logged out successfully"
        })
        
    except Exception as e:
        logger.error(f"Logout endpoint error: {str(e)}")
        # Don't fail logout even if revocation fails
        return JSONResponse({
            "message": "Logged out successfully"
        })


def create_token_response_headers(token_info: TokenInfo) -> Dict[str, str]:
    """Create headers for token response"""
    headers = {
        "X-Token-Expires-In": str(token_info.expires_in),
        "X-Token-Type": token_info.token_type
    }
    
    if token_info.expires_at:
        headers["X-Token-Expires-At"] = token_info.expires_at.isoformat()
    
    return headers
