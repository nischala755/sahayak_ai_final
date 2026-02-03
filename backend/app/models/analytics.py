"""Analytics models for dashboards."""
from pydantic import BaseModel
from typing import Optional
from enum import Enum


class ReadinessSignal(str, Enum):
    """Classroom readiness status."""
    READY = "ready"
    NEEDS_SUPPORT = "needs_support"
    AT_RISK = "at_risk"


class LearningGap(BaseModel):
    """Learning gap indicator."""
    topic: str
    subject: str
    grade: int
    gap_score: float  # 0-1, higher = bigger gap
    affected_schools: int
    affected_teachers: int
    trend: str = "stable"  # increasing, decreasing, stable


class TrainingNeed(BaseModel):
    """Training requirement indicator."""
    topic: str
    subject: str
    priority: str  # high, medium, low
    teacher_count: int
    failure_rate: float
    recommended_training: str


class CategoryStats(BaseModel):
    """Statistics per SOS category."""
    category: str
    count: int
    success_rate: float
    avg_response_time: float


class TeacherEngagement(BaseModel):
    """Teacher engagement metrics."""
    teacher_id: str
    teacher_name: str
    school: str
    sos_count: int
    success_rate: float
    most_common_topic: str
    readiness: ReadinessSignal


class TeacherAnalytics(BaseModel):
    """Teacher dashboard analytics."""
    total_sos: int
    success_rate: float
    readiness_signal: ReadinessSignal
    recent_sos: list[dict]
    saved_solutions: list[dict]
    upcoming_topics: list[str]


class CRPAnalytics(BaseModel):
    """CRP dashboard analytics."""
    total_teachers: int
    total_sos: int
    overall_success_rate: float
    category_distribution: list[CategoryStats]
    teacher_engagement: list[TeacherEngagement]
    top_issues: list[dict]
    at_risk_teachers: int


class DIETAnalytics(BaseModel):
    """DIET dashboard analytics."""
    total_clusters: int
    total_schools: int
    total_teachers: int
    learning_gaps: list[LearningGap]
    training_needs: list[TrainingNeed]
    difficulty_trends: list[dict]
    district_health_score: float
