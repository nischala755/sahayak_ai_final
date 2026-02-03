"""
SAHAYAK AI SDK - Lightweight Python SDK for Classroom Coaching AI

This SDK provides easy integration with SAHAYAK AI for third-party applications.
Perfect for EdTech platforms, Teacher training systems, and Analytics tools.

Installation:
    pip install sahayak-ai-sdk  # (For demo, just copy this file)

Quick Start:
    from sahayak_sdk import SahayakAI
    
    client = SahayakAI(api_key="your-api-key")
    playbook = client.get_playbook("Students not understanding fractions")
    print(playbook.what_to_say)
"""

import json
import hashlib
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from datetime import datetime


# ============================================================================
# DATA MODELS
# ============================================================================

@dataclass
class Activity:
    """Teaching activity model."""
    name: str
    steps: List[str]
    materials: List[str]
    duration_minutes: int = 10


@dataclass
class QuickCheck:
    """Quick assessment model."""
    questions: List[str]
    expected_responses: List[str]
    success_indicators: List[str]


@dataclass
class Playbook:
    """Complete teaching playbook model."""
    id: str
    problem: str
    what_to_say: List[str]
    activity: Activity
    class_management: List[str]
    quick_check: QuickCheck
    trust_score: float
    ncert_references: List[Dict[str, str]] = field(default_factory=list)
    youtube_resources: List[Dict[str, str]] = field(default_factory=list)
    from_cache: bool = False
    language: str = "en"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert playbook to dictionary."""
        return {
            "id": self.id,
            "problem": self.problem,
            "what_to_say": self.what_to_say,
            "activity": {
                "name": self.activity.name,
                "steps": self.activity.steps,
                "materials": self.activity.materials,
                "duration_minutes": self.activity.duration_minutes
            },
            "class_management": self.class_management,
            "quick_check": {
                "questions": self.quick_check.questions,
                "expected_responses": self.quick_check.expected_responses,
                "success_indicators": self.quick_check.success_indicators
            },
            "trust_score": self.trust_score,
            "ncert_references": self.ncert_references,
            "youtube_resources": self.youtube_resources,
            "from_cache": self.from_cache,
            "language": self.language
        }


@dataclass  
class TeacherContext:
    """Teaching context model."""
    grade: int = 3
    subject: str = "General"
    topic: str = ""
    language: str = "en"
    rural_constraints: List[str] = field(default_factory=list)


@dataclass
class ReadinessSignal:
    """Teacher readiness signal model."""
    teacher_id: str
    status: str  # "ready", "needs_support", "at_risk"
    score: float
    recent_struggles: List[str]
    recommended_actions: List[str]


# ============================================================================
# MOCK DATA FOR DEMO
# ============================================================================

MOCK_PLAYBOOKS = {
    "fractions": Playbook(
        id="pb_fractions_001",
        problem="Students not understanding fractions",
        what_to_say=[
            "Let's divide this roti into equal parts",
            "Fold the paper in half - that's 1/2",
            "Now fold it again - what do we have?",
            "Share equally among friends"
        ],
        activity=Activity(
            name="Paper Folding Fractions",
            steps=[
                "Give each student a piece of paper",
                "Fold in half - label as 1/2",
                "Fold again - label as 1/4",
                "Compare and discuss"
            ],
            materials=["Paper", "Crayons", "Scissors"],
            duration_minutes=15
        ),
        class_management=[
            "Use pair work for folding activity",
            "Walk around and check each pair",
            "Praise accurate folding"
        ],
        quick_check=QuickCheck(
            questions=["What is half of this paper?", "How many quarters in a whole?"],
            expected_responses=["1/2", "4 quarters"],
            success_indicators=["Can fold accurately", "Can name fractions"]
        ),
        trust_score=0.92,
        ncert_references=[
            {"chapter": "Fractions", "class": "4", "page": "45"}
        ],
        youtube_resources=[
            {"title": "Fun with Fractions", "url": "https://youtube.com/watch?v=demo1"}
        ]
    ),
    "counting": Playbook(
        id="pb_counting_001",
        problem="Students not learning counting",
        what_to_say=[
            "Come children, let's play a counting game",
            "Show me your fingers",
            "Count one, two, three with me",
            "Now count the stones"
        ],
        activity=Activity(
            name="Finger Counting Game",
            steps=[
                "Start with finger counting song",
                "Count classroom objects",
                "Play counting relay race",
                "Practice writing numbers"
            ],
            materials=["Stones", "Sticks", "Chalk"],
            duration_minutes=10
        ),
        class_management=[
            "Make it a fun game",
            "Use clapping rhythm",
            "Celebrate every attempt"
        ],
        quick_check=QuickCheck(
            questions=["Show me 5 fingers", "Count to 10"],
            expected_responses=["Shows 5", "Counts correctly"],
            success_indicators=["Active participation", "Correct counting"]
        ),
        trust_score=0.95
    ),
    "attention": Playbook(
        id="pb_attention_001",
        problem="Students not paying attention",
        what_to_say=[
            "Everyone stand up!",
            "Touch your toes, touch the sky",
            "Clap 3 times if you can hear me",
            "Eyes on me, 1-2-3"
        ],
        activity=Activity(
            name="Brain Break Activity",
            steps=[
                "Stand and stretch",
                "Simon Says game (2 min)",
                "Deep breath together",
                "Return to seats quietly"
            ],
            materials=["None needed"],
            duration_minutes=5
        ),
        class_management=[
            "Use attention signals consistently",
            "Eye contact with distracted students",
            "Positive reinforcement"
        ],
        quick_check=QuickCheck(
            questions=["Who can tell me what we were learning?"],
            expected_responses=["Students recall topic"],
            success_indicators=["Focused eyes", "Ready posture"]
        ),
        trust_score=0.88
    )
}


# ============================================================================
# SDK CLIENT CLASS
# ============================================================================

class SahayakAI:
    """
    SAHAYAK AI SDK Client
    
    Provides easy integration with SAHAYAK AI for classroom coaching.
    
    Example:
        client = SahayakAI(api_key="your-key")
        playbook = client.get_playbook("Students struggling with fractions")
        print(playbook.what_to_say)
    """
    
    def __init__(
        self,
        api_key: str = "demo-key",
        base_url: str = "http://localhost:8000/api",
        language: str = "en",
        timeout: int = 30
    ):
        """
        Initialize SAHAYAK AI client.
        
        Args:
            api_key: Your API key (use "demo-key" for demo mode)
            base_url: API base URL
            language: Default language ("en" or "hi")
            timeout: Request timeout in seconds
        """
        self.api_key = api_key
        self.base_url = base_url
        self.language = language
        self.timeout = timeout
        self._demo_mode = api_key == "demo-key"
        self._cache = {}
        
    def _get_cache_key(self, text: str, context: TeacherContext) -> str:
        """Generate cache key for request."""
        data = f"{text}:{context.grade}:{context.subject}:{context.language}"
        return hashlib.md5(data.encode()).hexdigest()
    
    def _detect_topic(self, text: str) -> str:
        """Detect topic from natural language text."""
        text_lower = text.lower()
        
        keywords = {
            "fractions": ["fraction", "divide", "half", "quarter", "भिन्न"],
            "counting": ["counting", "count", "number", "गिनती"],
            "attention": ["attention", "focus", "distracted", "ध्यान", "fidgeting"]
        }
        
        for topic, words in keywords.items():
            if any(word in text_lower for word in words):
                return topic
        
        return "general"
    
    def get_playbook(
        self,
        problem: str,
        context: Optional[TeacherContext] = None,
        use_cache: bool = True
    ) -> Playbook:
        """
        Get a teaching playbook for a classroom problem.
        
        Args:
            problem: Natural language description of the problem
            context: Optional teaching context (grade, subject, etc.)
            use_cache: Whether to use cached responses
            
        Returns:
            Playbook object with teaching strategies
            
        Example:
            playbook = client.get_playbook(
                "Students not understanding fractions",
                context=TeacherContext(grade=4, subject="Math")
            )
        """
        if context is None:
            context = TeacherContext(language=self.language)
        
        # Check cache
        cache_key = self._get_cache_key(problem, context)
        if use_cache and cache_key in self._cache:
            cached = self._cache[cache_key]
            cached.from_cache = True
            return cached
        
        # Demo mode - return mock data
        if self._demo_mode:
            topic = self._detect_topic(problem)
            playbook = MOCK_PLAYBOOKS.get(topic, MOCK_PLAYBOOKS["attention"])
            playbook.language = context.language
            
            # Cache it
            self._cache[cache_key] = playbook
            return playbook
        
        # Real API call would go here
        # response = requests.post(
        #     f"{self.base_url}/sos/submit",
        #     headers={"Authorization": f"Bearer {self.api_key}"},
        #     json={"text": problem, "context": context.__dict__}
        # )
        # return Playbook(**response.json()["playbook"])
        
        raise NotImplementedError("Real API integration not implemented in demo")
    
    def get_quick_fixes(
        self,
        grade: Optional[int] = None,
        subject: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get cached quick fix solutions.
        
        Args:
            grade: Filter by grade (1-8)
            subject: Filter by subject
            limit: Maximum number of results
            
        Returns:
            List of quick fix dictionaries
        """
        if self._demo_mode:
            fixes = [
                {"id": "qf1", "topic": "Counting", "grade": 1, "subject": "Math", "usage_count": 234},
                {"id": "qf2", "topic": "Addition", "grade": 2, "subject": "Math", "usage_count": 189},
                {"id": "qf3", "topic": "Reading", "grade": 1, "subject": "Hindi", "usage_count": 156},
                {"id": "qf4", "topic": "Attention", "grade": 3, "subject": "General", "usage_count": 298},
                {"id": "qf5", "topic": "Fractions", "grade": 4, "subject": "Math", "usage_count": 145},
            ]
            
            if grade:
                fixes = [f for f in fixes if f["grade"] == grade]
            if subject:
                fixes = [f for f in fixes if f["subject"] == subject]
            
            return fixes[:limit]
        
        raise NotImplementedError("Real API integration not implemented in demo")
    
    def get_teacher_readiness(self, teacher_id: str) -> ReadinessSignal:
        """
        Get teacher's classroom readiness signal.
        
        Args:
            teacher_id: Teacher's unique identifier
            
        Returns:
            ReadinessSignal with status and recommendations
        """
        if self._demo_mode:
            return ReadinessSignal(
                teacher_id=teacher_id,
                status="ready",
                score=0.85,
                recent_struggles=["Fractions", "Word Problems"],
                recommended_actions=[
                    "Review fraction concepts before class",
                    "Prepare visual aids for word problems"
                ]
            )
        
        raise NotImplementedError("Real API integration not implemented in demo")
    
    def submit_feedback(
        self,
        playbook_id: str,
        was_successful: bool,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Submit feedback on a playbook's effectiveness.
        
        Args:
            playbook_id: ID of the playbook used
            was_successful: Whether the solution worked
            notes: Optional additional notes
            
        Returns:
            Confirmation response
        """
        if self._demo_mode:
            return {
                "status": "success",
                "message": "Feedback recorded",
                "playbook_id": playbook_id,
                "timestamp": datetime.now().isoformat()
            }
        
        raise NotImplementedError("Real API integration not implemented in demo")
    
    def get_ncert_references(
        self,
        topic: str,
        grade: int,
        subject: str
    ) -> List[Dict[str, str]]:
        """
        Get NCERT textbook references for a topic.
        
        Args:
            topic: Teaching topic
            grade: Class/grade level
            subject: Subject name
            
        Returns:
            List of NCERT chapter references
        """
        if self._demo_mode:
            return [
                {
                    "chapter": topic,
                    "class": str(grade),
                    "subject": subject,
                    "page_range": "45-52",
                    "key_concepts": ["Definition", "Examples", "Exercises"]
                }
            ]
        
        raise NotImplementedError("Real API integration not implemented in demo")


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def create_client(api_key: str = "demo-key", **kwargs) -> SahayakAI:
    """
    Create a SAHAYAK AI client.
    
    Args:
        api_key: Your API key
        **kwargs: Additional client configuration
        
    Returns:
        Configured SahayakAI client
    """
    return SahayakAI(api_key=api_key, **kwargs)


def quick_help(problem: str, language: str = "en") -> Dict[str, Any]:
    """
    Quick helper function to get a playbook without creating a client.
    
    Args:
        problem: Problem description
        language: Response language ("en" or "hi")
        
    Returns:
        Playbook as dictionary
    """
    client = SahayakAI(api_key="demo-key", language=language)
    playbook = client.get_playbook(problem)
    return playbook.to_dict()


# ============================================================================
# DEMO USAGE
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("SAHAYAK AI SDK - Demo")
    print("=" * 60)
    
    # Create client
    client = SahayakAI(api_key="demo-key", language="en")
    
    # Example 1: Get a playbook
    print("\n📚 Getting playbook for 'Students struggling with fractions'...")
    playbook = client.get_playbook("Students struggling with fractions")
    
    print(f"\n✅ Playbook ID: {playbook.id}")
    print(f"📝 Problem: {playbook.problem}")
    print(f"🎯 Trust Score: {playbook.trust_score:.0%}")
    print(f"\n💬 What to Say:")
    for phrase in playbook.what_to_say:
        print(f"   • {phrase}")
    
    print(f"\n🎮 Activity: {playbook.activity.name}")
    print(f"⏱️  Duration: {playbook.activity.duration_minutes} minutes")
    print(f"📦 Materials: {', '.join(playbook.activity.materials)}")
    
    # Example 2: Get quick fixes
    print("\n" + "=" * 60)
    print("📋 Getting quick fixes for Grade 1-2 Math...")
    fixes = client.get_quick_fixes(grade=1, subject="Math")
    for fix in fixes:
        print(f"   • {fix['topic']} (used {fix['usage_count']} times)")
    
    # Example 3: Teacher readiness
    print("\n" + "=" * 60)
    print("👩‍🏫 Checking teacher readiness...")
    readiness = client.get_teacher_readiness("teacher_001")
    print(f"   Status: {readiness.status}")
    print(f"   Score: {readiness.score:.0%}")
    print(f"   Recommended: {readiness.recommended_actions[0]}")
    
    # Example 4: Quick help function
    print("\n" + "=" * 60)
    print("⚡ Quick help (one-liner)...")
    result = quick_help("Students not paying attention")
    print(f"   Activity: {result['activity']['name']}")
    
    print("\n" + "=" * 60)
    print("✅ SDK Demo Complete!")
    print("=" * 60)
