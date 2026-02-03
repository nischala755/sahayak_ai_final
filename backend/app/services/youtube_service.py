"""YouTube video search service."""
import httpx
from typing import Optional
from ..config import get_settings

settings = get_settings()

YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"

# Mock video data for demo
MOCK_VIDEOS = [
    {
        "id": "dQw4w9WgXcQ",
        "title": "गिनती सीखें 1-10 | Learn Counting in Hindi",
        "channel": "Kids Learning Hindi",
        "duration": "5:30",
        "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
        "language": "hi",
        "grade": 1,
        "topic": "Counting"
    },
    {
        "id": "abc123xyz",
        "title": "Addition for Kids | जोड़ना सीखें",
        "channel": "Math Made Easy",
        "duration": "8:15",
        "thumbnail": "https://img.youtube.com/vi/abc123xyz/mqdefault.jpg",
        "language": "hi",
        "grade": 2,
        "topic": "Addition"
    },
    {
        "id": "def456uvw",
        "title": "Hindi Varnamala | हिंदी वर्णमाला",
        "channel": "Hindi Pathshala",
        "duration": "12:00",
        "thumbnail": "https://img.youtube.com/vi/def456uvw/mqdefault.jpg",
        "language": "hi",
        "grade": 1,
        "topic": "Alphabet"
    },
    {
        "id": "ghi789rst",
        "title": "Multiplication Tables Songs | पहाड़े गाना",
        "channel": "Fun Learning Songs",
        "duration": "6:45",
        "thumbnail": "https://img.youtube.com/vi/ghi789rst/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Multiplication"
    },
    {
        "id": "jkl012mno",
        "title": "Fractions for Beginners | भिन्न क्या है?",
        "channel": "Math Guru",
        "duration": "10:20",
        "thumbnail": "https://img.youtube.com/vi/jkl012mno/mqdefault.jpg",
        "language": "hi",
        "grade": 4,
        "topic": "Fractions"
    },
    {
        "id": "pqr345stu",
        "title": "Reading Comprehension Tips | पढ़ने की समझ",
        "channel": "Hindi Teacher",
        "duration": "7:30",
        "thumbnail": "https://img.youtube.com/vi/pqr345stu/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Reading"
    },
    {
        "id": "vwx678yza",
        "title": "Place Value Explained | स्थानीय मान",
        "channel": "Math Basics",
        "duration": "9:00",
        "thumbnail": "https://img.youtube.com/vi/vwx678yza/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Place Value"
    },
    {
        "id": "bcd901efg",
        "title": "English Speaking for Kids | बच्चों के लिए अंग्रेजी",
        "channel": "English Express",
        "duration": "11:15",
        "thumbnail": "https://img.youtube.com/vi/bcd901efg/mqdefault.jpg",
        "language": "hi",
        "grade": 3,
        "topic": "Speaking"
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
        
        # Check topic match
        if video["topic"].lower() in query_lower or query_lower in video["topic"].lower():
            score += 2
        
        # Check title match
        if any(word in video["title"].lower() for word in query_lower.split()):
            score += 1
        
        # Check grade match
        if grade and video["grade"] == grade:
            score += 1
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
    
    return results[:limit]
