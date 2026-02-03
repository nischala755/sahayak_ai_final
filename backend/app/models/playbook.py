"""Playbook models for teaching guidance."""
from pydantic import BaseModel
from typing import Optional


class Activity(BaseModel):
    """Classroom activity details."""
    name: str
    steps: list[str]
    materials: list[str]
    duration_minutes: int
    difficulty: str = "easy"


class QuickCheck(BaseModel):
    """Quick understanding check."""
    questions: list[str]
    expected_responses: list[str]
    success_indicators: list[str]


class NCERTRef(BaseModel):
    """NCERT textbook reference."""
    grade: int
    subject: str
    chapter: str
    chapter_number: int
    page_range: Optional[str] = None
    topic: str
    link: Optional[str] = None


class Video(BaseModel):
    """YouTube video reference."""
    id: str
    title: str
    channel: str
    duration: str
    thumbnail: str
    embed_url: str
    language: str
    grade: int
    relevance_score: float = 0.8


class Playbook(BaseModel):
    """Complete teaching playbook."""
    id: str
    problem: str
    what_to_say: list[str]
    activity: Activity
    class_management: list[str]
    quick_check: QuickCheck
    ncert_refs: list[NCERTRef] = []
    videos: list[Video] = []
    trust_score: float = 0.8
    usage_count: int = 0
    language: str = "hi"
