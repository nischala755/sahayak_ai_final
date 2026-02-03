"""Gemini AI service for playbook generation."""
import google.generativeai as genai
from typing import Optional
import json
from ..config import get_settings

settings = get_settings()

# Configure Gemini
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

# Models
FLASH_MODEL = "gemini-2.0-flash"  # For live responses
BACKGROUND_MODEL = "gemini-2.0-flash"  # For background processing


def get_flash_model():
    """Get Gemini Flash model for quick responses."""
    return genai.GenerativeModel(FLASH_MODEL)


def get_background_model():
    """Get Gemini model for background processing."""
    return genai.GenerativeModel(BACKGROUND_MODEL)


PLAYBOOK_PROMPT = """You are SAHAYAK AI, an expert teaching assistant for Indian government school teachers.
Generate a practical, actionable teaching playbook for the following classroom situation.

Context:
- Grade: {grade}
- Subject: {subject}
- Topic: {topic}
- Problem: {problem}
- Language preference: {language} (respond in this language for what_to_say)
- Rural constraints: {constraints}

Generate a JSON response with this structure:
{{
  "what_to_say": ["3-4 exact phrases the teacher can say to students in {language}"],
  "activity": {{
    "name": "activity name",
    "steps": ["step 1", "step 2", "step 3"],
    "materials": ["list of locally available materials"],
    "duration_minutes": 10
  }},
  "class_management": ["2-3 tips for managing the class during this activity"],
  "quick_check": {{
    "questions": ["2-3 questions to check understanding"],
    "expected_responses": ["what correct answers would look like"],
    "success_indicators": ["signs that students understood"]
  }}
}}

IMPORTANT:
- Use ONLY locally available materials (sticks, stones, chalk, paper)
- Keep activities under 15 minutes
- Make what_to_say practical and in {language}
- Focus on FLN (Foundational Literacy and Numeracy) principles
- Assume large class size (40+ students)
- Assume minimal resources available
"""


async def generate_playbook(
    problem: str,
    grade: int,
    subject: str,
    topic: str,
    language: str = "hi",
    constraints: Optional[list] = None
) -> dict:
    """Generate a teaching playbook using Gemini."""
    
    if not settings.gemini_api_key:
        return get_fallback_playbook(problem, grade, subject, topic, language)
    
    try:
        model = get_flash_model()
        
        prompt = PLAYBOOK_PROMPT.format(
            grade=grade,
            subject=subject,
            topic=topic,
            problem=problem,
            language="Hindi" if language == "hi" else "English",
            constraints=", ".join(constraints) if constraints else "None specified"
        )
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON from response
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end]
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end]
        
        playbook = json.loads(response_text.strip())
        return playbook
        
    except Exception as e:
        print(f"Gemini error: {e}")
        return get_fallback_playbook(problem, grade, subject, topic, language)


def get_fallback_playbook(
    problem: str,
    grade: int,
    subject: str,
    topic: str,
    language: str
) -> dict:
    """Return a fallback playbook when AI is unavailable."""
    
    if language == "hi":
        what_to_say = [
            "आओ बच्चों, मिलकर सीखते हैं",
            "ध्यान से देखो और सुनो",
            "कोई भी सवाल पूछ सकता है",
            "बहुत अच्छे! फिर से करते हैं"
        ]
    else:
        what_to_say = [
            "Let's learn together, children",
            "Watch and listen carefully",
            "Anyone can ask questions",
            "Very good! Let's try again"
        ]
    
    return {
        "what_to_say": what_to_say,
        "activity": {
            "name": f"Interactive {topic} Activity",
            "steps": [
                "Gather students in a circle",
                "Demonstrate the concept using local materials",
                "Let students practice in pairs",
                "Check understanding with quick questions"
            ],
            "materials": ["Chalk", "Sticks", "Stones", "Paper"],
            "duration_minutes": 10
        },
        "class_management": [
            "Use clapping pattern to get attention",
            "Praise participation, not just correct answers",
            "Use peer helpers for struggling students"
        ],
        "quick_check": {
            "questions": [
                f"What did we learn about {topic} today?",
                "Can you show me with your fingers?",
                "Who can explain this to their partner?"
            ],
            "expected_responses": [
                "Students can explain in their own words",
                "Students demonstrate understanding physically",
                "Peer explanation is accurate"
            ],
            "success_indicators": [
                "80% students respond correctly",
                "Students ask follow-up questions",
                "Students help each other"
            ]
        }
    }


async def extract_context_from_text(text: str) -> dict:
    """Extract grade,subject, topic from natural language query."""
    
    if not settings.gemini_api_key:
        return extract_context_fallback(text)
    
    try:
        model = get_flash_model()
        
        prompt = f"""Extract teaching context from this query (could be in Hindi or English):
"{text}"

Return JSON with:
{{
  "grade": <integer 1-8 or null>,
  "subject": "<Math|Hindi|English|EVS|Science|General>",
  "topic": "<specific topic>",
  "problem_type": "<understanding|attention|behavior|resources|other>"
}}

Only return valid JSON, no explanation."""
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        if "```" in response_text:
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
            else:
                json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end]
        
        return json.loads(response_text.strip())
        
    except Exception as e:
        print(f"Context extraction error: {e}")
        return extract_context_fallback(text)


def extract_context_fallback(text: str) -> dict:
    """Fallback context extraction using keywords."""
    text_lower = text.lower()
    
    # Detect grade
    grade = None
    for g in range(1, 9):
        if f"grade {g}" in text_lower or f"class {g}" in text_lower or f"कक्षा {g}" in text:
            grade = g
            break
    
    # Detect subject
    subject = "General"
    subject_keywords = {
        "Math": ["math", "गणित", "counting", "गिनती", "addition", "जोड़", "subtraction", "घटा"],
        "Hindi": ["hindi", "हिंदी", "reading", "पढ़ना", "writing", "लिखना", "अक्षर"],
        "English": ["english", "अंग्रेजी", "alphabet"],
        "EVS": ["evs", "पर्यावरण", "science", "विज्ञान", "nature"]
    }
    
    for subj, keywords in subject_keywords.items():
        if any(kw in text_lower for kw in keywords):
            subject = subj
            break
    
    # Basic topic extraction
    topic = "General classroom issue"
    if "attention" in text_lower or "ध्यान" in text:
        topic = "Attention"
    elif "counting" in text_lower or "गिनती" in text:
        topic = "Counting"
    elif "reading" in text_lower or "पढ़" in text:
        topic = "Reading"
    
    return {
        "grade": grade,
        "subject": subject,
        "topic": topic,
        "problem_type": "other"
    }
