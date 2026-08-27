import hashlib
import hmac
import os
import time

from fastapi import HTTPException, Request

COOKIE_NAME = "owner_session"
SESSION_TTL_SECONDS = 60 * 60 * 12


def _secret() -> str:
    secret = os.environ.get("OWNER_SESSION_SECRET")
    if not secret:
        raise RuntimeError("OWNER_SESSION_SECRET is not configured")
    return secret


def owner_pin() -> str:
    pin = os.environ.get("OWNER_PIN")
    if not pin:
        raise RuntimeError("OWNER_PIN is not configured")
    return pin


def make_session_token() -> str:
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
    if not issued_raw.isdigit():
        return False

    issued = int(issued_raw)
    age = time.time() - issued
    return 0 <= age < SESSION_TTL_SECONDS


def require_owner(request: Request) -> bool:
    if not token_is_valid(request.cookies.get(COOKIE_NAME)):
        raise HTTPException(status_code=401, detail="Owner authentication required")
    return True
