from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel

from lib.auth import COOKIE_NAME, SESSION_TTL_SECONDS, make_session_token, owner_pin, token_is_valid

router = APIRouter(prefix="/auth", tags=["auth"])

class OwnerLogin(BaseModel):
    pin: str

class AuthStatus(BaseModel):
    authenticated: bool
    role: str

@router.post("/owner-login", response_model=AuthStatus)
async def owner_login(payload: OwnerLogin, response: Response):
    if payload.pin.strip() != owner_pin():
        raise HTTPException(status_code=401, detail="Incorrect PIN. Please try again.")

    response.set_cookie(
        key=COOKIE_NAME,
        value=make_session_token(),
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=SESSION_TTL_SECONDS,
        path="/",
    )
    return AuthStatus(authenticated=True, role="owner")

@router.get("/me", response_model=AuthStatus)
async def auth_me(request: Request):
    ok = token_is_valid(request.cookies.get(COOKIE_NAME))
    return AuthStatus(authenticated=ok, role="owner" if ok else "guest")

@router.post("/logout", response_model=AuthStatus)
async def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return AuthStatus(authenticated=False, role="guest")
