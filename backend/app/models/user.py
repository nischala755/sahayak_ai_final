"""User models for authentication and role management."""
from pydantic import BaseModel
from enum import Enum
from typing import Optional


class UserRole(str, Enum):
    """User roles in the system."""
    TEACHER = "teacher"
    CRP = "crp"
    DIET = "diet"


class User(BaseModel):
    """User model."""
    id: str
    name: str
    username: str
    role: UserRole
    district: str
    cluster: Optional[str] = None
    school: Optional[str] = None
    language: str = "hi"  # Default Hindi
    grade_teaching: Optional[list[int]] = None
    subjects: Optional[list[str]] = None


class UserCreate(BaseModel):
    """User registration model."""
    name: str
    username: str
    password: str
    role: UserRole
    district: str
    cluster: Optional[str] = None
    school: Optional[str] = None
    language: str = "hi"


class UserLogin(BaseModel):
    """Login request model."""
    username: str
    password: str


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: User
