import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from .security_engine import SecurityEngine

app = FastAPI(
    title="Prompt Guard 2 Email Security Microservice",
    description="Pretrained ML-based prompt injection detection and prevention engine using Meta Prompt Guard 2",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AttachmentPayload(BaseModel):
    name: Optional[str] = "attachment"
    filename: Optional[str] = None
    content: Optional[str] = ""
    text: Optional[str] = None
    mimeType: Optional[str] = None

class EmailScanRequest(BaseModel):
    id: Optional[str] = None
    subject: Optional[str] = ""
    from_address: Optional[str] = Field(default="", alias="from")
    to: Optional[str] = ""
    body: Optional[str] = ""
    html: Optional[str] = ""
    attachments: Optional[List[Dict[str, Any]]] = []

    class Config:
        allow_population_by_field_name = True

engine = SecurityEngine.get_instance()

@app.get("/health")
@app.get("/api/security/health")
def health():
    stats = engine.get_statistics()
    return {
        "status": "online" if stats["model_ready"] else "ready_offline",
        "model_ready": stats["model_ready"],
        "model_name": stats["model_name"],
        "device": stats["device"]
    }

@app.post("/scan")
@app.post("/api/security/scan-email")
def scan_email(payload: EmailScanRequest):
    try:
        data = payload.dict(by_alias=True)
        # Ensure 'from' is mapped
        if "from_address" in data and not data.get("from"):
            data["from"] = data["from_address"]
        result = engine.scan_email(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/statistics")
@app.get("/api/security/statistics")
def statistics():
    return engine.get_statistics()

@app.get("/history")
@app.get("/api/security/scan-history")
def history(limit: int = 50):
    return {"history": engine.get_scan_history(limit)}

if __name__ == "__main__":
    port = int(os.getenv("SECURITY_SERVICE_PORT", "8001"))
    host = os.getenv("SECURITY_SERVICE_HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)
