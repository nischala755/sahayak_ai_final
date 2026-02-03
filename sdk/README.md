# SAHAYAK AI SDK

Lightweight SDK for integrating SAHAYAK AI classroom coaching into your applications.

## Installation

### Python
```bash
pip install sahayak-ai-sdk  # Coming soon to PyPI
# For now, just copy sahayak_sdk.py to your project
```

### JavaScript
```bash
npm install sahayak-ai-sdk  # Coming soon to NPM
# For now, just copy sahayak-sdk.js to your project
```

## Quick Start

### Python

```python
from sahayak_sdk import SahayakAI

# Create client
client = SahayakAI(api_key="your-api-key")

# Get a teaching playbook
playbook = client.get_playbook("Students not understanding fractions")

# Use the playbook
print(playbook.what_to_say)  # Phrases to say to students
print(playbook.activity.name)  # Activity name
print(playbook.activity.steps)  # Step-by-step instructions
```

### JavaScript

```javascript
import { SahayakAI } from './sahayak-sdk.js';

// Create client
const client = new SahayakAI({ apiKey: 'your-api-key' });

// Get a teaching playbook
const playbook = await client.getPlaybook('Students not understanding fractions');

// Use the playbook
console.log(playbook.whatToSay);
console.log(playbook.activity.name);
```

## Features

### 🎯 Get Teaching Playbooks
Get AI-generated teaching strategies with:
- What to say to students
- Step-by-step activities
- Materials needed
- Class management tips
- Quick assessment questions
- NCERT references
- YouTube resources

### 📚 Quick Fixes Cache
Access pre-cached solutions for common problems:
```python
fixes = client.get_quick_fixes(grade=4, subject="Math")
```

### 👩‍🏫 Teacher Readiness Signal
Check if a teacher is prepared for class:
```python
readiness = client.get_teacher_readiness("teacher_123")
print(readiness.status)  # "ready", "needs_support", or "at_risk"
```

### 📝 Feedback Submission
Improve the system with feedback:
```python
client.submit_feedback(
    playbook_id="pb_001",
    was_successful=True,
    notes="Activity worked great!"
)
```

## API Reference

### SahayakAI Client

```python
client = SahayakAI(
    api_key="your-key",      # API key (use "demo-key" for demo)
    base_url="http://...",   # API base URL
    language="en",           # Default language (en/hi)
    timeout=30               # Request timeout
)
```

### Methods

| Method | Description |
|--------|-------------|
| `get_playbook(problem, context)` | Get a teaching playbook |
| `get_quick_fixes(grade, subject, limit)` | Get cached quick fixes |
| `get_teacher_readiness(teacher_id)` | Get readiness signal |
| `submit_feedback(playbook_id, success, notes)` | Submit feedback |
| `get_ncert_references(topic, grade, subject)` | Get NCERT refs |

### Data Models

**Playbook**
- `id: str` - Unique playbook ID
- `problem: str` - Problem description
- `what_to_say: List[str]` - Phrases for teacher
- `activity: Activity` - Main activity
- `class_management: List[str]` - Management tips
- `quick_check: QuickCheck` - Assessment
- `trust_score: float` - Confidence score

**TeacherContext**
- `grade: int` - Class/grade level
- `subject: str` - Subject name
- `topic: str` - Specific topic
- `language: str` - Language preference

## Demo Mode

Use `api_key="demo-key"` for demo mode with mock data:

```python
client = SahayakAI(api_key="demo-key")
playbook = client.get_playbook("fractions help")  # Returns mock data
```

## Examples

### Integration with EdTech App

```python
from sahayak_sdk import SahayakAI, TeacherContext

client = SahayakAI(api_key="your-key")

# Teacher presses SOS button
def handle_sos(teacher_input, teacher_profile):
    context = TeacherContext(
        grade=teacher_profile.grade,
        subject=teacher_profile.subject,
        language=teacher_profile.language
    )
    
    playbook = client.get_playbook(teacher_input, context)
    
    return {
        "what_to_say": playbook.what_to_say,
        "activity": playbook.activity.name,
        "steps": playbook.activity.steps,
        "trust_score": playbook.trust_score
    }
```

### Batch Processing

```python
problems = [
    "Students not counting",
    "Reading difficulties",
    "Attention issues"
]

playbooks = [client.get_playbook(p) for p in problems]
```

## Run Demo

```bash
python sahayak_sdk.py
```

Output:
```
============================================================
SAHAYAK AI SDK - Demo
============================================================

📚 Getting playbook for 'Students struggling with fractions'...

✅ Playbook ID: pb_fractions_001
📝 Problem: Students not understanding fractions
🎯 Trust Score: 92%

💬 What to Say:
   • Let's divide this roti into equal parts
   • Fold the paper in half - that's 1/2
   • Now fold it again - what do we have?

🎮 Activity: Paper Folding Fractions
⏱️  Duration: 15 minutes
📦 Materials: Paper, Crayons, Scissors

✅ SDK Demo Complete!
```

## Support

- 📧 Email: support@sahayak.ai
- 📖 Docs: https://docs.sahayak.ai
- 🐛 Issues: https://github.com/sahayak-ai/sdk/issues

## License

MIT License - Free for educational use
