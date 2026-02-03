"""Video and NCERT reference routes."""
from fastapi import APIRouter, Depends
from typing import Optional

from ..models.user import User
from ..routes.auth import get_current_user
from ..services.youtube_service import search_videos
from ..services.rag_service import get_rag_service

router = APIRouter(prefix="/api", tags=["Resources"])


@router.get("/videos/search")
async def search_video_resources(
    query: str,
    grade: Optional[int] = None,
    language: str = "hi",
    limit: int = 5,
    current_user: User = Depends(get_current_user)
):
    """Search for educational videos."""
    
    # Use user's grade if not specified
    if not grade and current_user.grade_teaching:
        grade = current_user.grade_teaching[0]
    
    videos = await search_videos(
        query=query,
        grade=grade,
        language=language or current_user.language,
        limit=limit
    )
    
    return {"videos": videos, "query": query, "total": len(videos)}


@router.get("/references/ncert")
async def get_ncert_references(
    topic: str,
    grade: Optional[int] = None,
    subject: Optional[str] = None,
    limit: int = 5,
    current_user: User = Depends(get_current_user)
):
    """Get NCERT textbook references for a topic."""
    
    rag = get_rag_service()
    
    # Use user's grade if not specified
    if not grade and current_user.grade_teaching:
        grade = current_user.grade_teaching[0]
    
    references = rag.get_ncert_references(
        topic=topic,
        grade=grade,
        subject=subject,
        limit=limit
    )
    
    return {"references": references, "topic": topic, "total": len(references)}
