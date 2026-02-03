"""SOS request and response models."""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SOSContext(BaseModel):
    """Context extracted from SOS request."""
    grade: Optional[int] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    language: str = "hi"
    rural_constraints: Optional[list[str]] = None


class SOSRequest(BaseModel):
    """SOS submission request."""
    text: Optional[str] = None
    audio_base64: Optional[str] = None
    context: Optional[SOSContext] = None
    teacher_id: Optional[str] = None


class QuickFix(BaseModel):
    """Cached quick fix solution."""
    id: str
    problem: str
    solution_summary: str
    grade: int
    subject: str
    topic: str
    usage_count: int = 0
    success_rate: float = 0.8
    language: str = "hi"


class SOSHistory(BaseModel):
    """Historical SOS record."""
    id: str
    teacher_id: str
    request_text: str
    context: SOSContext
    response_id: str
    from_cache: bool
    success: Optional[bool] = None
    created_at: datetime
    feedback: Optional[str] = None


class SOSResponse(BaseModel):
    """Response to SOS request."""
    sos_id: str
    extracted_context: SOSContext
    playbook: dict  # Full playbook object
    from_cache: bool
    cache_key: Optional[str] = None
    similar_solutions: Optional[list[dict]] = None
