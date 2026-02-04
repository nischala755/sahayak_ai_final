
import os

readme_path = r"c:\Users\Lenovo\Desktop\project\sikshalokam_finals\README.md"
mermaid_content = """```mermaid
graph TD
    %% Client Layer
    subgraph Client_Layer["📱 Client Layer (Frontend)"]
        TeacherApp["👩‍🏫 Teacher App\\n(React PWA + Vite)"]
        CRPDB["👨‍💼 CRP Dashboard\\n(React + Recharts)"]
        DIETDB["🎓 DIET Dashboard\\n(React + Analytics)"]
        
        %% Features
        TTS["🔊 Text-to-Speech\\n(Web Speech API)"]
        Voice["🎤 Voice Input\\n(Web Speech API)"]
        Offline["📴 Offline Manager\\n(Service Workers)"]
        
        TeacherApp --- Voice
        TeacherApp --- TTS
        TeacherApp --- Offline
    end

    %% SDK Layer (New)
    subgraph SDK_Layer["📦 Integration SDKs"]
        PySDK["🐍 Python SDK\\n(Pip Package)"]
        JSSDK["📜 JavaScript SDK\\n(NPM Package)"]
    end

    %% API Gateway
    API_Gateway["🌐 API Gateway\\n(FastAPI / REST)"]
    
    %% Backend Services
    subgraph Backend_Layer["⚙️ Backend Layer (FastAPI)"]
        AuthService["🔐 Auth Service\\n(JWT + OAuth)"]
        SOSService["🆘 SOS Service\\n(Orchestrator)"]
        VideoService["🎥 Video Service\\n(YouTube API)"]
        AnalyticsService["📊 Analytics Engine\\n(Pandas)"]
        
        %% Core Logic
        RAGSystem["🧠 RAG Pipeline\\n(LangChain)"]
        QuickFix["⚡ Quick Fix Engine\\n(Redis Cache)"]
    end

    %% Data & AI Layer
    subgraph Data_AI_Layer["💽 Data & AI Services"]
        %% Databases
        ChromaDB["📚 ChromaDB\\n(Vector Store)"]
        Redis["🚀 Redis\\n(Cache/Session)"]
        
        %% AI Models
        Gemini["✨ Google Gemini 2.5\\n(Primary LLM)"]
        Mistral["🌪️ Mistral AI\\n(Fallback/Specialized)"]
        
        %% External
        SMS_GW["📲 SMS Gateway\\n(Twilio/Local)"]
    end

    %% Key Interactions
    TeacherApp -->|HTTPS/WSS| API_Gateway
    CRPDB -->|HTTPS| API_Gateway
    DIETDB -->|HTTPS| API_Gateway
    
    SDK_Layer -.->|API Calls| API_Gateway
    
    API_Gateway --> SOSService
    API_Gateway --> AuthService
    API_Gateway --> VideoService
    API_Gateway --> AnalyticsService
    
    SOSService --> QuickFix
    SOSService --> RAGSystem
    
    QuickFix --> Redis
    RAGSystem --> ChromaDB
    RAGSystem --> Gemini
    RAGSystem --> Mistral
    
    SOSService --> SMS_GW

    %% Styles
    classDef frontend fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef data fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef sdk fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    
    class TeacherApp,CRPDB,DIETDB,TTS,Voice,Offline frontend;
    class AuthService,SOSService,VideoService,AnalyticsService,RAGSystem,QuickFix,API_Gateway backend;
    class ChromaDB,Redis,Gemini,Mistral,SMS_GW data;
    class PySDK,JSSDK sdk;
```"""

with open(readme_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
found_arch = False

for i, line in enumerate(lines):
    if "## 🏗️ System Architecture" in line:
        found_arch = True
        new_lines.append(line)
        continue
    
    if found_arch and line.strip() == "```" and not skip:
        # Start of ASCII block
        skip = True
        new_lines.append(mermaid_content + "\n")
        continue

    if skip and line.strip() == "```":
        # End of ASCII block
        skip = False
        continue

    if not skip:
        new_lines.append(line)

with open(readme_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("README.md updated successfully")
