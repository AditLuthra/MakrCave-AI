"""
Standardized JWT Validation Utility for MakrX Ecosystem
Provides secure, consistent JWT validation across all services
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status, Request
from schemas.auth_error import AuthError
from .jwt_error_handler import (
    JWTErrorType,
    create_jwt_error_response,
    check_ip_blocked,
    jwt_security_logger
)

logger = logging.getLogger(__name__)


class JWTSecurityConfig:
    """Centralized JWT security configuration"""
    
    # Allowed algorithms (only RS256 for Keycloak)
    ALLOWED_ALGORITHMS = ["RS256"]
    
    # Token validation options (secure defaults)
    VALIDATION_OPTIONS = {
        "verify_signature": True,
        "verify_exp": True,
        "verify_nbf": True,
        "verify_iat": True,
        "verify_aud": True,
        "verify_iss": True,
        "require_exp": True,
        "require_iat": True,
        "require_nbf": False,  # Not all tokens have nbf
        "require_aud": True,
        "require_iss": True,
    }
    
    # Time tolerances
    LEEWAY_SECONDS = 30  # Allow 30 seconds clock skew
    MAX_TOKEN_AGE_HOURS = 24  # Maximum token age
    MIN_TOKEN_LIFETIME_MINUTES = 5  # Minimum token lifetime


class SecureJWTValidator:
    """Secure JWT validator with comprehensive validation"""
    
    def __init__(self, keycloak_url: str, realm: str, audience: str):
        self.keycloak_url = keycloak_url
        self.realm = realm
        self.audience = audience
        self.issuer = f"{keycloak_url}/realms/{realm}"
    
    async def validate_token(
        self,
        token: str,
        key: str,
        request: Request,
        additional_audiences: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Validate JWT token with comprehensive security checks
        
        Args:
            token: JWT token to validate
            key: Public key for signature verification
            request_id: Optional request ID for logging
            additional_audiences: Additional valid audiences
            
        Returns:
            Dict containing validated token payload
            
        Raises:
            HTTPException: If token validation fails
        """
        try:
            # Check if IP is blocked due to previous security violations
            check_ip_blocked(request)

            # Parse token header without verification to check algorithm
            try:
                header = jwt.get_unverified_header(token)
            except Exception:
                raise create_jwt_error_response(
                    JWTErrorType.MALFORMED_TOKEN,
                    request,
                    error_details={"reason": "Invalid token header"}
                )

            algorithm = header.get("alg")
            token_id = header.get("jti")  # Token ID for tracking

            # Validate algorithm
            if algorithm not in JWTSecurityConfig.ALLOWED_ALGORITHMS:
                raise create_jwt_error_response(
                    JWTErrorType.INVALID_ALGORITHM,
                    request,
                    token_jti=token_id,
                    error_details={"algorithm": algorithm, "allowed": JWTSecurityConfig.ALLOWED_ALGORITHMS}
                )
            
            # Prepare audience list
            audiences = [self.audience]
            if additional_audiences:
                audiences.extend(additional_audiences)
            
            # Validate token with all security checks enabled
            payload = jwt.decode(
                token,
                key,
                algorithms=JWTSecurityConfig.ALLOWED_ALGORITHMS,
                audience=audiences,
                issuer=self.issuer,
                options=JWTSecurityConfig.VALIDATION_OPTIONS,
                leeway=timedelta(seconds=JWTSecurityConfig.LEEWAY_SECONDS)
            )
            
            # Additional security validations
            await self._validate_token_security(payload, request_id)
            
            # Log successful validation
            logger.info(f"JWT validation successful for user {payload.get('sub')} (request: {request_id})")
            
            return payload
            
        except JWTError as e:
            error_type = type(e).__name__
            request_id = getattr(request.state, "request_id", "unknown")

            # Extract user ID and token ID if available from payload
            user_id = None
            token_id = None
            try:
                # Try to get some info from unverified payload for logging
                unverified_payload = jwt.get_unverified_claims(token)
                user_id = unverified_payload.get("sub")
                token_id = unverified_payload.get("jti")
            except:
                pass  # Ignore errors in unverified payload extraction

            # Map specific JWT errors to appropriate security error types
            if "ExpiredSignature" in error_type:
                raise create_jwt_error_response(
                    JWTErrorType.EXPIRED_TOKEN,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
            elif "InvalidAudience" in error_type:
                raise create_jwt_error_response(
                    JWTErrorType.INVALID_AUDIENCE,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
            elif "InvalidIssuer" in error_type:
                raise create_jwt_error_response(
                    JWTErrorType.INVALID_ISSUER,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
            elif "InvalidSignature" in error_type:
                raise create_jwt_error_response(
                    JWTErrorType.INVALID_SIGNATURE,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
            elif "InvalidKey" in error_type:
                raise create_jwt_error_response(
                    JWTErrorType.KEY_NOT_FOUND,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
            else:
                raise create_jwt_error_response(
                    JWTErrorType.MALFORMED_TOKEN,
                    request,
                    user_id=user_id,
                    token_jti=token_id,
                    error_details={"jwt_error": error_type, "message": str(e)}
                )
        
        except Exception as e:
            request_id = getattr(request.state, "request_id", "unknown")
            logger.error(f"Unexpected JWT validation error: {str(e)} (request: {request_id})")
            raise create_jwt_error_response(
                JWTErrorType.MALFORMED_TOKEN,
                request,
                error_details={"unexpected_error": str(e), "error_type": type(e).__name__}
            )
    
    async def _validate_token_security(self, payload: Dict[str, Any], request: Request) -> None:
        """Additional security validations beyond standard JWT checks"""
        
        # Validate token type
        token_type = payload.get("typ")
        if token_type and token_type.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=self._create_error("Invalid token type", "invalid_token_type", request_id),
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Validate token age (additional check beyond exp)
        issued_at = payload.get("iat")
        if issued_at:
            max_age = datetime.utcnow().timestamp() - (JWTSecurityConfig.MAX_TOKEN_AGE_HOURS * 3600)
            if issued_at < max_age:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=self._create_error("Token too old", "token_too_old", request_id),
                    headers={"WWW-Authenticate": "Bearer"},
                )
        
        # Validate minimum token lifetime
        issued_at = payload.get("iat")
        expires_at = payload.get("exp")
        if issued_at and expires_at:
            token_lifetime = expires_at - issued_at
            min_lifetime = JWTSecurityConfig.MIN_TOKEN_LIFETIME_MINUTES * 60
            if token_lifetime < min_lifetime:
                logger.warning(f"Token with unusually short lifetime: {token_lifetime}s (request: {request_id})")
        
        # Validate required claims
        required_claims = ["sub", "iat", "exp", "iss", "aud"]
        missing_claims = [claim for claim in required_claims if claim not in payload]
        if missing_claims:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=self._create_error(
                    f"Missing required claims: {', '.join(missing_claims)}", 
                    "missing_claims", 
                    request_id
                ),
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Validate subject format (should be UUID)
        subject = payload.get("sub")
        if subject and len(subject) < 8:  # Basic sanity check
            logger.warning(f"Token with suspicious subject format: {subject} (request: {request_id})")
    
    def _create_error(self, message: str, code: str, request_id: Optional[str]) -> Dict[str, Any]:
        """Create standardized error response"""
        return AuthError(
            error="Unauthorized",
            message=message,
            code=code,
            request_id=request_id,
        ).model_dump()
    
    def extract_user_info(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Extract and normalize user information from JWT payload"""
        return {
            "id": payload.get("sub"),
            "keycloak_id": payload.get("sub"),
            "email": payload.get("email"),
            "username": payload.get("preferred_username"),
            "first_name": payload.get("given_name"),
            "last_name": payload.get("family_name"),
            "roles": payload.get("realm_access", {}).get("roles", []),
            "groups": payload.get("groups", []),
            "email_verified": payload.get("email_verified", False),
            "makerspace_id": payload.get("makerspace_id"),
            "provider_id": payload.get("provider_id"),
        }
    
    def has_role(self, payload: Dict[str, Any], required_role: str) -> bool:
        """Check if user has specific role"""
        user_roles = payload.get("realm_access", {}).get("roles", [])
        return required_role in user_roles
    
    def has_any_role(self, payload: Dict[str, Any], required_roles: List[str]) -> bool:
        """Check if user has any of the specified roles"""
        user_roles = payload.get("realm_access", {}).get("roles", [])
        return any(role in user_roles for role in required_roles)
    
    def is_admin(self, payload: Dict[str, Any]) -> bool:
        """Check if user has admin privileges"""
        return self.has_any_role(payload, ["super-admin", "makerspace-admin", "admin"])


# Utility functions for common JWT operations
def create_jwt_validator(keycloak_url: str, realm: str, audience: str) -> SecureJWTValidator:
    """Factory function to create JWT validator"""
    return SecureJWTValidator(keycloak_url, realm, audience)


def validate_service_token(
    token: str, 
    validator: SecureJWTValidator, 
    key: str,
    service_audiences: List[str],
    request_id: Optional[str] = None
) -> Dict[str, Any]:
    """Validate service-to-service JWT token"""
    return validator.validate_token(
        token, 
        key, 
        request_id=request_id,
        additional_audiences=service_audiences
    )
