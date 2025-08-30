"""
Comprehensive JWT Error Handling and Logging System
Provides detailed error tracking, security event logging, and attack detection
"""

import logging
import time
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from collections import defaultdict, deque
from dataclasses import dataclass
from enum import Enum
import json

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


class JWTErrorType(Enum):
    """Categorized JWT error types for better tracking"""
    
    # Token structure errors
    MALFORMED_TOKEN = "malformed_token"
    INVALID_HEADER = "invalid_header"
    MISSING_CLAIMS = "missing_claims"
    
    # Security validation errors
    EXPIRED_TOKEN = "expired_token"
    INVALID_SIGNATURE = "invalid_signature"
    INVALID_ISSUER = "invalid_issuer"
    INVALID_AUDIENCE = "invalid_audience"
    INVALID_ALGORITHM = "invalid_algorithm"
    
    # Timing validation errors
    TOKEN_NOT_YET_VALID = "token_not_yet_valid"
    TOKEN_TOO_OLD = "token_too_old"
    INVALID_ISSUED_AT = "invalid_issued_at"
    
    # Authentication errors
    MISSING_TOKEN = "missing_token"
    INVALID_TOKEN_TYPE = "invalid_token_type"
    REVOKED_TOKEN = "revoked_token"
    
    # Authorization errors
    INSUFFICIENT_PRIVILEGES = "insufficient_privileges"
    SCOPE_MISMATCH = "scope_mismatch"
    TENANT_MISMATCH = "tenant_mismatch"
    
    # Network and infrastructure errors
    JWKS_FETCH_ERROR = "jwks_fetch_error"
    KEY_NOT_FOUND = "key_not_found"
    NETWORK_ERROR = "network_error"
    
    # Attack indicators
    REPLAY_ATTACK = "replay_attack"
    BRUTE_FORCE_ATTEMPT = "brute_force_attempt"
    SUSPICIOUS_PATTERN = "suspicious_pattern"


@dataclass
class SecurityEvent:
    """Security event data structure"""
    timestamp: datetime
    event_type: JWTErrorType
    client_ip: str
    user_agent: str
    request_id: str
    user_id: Optional[str] = None
    token_jti: Optional[str] = None
    error_details: Optional[Dict[str, Any]] = None
    threat_level: str = "LOW"  # LOW, MEDIUM, HIGH, CRITICAL


class ThreatDetector:
    """Detects potential security threats based on JWT errors"""
    
    def __init__(self):
        # Track events per IP address
        self.ip_events = defaultdict(lambda: deque(maxlen=100))
        # Track failed attempts per user
        self.user_failures = defaultdict(lambda: deque(maxlen=50))
        # Track suspicious patterns
        self.pattern_cache = defaultdict(int)
        
        # Threat detection thresholds
        self.BRUTE_FORCE_THRESHOLD = 10  # failures per hour
        self.SUSPICIOUS_IP_THRESHOLD = 20  # errors per hour
        self.PATTERN_THRESHOLD = 5  # repeated patterns
    
    def analyze_threat_level(self, event: SecurityEvent) -> str:
        """Analyze and determine threat level"""
        
        # Update tracking data
        current_time = datetime.utcnow()
        self.ip_events[event.client_ip].append(current_time)
        
        if event.user_id:
            self.user_failures[event.user_id].append(current_time)
        
        # Pattern analysis
        pattern_key = f"{event.event_type.value}:{event.client_ip}"
        self.pattern_cache[pattern_key] += 1
        
        # Calculate threat level
        threat_level = "LOW"
        
        # Check for brute force attacks
        if event.event_type in [JWTErrorType.EXPIRED_TOKEN, JWTErrorType.INVALID_SIGNATURE]:
            hour_ago = current_time - timedelta(hours=1)
            recent_events = [t for t in self.ip_events[event.client_ip] if t > hour_ago]
            
            if len(recent_events) > self.BRUTE_FORCE_THRESHOLD:
                threat_level = "HIGH"
                event.event_type = JWTErrorType.BRUTE_FORCE_ATTEMPT
        
        # Check for suspicious IP patterns
        hour_ago = current_time - timedelta(hours=1)
        recent_ip_events = [t for t in self.ip_events[event.client_ip] if t > hour_ago]
        
        if len(recent_ip_events) > self.SUSPICIOUS_IP_THRESHOLD:
            threat_level = "MEDIUM"
        
        # Check for repeated attack patterns
        if self.pattern_cache[pattern_key] > self.PATTERN_THRESHOLD:
            threat_level = "MEDIUM"
            event.event_type = JWTErrorType.SUSPICIOUS_PATTERN
        
        # Critical errors always high threat
        if event.event_type in [JWTErrorType.INVALID_SIGNATURE, JWTErrorType.INVALID_ALGORITHM]:
            threat_level = "HIGH"
        
        return threat_level
    
    def should_block_ip(self, client_ip: str) -> bool:
        """Determine if IP should be temporarily blocked"""
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_events = [t for t in self.ip_events[client_ip] if t > hour_ago]
        return len(recent_events) > self.BRUTE_FORCE_THRESHOLD * 2


class JWTSecurityLogger:
    """Comprehensive JWT security event logger"""
    
    def __init__(self):
        self.threat_detector = ThreatDetector()
        self.blocked_ips = {}  # IP -> block_until_timestamp
        
        # Configure security logger
        self.security_logger = logging.getLogger('security.jwt')
        self.security_logger.setLevel(logging.INFO)
        
        # Create security-specific formatter
        security_formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "event": "jwt_security", '
            '"message": "%(message)s", "module": "%(name)s"}'
        )
        
        # Ensure security events go to security log
        if not self.security_logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(security_formatter)
            self.security_logger.addHandler(handler)
    
    def log_jwt_error(
        self, 
        error_type: JWTErrorType,
        request: Request,
        user_id: Optional[str] = None,
        token_jti: Optional[str] = None,
        error_details: Optional[Dict[str, Any]] = None
    ) -> SecurityEvent:
        """Log JWT error with threat analysis"""
        
        # Extract request information
        client_ip = self._get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "Unknown")
        request_id = getattr(request.state, "request_id", "unknown")
        
        # Create security event
        event = SecurityEvent(
            timestamp=datetime.utcnow(),
            event_type=error_type,
            client_ip=client_ip,
            user_agent=user_agent,
            request_id=request_id,
            user_id=user_id,
            token_jti=token_jti,
            error_details=error_details or {}
        )
        
        # Analyze threat level
        event.threat_level = self.threat_detector.analyze_threat_level(event)
        
        # Check if IP should be blocked
        if self.threat_detector.should_block_ip(client_ip):
            self._block_ip_temporarily(client_ip)
        
        # Log security event
        self._log_security_event(event)
        
        # Send alerts for high-threat events
        if event.threat_level in ["HIGH", "CRITICAL"]:
            self._send_security_alert(event)
        
        return event
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract real client IP considering proxy headers"""
        # Check for forwarded headers (reverse proxy)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP (original client)
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to direct connection
        return request.client.host if request.client else "unknown"
    
    def _log_security_event(self, event: SecurityEvent) -> None:
        """Log security event with structured data"""
        
        log_data = {
            "event_type": event.event_type.value,
            "threat_level": event.threat_level,
            "client_ip": event.client_ip,
            "user_agent": event.user_agent[:100],  # Truncate long user agents
            "request_id": event.request_id,
            "timestamp": event.timestamp.isoformat(),
        }
        
        if event.user_id:
            log_data["user_id"] = event.user_id
        
        if event.token_jti:
            log_data["token_jti"] = event.token_jti
        
        if event.error_details:
            log_data["error_details"] = event.error_details
        
        # Log with appropriate level based on threat
        if event.threat_level == "CRITICAL":
            self.security_logger.critical(json.dumps(log_data))
        elif event.threat_level == "HIGH":
            self.security_logger.error(json.dumps(log_data))
        elif event.threat_level == "MEDIUM":
            self.security_logger.warning(json.dumps(log_data))
        else:
            self.security_logger.info(json.dumps(log_data))
    
    def _block_ip_temporarily(self, client_ip: str) -> None:
        """Temporarily block suspicious IP"""
        block_duration = timedelta(hours=1)  # Block for 1 hour
        block_until = datetime.utcnow() + block_duration
        
        self.blocked_ips[client_ip] = block_until.timestamp()
        
        self.security_logger.error(json.dumps({
            "event_type": "ip_blocked",
            "client_ip": client_ip,
            "block_until": block_until.isoformat(),
            "reason": "excessive_jwt_errors"
        }))
    
    def _send_security_alert(self, event: SecurityEvent) -> None:
        """Send security alert for high-threat events"""
        
        alert_data = {
            "alert_type": "jwt_security_incident",
            "severity": event.threat_level,
            "event_type": event.event_type.value,
            "client_ip": event.client_ip,
            "timestamp": event.timestamp.isoformat(),
            "user_id": event.user_id,
            "details": event.error_details
        }
        
        # Log alert (in production, this would also send to monitoring system)
        self.security_logger.critical(json.dumps({
            "alert": True,
            **alert_data
        }))
        
        # TODO: Integration with monitoring systems (Slack, email, PagerDuty)
        # self._send_to_monitoring_system(alert_data)
    
    def is_ip_blocked(self, client_ip: str) -> bool:
        """Check if IP is currently blocked"""
        if client_ip not in self.blocked_ips:
            return False
        
        block_until = self.blocked_ips[client_ip]
        if time.time() > block_until:
            # Block expired, remove from list
            del self.blocked_ips[client_ip]
            return False
        
        return True
    
    def get_security_stats(self) -> Dict[str, Any]:
        """Get security statistics for monitoring"""
        current_time = datetime.utcnow()
        hour_ago = current_time - timedelta(hours=1)
        
        # Count recent events by type
        event_counts = defaultdict(int)
        for ip_events in self.threat_detector.ip_events.values():
            for event_time in ip_events:
                if event_time > hour_ago:
                    event_counts["total"] += 1
        
        return {
            "timestamp": current_time.isoformat(),
            "blocked_ips": len(self.blocked_ips),
            "events_last_hour": event_counts["total"],
            "unique_ips_last_hour": len([
                ip for ip, events in self.threat_detector.ip_events.items()
                if any(t > hour_ago for t in events)
            ]),
            "threat_patterns": len(self.threat_detector.pattern_cache),
        }


# Global security logger instance
jwt_security_logger = JWTSecurityLogger()


def create_jwt_error_response(
    error_type: JWTErrorType,
    request: Request,
    user_id: Optional[str] = None,
    token_jti: Optional[str] = None,
    error_details: Optional[Dict[str, Any]] = None,
    custom_message: Optional[str] = None
) -> HTTPException:
    """Create standardized JWT error response with security logging"""
    
    # Log security event
    event = jwt_security_logger.log_jwt_error(
        error_type=error_type,
        request=request,
        user_id=user_id,
        token_jti=token_jti,
        error_details=error_details
    )
    
    # Map error types to HTTP status codes
    status_code_map = {
        JWTErrorType.MISSING_TOKEN: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.MALFORMED_TOKEN: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.EXPIRED_TOKEN: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INVALID_SIGNATURE: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INVALID_ISSUER: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INVALID_AUDIENCE: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INVALID_ALGORITHM: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.TOKEN_NOT_YET_VALID: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INVALID_TOKEN_TYPE: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.REVOKED_TOKEN: status.HTTP_401_UNAUTHORIZED,
        JWTErrorType.INSUFFICIENT_PRIVILEGES: status.HTTP_403_FORBIDDEN,
        JWTErrorType.SCOPE_MISMATCH: status.HTTP_403_FORBIDDEN,
        JWTErrorType.TENANT_MISMATCH: status.HTTP_403_FORBIDDEN,
        JWTErrorType.JWKS_FETCH_ERROR: status.HTTP_503_SERVICE_UNAVAILABLE,
        JWTErrorType.NETWORK_ERROR: status.HTTP_503_SERVICE_UNAVAILABLE,
    }
    
    # Map error types to user-friendly messages
    message_map = {
        JWTErrorType.MISSING_TOKEN: "Authentication required",
        JWTErrorType.MALFORMED_TOKEN: "Invalid authentication token",
        JWTErrorType.EXPIRED_TOKEN: "Authentication token has expired",
        JWTErrorType.INVALID_SIGNATURE: "Invalid authentication token",
        JWTErrorType.INVALID_ISSUER: "Invalid authentication token",
        JWTErrorType.INVALID_AUDIENCE: "Invalid authentication token",
        JWTErrorType.INVALID_ALGORITHM: "Invalid authentication token",
        JWTErrorType.TOKEN_NOT_YET_VALID: "Authentication token not yet valid",
        JWTErrorType.INVALID_TOKEN_TYPE: "Invalid authentication token type",
        JWTErrorType.REVOKED_TOKEN: "Authentication token has been revoked",
        JWTErrorType.INSUFFICIENT_PRIVILEGES: "Insufficient privileges",
        JWTErrorType.SCOPE_MISMATCH: "Access denied",
        JWTErrorType.TENANT_MISMATCH: "Access denied",
        JWTErrorType.JWKS_FETCH_ERROR: "Authentication service unavailable",
        JWTErrorType.NETWORK_ERROR: "Authentication service unavailable",
    }
    
    status_code = status_code_map.get(error_type, status.HTTP_401_UNAUTHORIZED)
    message = custom_message or message_map.get(error_type, "Authentication failed")
    
    error_response = {
        "error": "Authentication Error" if status_code == 401 else "Authorization Error",
        "message": message,
        "code": error_type.value,
        "request_id": getattr(request.state, "request_id", "unknown"),
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Add threat level for security teams (not exposed to users)
    if event.threat_level in ["HIGH", "CRITICAL"]:
        logger.error(f"High-threat JWT error: {error_type.value} from {event.client_ip}")
    
    return HTTPException(
        status_code=status_code,
        detail=error_response,
        headers={"WWW-Authenticate": "Bearer"}
    )


def check_ip_blocked(request: Request) -> None:
    """Check if requesting IP is blocked"""
    client_ip = jwt_security_logger._get_client_ip(request)
    
    if jwt_security_logger.is_ip_blocked(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate Limited",
                "message": "Too many authentication failures. Try again later.",
                "code": "ip_blocked",
                "request_id": getattr(request.state, "request_id", "unknown"),
                "timestamp": datetime.utcnow().isoformat()
            },
            headers={"Retry-After": "3600"}  # 1 hour
        )
