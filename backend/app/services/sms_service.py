"""SMS gateway mock service for offline fallback."""
from typing import Optional
import asyncio


class MockSMSService:
    """Mock SMS gateway for demo."""
    
    def __init__(self):
        self.sent_messages = []
    
    async def send_sms(
        self,
        phone_number: str,
        message: str,
        language: str = "hi"
    ) -> dict:
        """Mock send SMS."""
        
        # Simulate network delay
        await asyncio.sleep(0.1)
        
        # Truncate message for SMS
        if len(message) > 160:
            message = message[:157] + "..."
        
        record = {
            "phone": phone_number,
            "message": message,
            "language": language,
            "status": "sent",
            "message_id": f"sms_{len(self.sent_messages) + 1}"
        }
        
        self.sent_messages.append(record)
        
        return {
            "success": True,
            "message_id": record["message_id"],
            "status": "sent"
        }
    
    async def send_playbook_summary(
        self,
        phone_number: str,
        playbook: dict,
        language: str = "hi"
    ) -> dict:
        """Send playbook summary via SMS."""
        
        if language == "hi":
            summary = f"SAHAYAK AI: {playbook.get('activity', {}).get('name', 'गतिविधि')}\n"
            summary += "कदम: " + ", ".join(playbook.get("activity", {}).get("steps", [])[:2])
        else:
            summary = f"SAHAYAK AI: {playbook.get('activity', {}).get('name', 'Activity')}\n"
            summary += "Steps: " + ", ".join(playbook.get("activity", {}).get("steps", [])[:2])
        
        return await self.send_sms(phone_number, summary, language)
    
    def get_sent_messages(self) -> list:
        """Get all sent messages (for debugging)."""
        return self.sent_messages


# Global instance
sms_service = MockSMSService()


def get_sms_service() -> MockSMSService:
    """Get SMS service instance."""
    return sms_service
