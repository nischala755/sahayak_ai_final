"""RAG service with ChromaDB for pedagogy retrieval."""
import json
from typing import Optional
from pathlib import Path

# Mock RAG - in production would use ChromaDB
# For demo, we use simple keyword matching

DATA_DIR = Path(__file__).parent.parent / "data"


def load_quick_fixes() -> list:
    """Load quick fixes data."""
    try:
        with open(DATA_DIR / "quick_fixes.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


def load_ncert_refs() -> list:
    """Load NCERT references."""
    try:
        with open(DATA_DIR / "ncert_references.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


class MockRAGService:
    """Mock RAG service for demo."""
    
    def __init__(self):
        self.quick_fixes = load_quick_fixes()
        self.ncert_refs = load_ncert_refs()
    
    def search_similar_problems(
        self,
        query: str,
        grade: Optional[int] = None,
        subject: Optional[str] = None,
        limit: int = 5
    ) -> list:
        """Search for similar problems in the knowledge base."""
        
        query_lower = query.lower()
        results = []
        
        for fix in self.quick_fixes:
            score = 0
            
            # Check problem text match
            problem_text = fix.get("problem", "") + " " + fix.get("problem_hi", "") + " " + fix.get("problem_en", "")
            if any(word in problem_text.lower() for word in query_lower.split() if len(word) > 2):
                score += 2
            
            # Check topic match
            if fix.get("topic", "").lower() in query_lower or query_lower in fix.get("topic", "").lower():
                score += 2
            
            # Check grade match
            if grade and fix.get("grade") == grade:
                score += 1
            
            # Check subject match
            if subject and fix.get("subject", "").lower() == subject.lower():
                score += 1
            
            if score > 0:
                results.append({
                    **fix,
                    "relevance_score": min(score / 6, 1.0)
                })
        
        # Sort by relevance and success rate
        results.sort(key=lambda x: (x["relevance_score"], x.get("success_rate", 0)), reverse=True)
        
        return results[:limit]
    
    def get_ncert_references(
        self,
        topic: str,
        grade: Optional[int] = None,
        subject: Optional[str] = None,
        limit: int = 3
    ) -> list:
        """Get NCERT references for a topic."""
        
        topic_lower = topic.lower()
        topic_words = topic_lower.split()
        results = []
        
        for ref in self.ncert_refs:
            score = 0
            
            # Check topic match (more flexible)
            ref_topic = ref.get("topic", "").lower()
            ref_chapter = ref.get("chapter", "").lower()
            
            for word in topic_words:
                if len(word) > 2:  # Skip short words
                    if word in ref_topic:
                        score += 2
                    if word in ref_chapter:
                        score += 1
            
            # Check grade match
            if grade and ref.get("grade") == grade:
                score += 2
            elif grade and abs(ref.get("grade", 0) - grade) <= 1:
                score += 1
            
            # Check subject match
            if subject and ref.get("subject", "").lower() == subject.lower():
                score += 1.5
            
            if score > 0:
                results.append({
                    **ref,
                    "relevance_score": min(score / 6, 1.0)
                })
        
        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        # If no results, return grade-matched refs
        if not results and grade:
            defaults = [r for r in self.ncert_refs if r.get("grade") == grade][:limit]
            results = [{**r, "relevance_score": 0.4} for r in defaults]
        
        return results[:limit]
    
    def get_top_quick_fixes(self, limit: int = 50) -> list:
        """Get top quick fixes by usage."""
        fixes = sorted(
            self.quick_fixes,
            key=lambda x: (x.get("success_rate", 0), x.get("usage_count", 0)),
            reverse=True
        )
        return fixes[:limit]


# Global instance
rag_service = MockRAGService()


def get_rag_service() -> MockRAGService:
    """Get RAG service instance."""
    return rag_service
