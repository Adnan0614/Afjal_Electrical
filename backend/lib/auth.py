import hashlib
import hmac
import os
import time

from fastapi import HTTPException, Request

COOKIE_NAME = "owner_session"
SESSION_TTL_SECONDS = 60 * 60 * 12  # 12 hours


def _secret() -> str:
    return os.environ.get("OWNER_SESSION_SECRET", "afjal-electricals-dev-secret")


def owner_pin() -> str:
    return os.environ.get("OWNER_PIN", "2003")


def make_session_token() -> str:
    """Signed, expiring token: <issued_at>.<hmac>"""
    issued = str(int(time.time()))
    sig = hmac.new(_secret().encode(), issued.encode(), hashlib.sha256).hexdigest()
    return f"{issued}.{sig}"


def token_is_valid(token: str | None) -> bool:
    if not token or "." not in token:
        return False

    issued_raw, sig = token.rsplit(".", 1)
    expected = hmac.new(_secret().encode(), issued_raw.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return False

    # Parse first and return early on failure so `issued` is unambiguously bound
    # on every path that reaches the expiry check below.
    if not issued_raw.isdigit():
        return False
    issued: int = int(issued_raw)

    return (time.time() - issued) < SESSION_TTL_SECONDS


def require_owner(request: Request) -> bool:
    """FastAPI dependency — raises 401 unless a valid owner cookie is present."""
    if not token_is_valid(request.cookies.get(COOKIE_NAME)):
        raise HTTPException(status_code=401, detail="Owner authentication required")
    return True
