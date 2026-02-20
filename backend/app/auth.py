"""Authentication module: JWT token creation and admin verification."""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


class Token(BaseModel):
    """JWT token response schema."""

    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    """Admin login request schema."""

    username: str
    password: str


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain-text password against a hashed one.

    Args:
        plain: Plain-text password
        hashed: Bcrypt-hashed password

    Returns:
        True if passwords match
    """
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt.

    Args:
        password: Plain-text password

    Returns:
        Bcrypt hash string
    """
    return pwd_context.hash(password)


def create_access_token(data: dict[str, str]) -> str:
    """Create a JWT access token.

    Args:
        data: Claims to encode in the token

    Returns:
        Encoded JWT string
    """
    to_encode: dict = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def authenticate_admin(username: str, password: str) -> bool:
    """Verify admin credentials against environment config.

    Args:
        username: Provided username
        password: Provided password

    Returns:
        True if credentials are valid
    """
    return (
        username == settings.admin_username
        and password == settings.admin_password
    )


async def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> str:
    """Validate JWT token and return admin username.

    Args:
        token: Bearer token from Authorization header

    Returns:
        Admin username extracted from token

    Raises:
        HTTPException: If token is invalid or expired
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[ALGORITHM]
        )
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
