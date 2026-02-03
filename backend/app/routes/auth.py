"""Authentication routes."""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional

from ..config import get_settings
from ..models.user import User, UserLogin, Token, UserRole
from ..data.mock_db import get_user_by_username, get_user_by_id, USERS_DB

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()


def create_access_token(user_id: str) -> str:
    """Create JWT access token."""
    expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiry_hours)
    payload = {
        "sub": user_id,
        "exp": expire
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    # For demo, accept "demo123" for all users
    if plain_password == "demo123":
        return True
    return pwd_context.verify(plain_password, hashed_password)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current user from JWT token."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_data = get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(
            id=user_data["id"],
            name=user_data["name"],
            username=user_data["username"],
            role=UserRole(user_data["role"]),
            district=user_data["district"],
            cluster=user_data.get("cluster"),
            school=user_data.get("school"),
            language=user_data.get("language", "hi"),
            grade_teaching=user_data.get("grade_teaching"),
            subjects=user_data.get("subjects")
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and get access token."""
    
    user_data = get_user_by_username(credentials.username)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user_data.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(user_data["id"])
    
    user = User(
        id=user_data["id"],
        name=user_data["name"],
        username=user_data["username"],
        role=UserRole(user_data["role"]),
        district=user_data["district"],
        cluster=user_data.get("cluster"),
        school=user_data.get("school"),
        language=user_data.get("language", "hi"),
        grade_teaching=user_data.get("grade_teaching"),
        subjects=user_data.get("subjects")
    )
    
    return Token(access_token=token, user=user)


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.get("/users")
async def get_demo_users():
    """Get list of demo users for easy login."""
    demo_users = []
    for user_id, user in USERS_DB.items():
        demo_users.append({
            "username": user["username"],
            "name": user["name"],
            "role": user["role"],
            "password": "demo123"
        })
    return {"users": demo_users}
