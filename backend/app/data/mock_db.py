"""Mock database layer simulating MongoDB."""
import json
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path
import uuid

# In-memory storage (simulating MongoDB collections)
USERS_DB: dict = {}
SOS_HISTORY_DB: dict = {}
PLAYBOOKS_DB: dict = {}
SOLUTIONS_DB: dict = {}


def init_mock_data():
    """Initialize mock data for demo."""
    global USERS_DB, SOS_HISTORY_DB, PLAYBOOKS_DB, SOLUTIONS_DB
    
    # Mock users
    USERS_DB = {
        "teacher1": {
            "id": "teacher1",
            "name": "Priya Sharma",
            "username": "priya",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.mqSg9Kv0ZJhQqy",  # password: demo123
            "role": "teacher",
            "district": "Patna",
            "cluster": "Danapur",
            "school": "Government Primary School, Khagaul",
            "language": "hi",
            "grade_teaching": [3, 4],
            "subjects": ["Hindi", "Math"]
        },
        "teacher2": {
            "id": "teacher2",
            "name": "Rajan Kumar",
            "username": "rajan",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.mqSg9Kv0ZJhQqy",
            "role": "teacher",
            "district": "Patna",
            "cluster": "Danapur",
            "school": "Government Middle School, Phulwari",
            "language": "hi",
            "grade_teaching": [5, 6],
            "subjects": ["Math", "Science"]
        },
        "teacher3": {
            "id": "teacher3",
            "name": "Sunita Devi",
            "username": "sunita",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.mqSg9Kv0ZJhQqy",
            "role": "teacher",
            "district": "Patna",
            "cluster": "Digha",
            "school": "Government Primary School, Kankarbagh",
            "language": "hi",
            "grade_teaching": [1, 2],
            "subjects": ["Hindi", "Math", "EVS"]
        },
        "crp1": {
            "id": "crp1",
            "name": "Amit Verma",
            "username": "amit",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.mqSg9Kv0ZJhQqy",
            "role": "crp",
            "district": "Patna",
            "cluster": "Danapur",
            "language": "hi"
        },
        "diet1": {
            "id": "diet1",
            "name": "Dr. Rekha Singh",
            "username": "rekha",
            "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.mqSg9Kv0ZJhQqy",
            "role": "diet",
            "district": "Patna",
            "language": "hi"
        }
    }
    
    # Mock SOS history
    base_time = datetime.now()
    SOS_HISTORY_DB = {
        "sos1": {
            "id": "sos1",
            "teacher_id": "teacher1",
            "request_text": "बच्चे जोड़ना-घटाना नहीं समझ रहे",
            "context": {"grade": 3, "subject": "Math", "topic": "Addition-Subtraction", "language": "hi"},
            "response_id": "pb1",
            "from_cache": False,
            "success": True,
            "created_at": (base_time - timedelta(days=2)).isoformat(),
            "feedback": "Very helpful activity"
        },
        "sos2": {
            "id": "sos2",
            "teacher_id": "teacher1",
            "request_text": "कक्षा में बच्चों का ध्यान नहीं लग रहा",
            "context": {"grade": 4, "subject": "Hindi", "topic": "Attention", "language": "hi"},
            "response_id": "pb2",
            "from_cache": True,
            "success": True,
            "created_at": (base_time - timedelta(days=1)).isoformat()
        },
        "sos3": {
            "id": "sos3",
            "teacher_id": "teacher2",
            "request_text": "Fractions concept not clear to students",
            "context": {"grade": 5, "subject": "Math", "topic": "Fractions", "language": "en"},
            "response_id": "pb3",
            "from_cache": False,
            "success": None,
            "created_at": base_time.isoformat()
        }
    }
    
    # Mock shared solutions
    SOLUTIONS_DB = {
        "sol1": {
            "id": "sol1",
            "problem": "Students struggling with place value",
            "solution": "Use bundles of sticks - 10 sticks = 1 bundle",
            "grade": 3,
            "subject": "Math",
            "topic": "Place Value",
            "teacher_id": "teacher1",
            "anonymous": False,
            "trust_score": 0.92,
            "usage_count": 45,
            "success_rate": 0.88
        },
        "sol2": {
            "id": "sol2",
            "problem": "Reading comprehension difficulties",
            "solution": "Picture walk before reading, predict story",
            "grade": 2,
            "subject": "Hindi",
            "topic": "Reading",
            "teacher_id": "teacher3",
            "anonymous": True,
            "trust_score": 0.85,
            "usage_count": 32,
            "success_rate": 0.82
        }
    }


def get_user_by_username(username: str) -> Optional[dict]:
    """Get user by username."""
    for user in USERS_DB.values():
        if user["username"] == username:
            return user
    return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID."""
    return USERS_DB.get(user_id)


def get_sos_history(teacher_id: str, limit: int = 10) -> list:
    """Get SOS history for a teacher."""
    history = [
        sos for sos in SOS_HISTORY_DB.values()
        if sos["teacher_id"] == teacher_id
    ]
    history.sort(key=lambda x: x["created_at"], reverse=True)
    return history[:limit]


def get_all_sos(cluster: Optional[str] = None, district: Optional[str] = None) -> list:
    """Get all SOS records, optionally filtered."""
    return list(SOS_HISTORY_DB.values())


def save_sos(sos_data: dict) -> str:
    """Save SOS record."""
    sos_id = str(uuid.uuid4())[:8]
    sos_data["id"] = sos_id
    sos_data["created_at"] = datetime.now().isoformat()
    SOS_HISTORY_DB[sos_id] = sos_data
    return sos_id


def update_sos_success(sos_id: str, success: bool, feedback: Optional[str] = None):
    """Update SOS success status."""
    if sos_id in SOS_HISTORY_DB:
        SOS_HISTORY_DB[sos_id]["success"] = success
        if feedback:
            SOS_HISTORY_DB[sos_id]["feedback"] = feedback


def get_solutions(topic: Optional[str] = None, grade: Optional[int] = None) -> list:
    """Get shared solutions."""
    solutions = list(SOLUTIONS_DB.values())
    if topic:
        solutions = [s for s in solutions if topic.lower() in s["topic"].lower()]
    if grade:
        solutions = [s for s in solutions if s["grade"] == grade]
    return solutions


def save_solution(solution_data: dict) -> str:
    """Save a shared solution."""
    sol_id = str(uuid.uuid4())[:8]
    solution_data["id"] = sol_id
    solution_data["trust_score"] = 0.5
    solution_data["usage_count"] = 0
    solution_data["success_rate"] = 0.0
    SOLUTIONS_DB[sol_id] = solution_data
    return sol_id


def get_teachers_by_cluster(cluster: str) -> list:
    """Get all teachers in a cluster."""
    return [
        u for u in USERS_DB.values()
        if u["role"] == "teacher" and u.get("cluster") == cluster
    ]


def get_teachers_by_district(district: str) -> list:
    """Get all teachers in a district."""
    return [
        u for u in USERS_DB.values()
        if u["role"] == "teacher" and u.get("district") == district
    ]


# Initialize on import
init_mock_data()
