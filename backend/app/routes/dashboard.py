"""Dashboard routes for all three user roles."""
from fastapi import APIRouter, Depends, HTTPException
from collections import Counter
from datetime import datetime, timedelta
import random

from ..models.user import User, UserRole
from ..models.analytics import ReadinessSignal
from ..routes.auth import get_current_user
from ..data.mock_db import (
    get_sos_history, get_all_sos, get_solutions,
    get_teachers_by_cluster, get_teachers_by_district, USERS_DB, SOS_HISTORY_DB
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def calculate_readiness(teacher_id: str) -> ReadinessSignal:
    """Calculate classroom readiness signal for a teacher."""
    
    history = get_sos_history(teacher_id, limit=20)
    
    if not history:
        return ReadinessSignal.READY
    
    # Count topics in last 7 days
    recent = [h for h in history if h.get("created_at")]
    topic_counts = Counter(h.get("context", {}).get("topic", "unknown") for h in recent)
    
    # Check for repeated topics (more than 2 SOS for same topic)
    repeated_topics = [t for t, c in topic_counts.items() if c >= 2]
    
    # Calculate failure rate
    with_feedback = [h for h in recent if h.get("success") is not None]
    if with_feedback:
        failure_rate = sum(1 for h in with_feedback if not h.get("success")) / len(with_feedback)
    else:
        failure_rate = 0
    
    # Determine readiness
    if len(repeated_topics) > 2 or failure_rate > 0.5:
        return ReadinessSignal.AT_RISK
    elif len(repeated_topics) > 0 or failure_rate > 0.3:
        return ReadinessSignal.NEEDS_SUPPORT
    else:
        return ReadinessSignal.READY


@router.get("/teacher")
async def get_teacher_dashboard(current_user: User = Depends(get_current_user)):
    """Get teacher dashboard data."""
    
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Teacher access only")
    
    # Get SOS history
    history = get_sos_history(current_user.id, limit=10)
    
    # Calculate readiness signal
    readiness = calculate_readiness(current_user.id)
    
    # Calculate stats
    all_history = get_sos_history(current_user.id, limit=100)
    total_sos = len(all_history)
    successful = sum(1 for h in all_history if h.get("success") is True)
    success_rate = successful / total_sos if total_sos > 0 else 0
    
    # Get saved solutions (mock - user's successful SOS)
    saved_solutions = [h for h in all_history if h.get("success") is True][:5]
    
    # Upcoming topics (mock based on user's subjects)
    upcoming_topics = []
    if current_user.subjects:
        topic_suggestions = {
            "Math": ["Fractions", "Measurement", "Geometry"],
            "Hindi": ["Reading Comprehension", "Grammar", "Writing"],
            "English": ["Vocabulary", "Speaking", "Listening"],
            "EVS": ["Plants", "Animals", "Environment"]
        }
        for subject in current_user.subjects:
            upcoming_topics.extend(topic_suggestions.get(subject, [])[:2])
    
    return {
        "user": {
            "name": current_user.name,
            "school": current_user.school,
            "grades": current_user.grade_teaching,
            "subjects": current_user.subjects
        },
        "stats": {
            "total_sos": total_sos,
            "success_rate": round(success_rate, 2),
            "this_week": len([h for h in all_history[:7]])
        },
        "readiness_signal": readiness.value,
        "readiness_message": get_readiness_message(readiness),
        "recent_sos": history[:5],
        "saved_solutions": saved_solutions,
        "upcoming_topics": upcoming_topics[:5]
    }


def get_readiness_message(readiness: ReadinessSignal) -> str:
    """Get human-readable readiness message."""
    messages = {
        ReadinessSignal.READY: "आप कक्षा के लिए तैयार हैं! 🎉",
        ReadinessSignal.NEEDS_SUPPORT: "कुछ विषयों पर ध्यान दें 📚",
        ReadinessSignal.AT_RISK: "सहायता उपलब्ध है - CRP से संपर्क करें 🤝"
    }
    return messages.get(readiness, "")


@router.get("/crp")
async def get_crp_dashboard(current_user: User = Depends(get_current_user)):
    """Get CRP (Cluster Resource Person) dashboard data."""
    
    if current_user.role != UserRole.CRP:
        raise HTTPException(status_code=403, detail="CRP access only")
    
    # Get teachers in cluster
    teachers = get_teachers_by_cluster(current_user.cluster or "")
    teacher_ids = [t["id"] for t in teachers]
    
    # Get all SOS for cluster teachers
    all_sos = [s for s in SOS_HISTORY_DB.values() if s.get("teacher_id") in teacher_ids]
    
    # Calculate category distribution
    categories = Counter(s.get("context", {}).get("subject", "General") for s in all_sos)
    category_stats = [
        {"category": cat, "count": count, "percentage": round(count / len(all_sos) * 100, 1) if all_sos else 0}
        for cat, count in categories.most_common(5)
    ]
    
    # Topic distribution
    topics = Counter(s.get("context", {}).get("topic", "Other") for s in all_sos)
    top_issues = [
        {"topic": topic, "count": count, "subject": "Mixed"}
        for topic, count in topics.most_common(10)
    ]
    
    # Teacher engagement
    teacher_engagement = []
    at_risk_count = 0
    for teacher in teachers:
        teacher_sos = [s for s in all_sos if s.get("teacher_id") == teacher["id"]]
        successful = sum(1 for s in teacher_sos if s.get("success") is True)
        success_rate = successful / len(teacher_sos) if teacher_sos else 0
        readiness = calculate_readiness(teacher["id"])
        
        if readiness == ReadinessSignal.AT_RISK:
            at_risk_count += 1
        
        teacher_engagement.append({
            "teacher_id": teacher["id"],
            "teacher_name": teacher["name"],
            "school": teacher.get("school", "Unknown"),
            "sos_count": len(teacher_sos),
            "success_rate": round(success_rate, 2),
            "readiness": readiness.value,
            "most_common_topic": topics.most_common(1)[0][0] if topics else "N/A"
        })
    
    # Calculate overall stats
    total_successful = sum(1 for s in all_sos if s.get("success") is True)
    overall_success_rate = total_successful / len(all_sos) if all_sos else 0
    
    return {
        "cluster": current_user.cluster,
        "district": current_user.district,
        "stats": {
            "total_teachers": len(teachers),
            "total_sos": len(all_sos),
            "overall_success_rate": round(overall_success_rate, 2),
            "at_risk_teachers": at_risk_count
        },
        "category_distribution": category_stats,
        "top_issues": top_issues,
        "teacher_engagement": teacher_engagement,
        "trend": {
            "direction": "up" if overall_success_rate > 0.7 else "down",
            "change": round(random.uniform(-5, 10), 1)
        }
    }


@router.get("/diet")
async def get_diet_dashboard(current_user: User = Depends(get_current_user)):
    """Get DIET (District Institute of Education and Training) dashboard data."""
    
    if current_user.role != UserRole.DIET:
        raise HTTPException(status_code=403, detail="DIET access only")
    
    # Get all teachers in district
    teachers = get_teachers_by_district(current_user.district)
    teacher_ids = [t["id"] for t in teachers]
    
    # Get clusters
    clusters = set(t.get("cluster", "Unknown") for t in teachers)
    
    # Get all SOS
    all_sos = list(SOS_HISTORY_DB.values())
    
    # Calculate learning gaps
    topic_failures = Counter()
    topic_totals = Counter()
    for sos in all_sos:
        topic = sos.get("context", {}).get("topic", "Other")
        topic_totals[topic] += 1
        if sos.get("success") is False:
            topic_failures[topic] += 1
    
    learning_gaps = []
    for topic, total in topic_totals.most_common(10):
        failures = topic_failures.get(topic, 0)
        gap_score = failures / total if total > 0 else 0
        learning_gaps.append({
            "topic": topic,
            "subject": "Mixed",  # Would need to track this
            "grade": 3,  # Mock
            "gap_score": round(gap_score, 2),
            "affected_schools": min(len(clusters), int(total / 2) + 1),
            "affected_teachers": min(len(teachers), total),
            "trend": random.choice(["increasing", "decreasing", "stable"])
        })
    
    # Sort by gap score
    learning_gaps.sort(key=lambda x: x["gap_score"], reverse=True)
    
    # Training needs
    training_needs = []
    for gap in learning_gaps[:5]:
        training_needs.append({
            "topic": gap["topic"],
            "subject": gap["subject"],
            "priority": "high" if gap["gap_score"] > 0.3 else "medium" if gap["gap_score"] > 0.15 else "low",
            "teacher_count": gap["affected_teachers"],
            "failure_rate": gap["gap_score"],
            "recommended_training": f"FLN Training: {gap['topic']}"
        })
    
    # Difficulty trends (mock time series)
    difficulty_trends = []
    for topic in list(topic_totals.keys())[:5]:
        difficulty_trends.append({
            "concept": topic,
            "data": [
                {"month": "Oct", "difficulty": round(random.uniform(0.2, 0.5), 2)},
                {"month": "Nov", "difficulty": round(random.uniform(0.2, 0.5), 2)},
                {"month": "Dec", "difficulty": round(random.uniform(0.2, 0.5), 2)},
                {"month": "Jan", "difficulty": round(random.uniform(0.2, 0.5), 2)}
            ]
        })
    
    # Calculate district health score
    total_with_feedback = sum(1 for s in all_sos if s.get("success") is not None)
    total_success = sum(1 for s in all_sos if s.get("success") is True)
    health_score = total_success / total_with_feedback if total_with_feedback > 0 else 0.7
    
    return {
        "district": current_user.district,
        "stats": {
            "total_clusters": len(clusters),
            "total_schools": len(set(t.get("school", "") for t in teachers)),
            "total_teachers": len(teachers),
            "district_health_score": round(health_score, 2)
        },
        "learning_gaps": learning_gaps[:10],
        "training_needs": training_needs,
        "difficulty_trends": difficulty_trends,
        "cluster_performance": [
            {
                "cluster": cluster,
                "teachers": len([t for t in teachers if t.get("cluster") == cluster]),
                "health_score": round(random.uniform(0.6, 0.9), 2)
            }
            for cluster in list(clusters)[:5]
        ]
    }
