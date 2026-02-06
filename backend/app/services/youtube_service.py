"""YouTube video search service."""
import httpx
from typing import Optional
from ..config import get_settings

settings = get_settings()

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"

# Mock video data for demo - comprehensive coverage
MOCK_VIDEOS = [
    {
        "id": "dQw4w9WgXcQ",
        "title": "गिनती सीखें 1-10 | Learn Counting in Hindi",
        "channel": "Kids Learning Hindi",
        "duration": "5:30",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        "language": "hi",
        "grade": 1,
        "topic": "Counting numbers"
    },
    {
        "id": "abc123xyz",
        "title": "Addition for Kids | जोड़ना सीखें",
        "channel": "Math Made Easy",
        "duration": "8:15",
        "thumbnail": "https://img.youtube.com/vi/abc123xyz/mqdefault.jpg",
        "language": "hi",
        "grade": 2,
        "topic": "Addition subtraction"
    },
    {
        "id": "fraction001",
        "title": "भिन्न (Fractions) क्या होते हैं? | Class 5-6 Maths",
        "channel": "Vedantu Young Wonders",
        "duration": "12:30",
        "thumbnail": "https://img.youtube.com/vi/fraction001/mqdefault.jpg",
        "language": "hi",
        "grade": 5,
        "topic": "Fractions भिन्न"
    },
    {
        "id": "fraction002",
        "title": "भिन्नों का जोड़ और घटाव | Adding Fractions in Hindi",
        "channel": "Maths Pathshala",
        "duration": "15:00",
        "thumbnail": "https://img.youtube.com/vi/fraction002/mqdefault.jpg",
        "language": "hi",
        "grade": 6,
        "topic": "Fractions addition भिन्न जोड़"
    },
    {
        "id": "science001",
        "title": "मानव शरीर के अंग | Human Body Parts for Kids",
        "channel": "Science Express Hindi",
        "duration": "10:45",
        "thumbnail": "https://img.youtube.com/vi/science001/mqdefault.jpg",
        "language": "hi",
        "grade": 5,
        "topic": "Human body शरीर"
    },
    {
        "id": "science002",
        "title": "पाचन तंत्र कैसे काम करता है | Digestive System",
        "channel": "Byju's Hindi",
        "duration": "11:20",
        "thumbnail": "https://img.youtube.com/vi/science002/mqdefault.jpg",
        "language": "hi",
        "grade": 6,
        "topic": "Digestive system पाचन"
    },
    {
        "id": "hindi001",
        "title": "हिंदी व्याकरण - संज्ञा | Noun in Hindi Grammar",
        "channel": "Hindi Guru",
        "duration": "8:00",
        "thumbnail": "https://img.youtube.com/vi/hindi001/mqdefault.jpg",
        "language": "hi",
        "grade": 4,
        "topic": "Noun संज्ञा grammar"
    },
    {
        "id": "hindi002",
        "title": "हिंदी कहानी पढ़ना सीखें | Hindi Story Reading",
        "channel": "Pratham Books",
        "duration": "6:30",
        "thumbnail": "https://img.youtube.com/vi/hindi002/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Reading comprehension पढ़ना"
    },
    {
        "id": "english001",
        "title": "English Speaking Practice for Kids | अंग्रेजी बोलना सीखें",
        "channel": "English Express",
        "duration": "9:15",
        "thumbnail": "https://img.youtube.com/vi/english001/mqdefault.jpg",
        "language": "hi",
        "grade": 4,
        "topic": "English speaking vocabulary"
    },
    {
        "id": "maths003",
        "title": "गुणा पहाड़े 2-10 | Multiplication Tables Song",
        "channel": "Fun Learning Hindi",
        "duration": "7:00",
        "thumbnail": "https://img.youtube.com/vi/maths003/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Multiplication tables गुणा"
    },
    {
        "id": "maths004",
        "title": "भाग कैसे करें | Division for Kids in Hindi",
        "channel": "Maths Magic",
        "duration": "10:00",
        "thumbnail": "https://img.youtube.com/vi/maths004/mqdefault.jpg",
        "language": "hi",
        "grade": 4,
        "topic": "Division भाग"
    },
    {
        "id": "evs001",
        "title": "पौधों के भाग | Parts of Plants EVS",
        "channel": "EVS Learning",
        "duration": "8:30",
        "thumbnail": "https://img.youtube.com/vi/evs001/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Plants पौधे"
    },
    {
        "id": "general001",
        "title": "Classroom Management Tips | कक्षा प्रबंधन",
        "channel": "Teacher Training",
        "duration": "12:00",
        "thumbnail": "https://img.youtube.com/vi/general001/mqdefault.jpg",
        "language": "hi",
        "grade": 0,
        "topic": "Teaching classroom management attention"
    },
    {
        "id": "general002",
        "title": "बच्चों का ध्यान कैसे आकर्षित करें | Student Engagement",
        "channel": "Shiksha Sarthi",
        "duration": "9:45",
        "thumbnail": "https://img.youtube.com/vi/general002/mqdefault.jpg",
        "language": "hi",
        "grade": 0,
        "topic": "Attention engagement focus"
    }
]


async def search_videos(
    query: str,
    grade: Optional[int] = None,
    language: str = "hi",
    limit: int = 5
) -> list:
    """Search for educational videos."""
    
    # Try real YouTube API first
    if settings.youtube_api_key:
        try:
            return await search_youtube_api(query, grade, language, limit)
        except Exception as e:
            print(f"YouTube API error: {e}")
    
    # Fall back to mock data
    return search_mock_videos(query, grade, language, limit)


async def search_youtube_api(
    query: str,
    grade: Optional[int],
    language: str,
    limit: int
) -> list:
    """Search using YouTube Data API."""
    
    # Build search query
    search_query = f"{query} class {grade} {language} educational" if grade else f"{query} educational {language}"
    
    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "maxResults": limit,
        "key": settings.youtube_api_key,
        "videoEmbeddable": "true",
        "relevanceLanguage": language,
        "safeSearch": "strict"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(YOUTUBE_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
    
    videos = []
    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        snippet = item["snippet"]
        
        videos.append({
            "id": video_id,
            "title": snippet["title"],
            "channel": snippet["channelTitle"],
            "duration": "N/A",  # Duration requires separate API call
            "thumbnail": snippet["thumbnails"]["medium"]["url"],
            "embed_url": f"https://www.youtube.com/embed/{video_id}",
            "language": language,
            "grade": grade or 0,
            "relevance_score": 0.85
        })
    
    return videos


def search_mock_videos(
    query: str,
    grade: Optional[int],
    language: str,
    limit: int
) -> list:
    """Search mock video data."""
    
    query_lower = query.lower()
    results = []
    
    for video in MOCK_VIDEOS:
        score = 0
        
        # Check topic match (split by spaces for partial match)
        topic_words = video["topic"].lower().split()
        query_words = query_lower.split()
        
        for qw in query_words:
            for tw in topic_words:
                if qw in tw or tw in qw:
                    score += 2
        
        # Check title match
        if any(word in video["title"].lower() for word in query_words if len(word) > 2):
            score += 1
        
        # Check grade match
        if grade and video["grade"] == grade:
            score += 1.5
        elif grade and video["grade"] == 0:  # General videos
            score += 0.5
        elif grade and abs(video["grade"] - grade) <= 1:
            score += 0.5
        
        # Check language match
        if video["language"] == language:
            score += 0.5
        
        if score > 0:
            results.append({
                **video,
                "embed_url": f"https://www.youtube.com/embed/{video['id']}",
                "relevance_score": min(score / 4, 1.0)
            })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    
    # If no results, return some default educational videos
    if not results:
        defaults = [v for v in MOCK_VIDEOS if v["grade"] == 0 or (grade and abs(v["grade"] - grade) <= 2)][:limit]
        results = [{
            **v,
            "embed_url": f"https://www.youtube.com/embed/{v['id']}",
            "relevance_score": 0.5
        } for v in defaults]
    
    return results[:limit]
