"""SOS routes for classroom emergency support."""
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
import uuid

from ..models.user import User
from ..models.sos import SOSRequest, SOSResponse, SOSContext, QuickFix
from ..routes.auth import get_current_user
from ..services.cache_service import (
    get_cache_key, get_problem_cache_key,
    get_cached_response, set_cached_response, increment_usage
)
from ..services.mistral_service import generate_playbook, extract_context_from_text
from ..services.rag_service import get_rag_service
from ..services.youtube_service import search_videos
from ..data.mock_db import save_sos, update_sos_success, get_sos_history

router = APIRouter(prefix="/api/sos", tags=["SOS"])


@router.post("/submit", response_model=SOSResponse)
async def submit_sos(
    request: SOSRequest,
    current_user: User = Depends(get_current_user)
):
    """Submit an SOS request and get a teaching playbook."""
    
    # Extract text from request (voice would be transcribed on frontend)
    query_text = request.text or ""
    
    if not query_text:
        raise HTTPException(status_code=400, detail="SOS text or audio required")
    
    # Extract context from text first
    extracted = await extract_context_from_text(query_text)
    
    # Merge with request context if provided, prioritizing request values
    req_ctx = request.context
    context = SOSContext(
        grade=req_ctx.grade if req_ctx and req_ctx.grade else (
            extracted.get("grade") or (current_user.grade_teaching[0] if current_user.grade_teaching else 3)
        ),
        subject=req_ctx.subject if req_ctx and req_ctx.subject else extracted.get("subject", "General"),
        topic=req_ctx.topic if req_ctx and req_ctx.topic else extracted.get("topic", query_text[:50]),
        language=req_ctx.language if req_ctx and req_ctx.language else current_user.language
    )
    
    print(f"🌐 SOS request with language: {context.language}")
    
    # Generate cache key
    cache_key = get_cache_key({
        "grade": context.grade,
        "subject": context.subject,
        "topic": context.topic,
        "language": context.language
    })
    
    # Check cache first
    cached = await get_cached_response(cache_key)
    if cached:
        await increment_usage(cache_key)
        
        # Save SOS record
        sos_id = save_sos({
            "teacher_id": current_user.id,
            "request_text": query_text,
            "context": context.model_dump(),
            "response_id": cached.get("id", "cached"),
            "from_cache": True
        })
        
        return SOSResponse(
            sos_id=sos_id,
            extracted_context=context,
            playbook=cached,
            from_cache=True,
            cache_key=cache_key
        )
    
    # Check RAG for similar problems
    rag = get_rag_service()
    similar = rag.search_similar_problems(
        query_text,
        grade=context.grade,
        subject=context.subject,
        limit=3
    )
    
    # Cache-first: Check quick fixes (top 50 common topics) before using LLM
    if similar and similar[0].get("relevance_score", 0) > 0.8:
        best_match = similar[0]
        print(f"📦 Using quick fix for: {best_match.get('topic', 'unknown')} in lang={context.language}")
        
        # Get language-appropriate content
        lang = context.language or "en"
        if lang == "hi":
            what_to_say = best_match.get("what_to_say_hi", best_match.get("what_to_say", []))
            problem_text = best_match.get("problem_hi", best_match.get("problem", query_text))
            activity_name = best_match.get("activity_hi", best_match.get("activity", "Interactive Activity"))
        elif lang == "kn":
            what_to_say = best_match.get("what_to_say_kn", best_match.get("what_to_say", []))
            problem_text = best_match.get("problem_kn", best_match.get("problem", query_text))
            activity_name = best_match.get("activity_kn", best_match.get("activity", "Interactive Activity"))
        else:
            what_to_say = best_match.get("what_to_say_en", best_match.get("what_to_say", []))
            problem_text = best_match.get("problem_en", best_match.get("problem", query_text))
            activity_name = best_match.get("activity_en", best_match.get("activity", "Interactive Activity"))
        
        playbook = {
            "id": best_match["id"],
            "problem": problem_text,
            "what_to_say": what_to_say,
            "activity": {
                "name": activity_name,
                "steps": best_match.get(f"steps_{lang}", ["Follow the quick fix guidance"]),
                "materials": best_match.get("materials", ["Available classroom materials"]),
                "duration_minutes": 10
            },
            "class_management": best_match.get(f"class_management_{lang}", ["Use attention signals", "Praise participation"]),
            "quick_check": {
                "questions": best_match.get(f"questions_{lang}", ["Did students understand?"]),
                "expected_responses": ["Students demonstrate understanding"],
                "success_indicators": ["Active participation"]
            },
            "trust_score": best_match.get("success_rate", 0.8),
            "from_quick_fix": True
        }
        
        # Also get NCERT references and videos for quick fixes
        ncert_refs = rag.get_ncert_references(
            topic=context.topic or query_text,
            grade=context.grade,
            subject=context.subject
        )
        videos = await search_videos(
            query=context.topic or query_text,
            grade=context.grade,
            language=context.language,
            limit=3
        )
        playbook["ncert_refs"] = ncert_refs
        playbook["videos"] = videos
        
        # Cache the response
        await set_cached_response(cache_key, playbook)
        
        # Save SOS record
        sos_id = save_sos({
            "teacher_id": current_user.id,
            "request_text": query_text,
            "context": context.model_dump(),
            "response_id": playbook["id"],
            "from_cache": True
        })
        
        return SOSResponse(
            sos_id=sos_id,
            extracted_context=context,
            playbook=playbook,
            from_cache=True,
            cache_key=cache_key,
            similar_solutions=[{"id": s["id"], "problem": s["problem"], "success_rate": s.get("success_rate", 0.8)} for s in similar[:3]]
        )
    
    # Generate new playbook with Gemini
    playbook_data = await generate_playbook(
        problem=query_text,
        grade=context.grade or 3,
        subject=context.subject or "General",
        topic=context.topic or "General",
        language=context.language,
        constraints=context.rural_constraints
    )
    
    # Get NCERT references
    ncert_refs = rag.get_ncert_references(
        topic=context.topic or query_text,
        grade=context.grade,
        subject=context.subject
    )
    
    # Get relevant videos
    videos = await search_videos(
        query=context.topic or query_text,
        grade=context.grade,
        language=context.language,
        limit=3
    )
    
    # Build complete playbook
    playbook_id = str(uuid.uuid4())[:8]
    playbook = {
        "id": playbook_id,
        "problem": query_text,
        **playbook_data,
        "ncert_refs": ncert_refs,
        "videos": videos,
        "trust_score": 0.7,  # New AI-generated, lower initial trust
        "from_quick_fix": False
    }
    
    # Cache the response
    await set_cached_response(cache_key, playbook, ttl=7200)  # 2 hours
    
    # Save SOS record
    sos_id = save_sos({
        "teacher_id": current_user.id,
        "request_text": query_text,
        "context": context.model_dump(),
        "response_id": playbook_id,
        "from_cache": False
    })
    
    return SOSResponse(
        sos_id=sos_id,
        extracted_context=context,
        playbook=playbook,
        from_cache=False,
        similar_solutions=[{"id": s["id"], "problem": s["problem"], "success_rate": s.get("success_rate", 0.8)} for s in similar[:3]] if similar else None
    )


@router.get("/quick-fixes")
async def get_quick_fixes(
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """Get top quick fix solutions for offline access."""
    
    rag = get_rag_service()
    fixes = rag.get_top_quick_fixes(limit)
    
    # Filter by user's grades if available
    if current_user.grade_teaching:
        user_grades = set(current_user.grade_teaching)
        # Prioritize matching grades but include others
        matching = [f for f in fixes if f.get("grade") in user_grades]
        non_matching = [f for f in fixes if f.get("grade") not in user_grades]
        fixes = matching + non_matching[:max(0, limit - len(matching))]
    
    return {"fixes": fixes[:limit], "total": len(fixes)}


@router.post("/mark-success")
async def mark_success(
    sos_id: str,
    success: bool,
    feedback: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Mark an SOS response as successful or not."""
    
    update_sos_success(sos_id, success, feedback)
    
    # In production, this would update trust scores and learning loop
    return {"updated": True, "sos_id": sos_id}


@router.get("/history")
async def get_history(
    current_user: User = Depends(get_current_user),
    limit: int = 10
):
    """Get SOS history for current teacher."""
    
    history = get_sos_history(current_user.id, limit)
    return {"history": history}
