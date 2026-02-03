"""Collective intelligence routes for teacher-to-teacher sharing."""
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel

from ..models.user import User
from ..routes.auth import get_current_user
from ..data.mock_db import get_solutions, save_solution, SOLUTIONS_DB

router = APIRouter(prefix="/api/collective", tags=["Collective Intelligence"])


class ShareSolutionRequest(BaseModel):
    """Request to share a solution."""
    problem: str
    solution: str
    grade: int
    subject: str
    topic: str
    anonymous: bool = True


@router.post("/share")
async def share_solution(
    request: ShareSolutionRequest,
    current_user: User = Depends(get_current_user)
):
    """Share a successful solution with other teachers."""
    
    solution_data = {
        "problem": request.problem,
        "solution": request.solution,
        "grade": request.grade,
        "subject": request.subject,
        "topic": request.topic,
        "teacher_id": current_user.id if not request.anonymous else None,
        "teacher_name": current_user.name if not request.anonymous else "Anonymous Teacher",
        "district": current_user.district,
        "anonymous": request.anonymous
    }
    
    solution_id = save_solution(solution_data)
    
    return {
        "shared": True,
        "solution_id": solution_id,
        "trust_score": 0.5,  # Initial trust score
        "message": "Solution shared successfully!"
    }


@router.get("/solutions")
async def get_shared_solutions(
    topic: Optional[str] = None,
    grade: Optional[int] = None,
    subject: Optional[str] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get shared solutions from other teachers."""
    
    solutions = list(SOLUTIONS_DB.values())
    
    # Filter by topic
    if topic:
        solutions = [s for s in solutions if topic.lower() in s.get("topic", "").lower()]
    
    # Filter by grade
    if grade:
        solutions = [s for s in solutions if s.get("grade") == grade]
    
    # Filter by subject
    if subject:
        solutions = [s for s in solutions if s.get("subject", "").lower() == subject.lower()]
    
    # Sort by trust score and usage
    solutions.sort(
        key=lambda x: (x.get("trust_score", 0), x.get("usage_count", 0)),
        reverse=True
    )
    
    # Format for response
    formatted = []
    for sol in solutions[:limit]:
        formatted.append({
            "id": sol["id"],
            "problem": sol["problem"],
            "solution": sol["solution"],
            "grade": sol["grade"],
            "subject": sol["subject"],
            "topic": sol["topic"],
            "teacher_name": sol.get("teacher_name", "Anonymous Teacher"),
            "trust_score": sol.get("trust_score", 0.5),
            "usage_count": sol.get("usage_count", 0),
            "success_rate": sol.get("success_rate", 0.7)
        })
    
    return {"solutions": formatted, "total": len(formatted)}


@router.post("/use/{solution_id}")
async def use_solution(
    solution_id: str,
    current_user: User = Depends(get_current_user)
):
    """Mark a solution as used (updates usage count)."""
    
    if solution_id not in SOLUTIONS_DB:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # Increment usage count
    SOLUTIONS_DB[solution_id]["usage_count"] = SOLUTIONS_DB[solution_id].get("usage_count", 0) + 1
    
    return {
        "used": True,
        "solution_id": solution_id,
        "new_usage_count": SOLUTIONS_DB[solution_id]["usage_count"]
    }


@router.post("/feedback/{solution_id}")
async def provide_feedback(
    solution_id: str,
    success: bool,
    current_user: User = Depends(get_current_user)
):
    """Provide feedback on a solution (updates trust score)."""
    
    if solution_id not in SOLUTIONS_DB:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    solution = SOLUTIONS_DB[solution_id]
    
    # Update trust score based on feedback
    current_trust = solution.get("trust_score", 0.5)
    usage_count = solution.get("usage_count", 1)
    
    if success:
        # Increase trust score
        new_trust = min(1.0, current_trust + (0.1 / usage_count))
        solution["success_rate"] = solution.get("success_rate", 0.7) * 0.9 + 0.1
    else:
        # Decrease trust score
        new_trust = max(0.1, current_trust - (0.05 / usage_count))
        solution["success_rate"] = solution.get("success_rate", 0.7) * 0.9
    
    solution["trust_score"] = round(new_trust, 2)
    
    return {
        "updated": True,
        "solution_id": solution_id,
        "new_trust_score": solution["trust_score"]
    }
