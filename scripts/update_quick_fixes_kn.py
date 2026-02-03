import json
import os

# Kannada translations for specific Quick Fix IDs
translations = {
    "qf1": {
        "problem_kn": "ಮಕ್ಕಳು ಎಣಿಸಲು ಕಲಿಯುತ್ತಿಲ್ಲ",
        "what_to_say_kn": [
            "ಬನ್ನಿ ಮಕ್ಕಳೇ, ಎಣಿಸುವ ಆಟ ಆಡೋಣ",
            "ನಿಮ್ಮ ಬೆರಳುಗಳನ್ನು ತೋರಿಸಿ",
            "ಒಂದು, ಎರಡು, ಮೂರು ಎಣಿಸಿ"
        ],
        "activity_kn": "ಬೆರಳು ಎಣಿಸುವ ಆಟ"
    },
    "qf2": {
        "problem_kn": "ಸೇರ್ಪಡೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ",
        "what_to_say_kn": [
            "ಕಲ್ಲುಗಳೊಂದಿಗೆ ಸೇರ್ಪಡೆ ಕಲಿಯೋಣ",
            "ಎರಡು ಮತ್ತು ಮೂರು ಕಲ್ಲುಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ",
            "ಒಟ್ಟು ಎಷ್ಟು?"
        ],
        "activity_kn": "ಕಲ್ಲುಗಳ ಎಣಿಕೆ ಮತ್ತು ಗುಂಪು ಮಾಡುವಿಕೆ"
    },
    "qf3": {
        "problem_kn": "ಗಮನ ಕೊಡುತ್ತಿಲ್ಲ",
        "what_to_say_kn": [
            "ಎಲ್ಲರೂ ಎದ್ದು ನಿಲ್ಲಿ",
            "ತಲೆ, ಭುಜ, ಮೊಣಕಾಲು, ಕಾಲ್ಬೆರಳು ಹಾಡೋಣ",
            "ಚಪ್ಪಾಳೆ ತಟ್ಟಿ!"
        ],
        "activity_kn": "ಚಟುವಟಿಕೆ ಹಾಡು - ತಲೆ ಭುಜ ಹಾಡು"
    },
    "qf4": {
        "problem_kn": "ಓದುವ ಗ್ರಹಿಕೆ ಸಮಸ್ಯೆಯಾಗಿದೆ",
        "what_to_say_kn": [
            "ಮೊದಲು ಚಿತ್ರ ನೋಡಿ",
            "ಈ ಕಥೆಯಲ್ಲಿ ಏನಾಗುತ್ತದೆ ಎಂದು ಊಹಿಸಿ?",
            "ಒಟ್ಟಿಗೆ ಓದೋಣ"
        ],
        "activity_kn": "ಓದುವ ಮೊದಲು ಚಿತ್ರ ಊಹೆ"
    },
    "qf5": {
        "problem_kn": "ವ್ಯವಕಲನದಲ್ಲಿ ಗೊಂದಲ",
        "what_to_say_kn": [
            "ಬಿಡಿಗಳಲ್ಲಿ ಕಡಿಮೆ ಇರುವಾಗ ಹತ್ತುಗಳಿಂದ ಎರವಲು ಪಡೆಯುತ್ತೇವೆ",
            "ಒಂದು ಕಟ್ಟನ್ನು ತೆರೆಯಿರಿ",
            "ಈಗ ಕಳೆಯಿರಿ"
        ],
        "activity_kn": "ಕಡ್ಡಿಗಳ ಕಟ್ಟು ಬಿಡಿಸುವ ಚಟುವಟಿಕೆ"
    },
    "qf6": {
        "problem_kn": "ಅಕ್ಷರಮಾಲೆ ನೆನಪಿಲ್ಲ",
        "what_to_say_kn": [
            "ಅಕ್ಷರ ಹಾಡನ್ನು ಹಾಡೋಣ",
            "ಗಾಳಿಯಲ್ಲಿ ಬರೆಯಿರಿ",
            "ನಿಮ್ಮ ಬೆರಳಿನಿಂದ ತಿದ್ದಿ"
        ],
        "activity_kn": "ಗಾಳಿಯಲ್ಲಿ ಬರೆಯುವುದು ಮತ್ತು ಅಕ್ಷರ ಹಾಡು"
    },
    "qf7": {
        "problem_kn": "ಮಗ್ಗಿಗಳು ನೆನಪಿಲ್ಲ",
        "what_to_say_kn": [
            "ಮಗ್ಗಿ ಹೇಳುವಾಗ ಚಪ್ಪಾಳೆ ತಟ್ಟಿ",
            "2 ರ ಮಗ್ಗಿ ಹಾಡಿ",
            "ಒಟ್ಟಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಿ"
        ],
        "activity_kn": "ಚಪ್ಪಾಳೆ ತಟ್ಟುತ್ತಾ ಮಗ್ಗಿ ಹೇಳುವುದು"
    }
}

file_path = "backend/app/data/quick_fixes.json"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    updated_count = 0
    for item in data:
        qf_id = item.get("id")
        
        # Add translated content if available
        if qf_id in translations:
            item.update(translations[qf_id])
            item["language"] = "kn"  # Just to mark it has kn support, strictly speaking it supports multiple
            updated_count += 1
        else:
            # Fallback for others: Use English/Hindi as base but mark keys
            # In a real app, we'd translate all. For now, we'll copy English to Kannada keys
            # to prevent UI errors, maybe prefix with (KN) to indicate automated/fallback
            item["problem_kn"] = item.get("problem_hi", item.get("problem", ""))
            item["what_to_say_kn"] = item.get("what_to_say_hi", item.get("what_to_say", []))
            item["activity_kn"] = item.get("activity_hi", item.get("activity", ""))
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print(f"Successfully updated {updated_count} quick fixes with specific Kannada translations and added fallbacks for the rest.")

except Exception as e:
    print(f"Error updating quick fixes: {e}")
