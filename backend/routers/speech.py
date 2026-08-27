"""Speech-to-text for the emergency SOS form.

Audio is transcribed in-memory with Emergent-managed Whisper (whisper-1) and
never written to disk or stored in Mongo — only the resulting text is returned.
"""

import io
import os

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from emergentintegrations.llm.openai import OpenAISpeechToText

router = APIRouter(prefix="/speech", tags=["speech"])

MAX_BYTES = 25 * 1024 * 1024  # Whisper hard limit
ALLOWED_SUFFIXES = ("mp3", "mp4", "mpeg", "mpga", "m4a", "wav", "webm")


class Transcription(BaseModel):
    text: str


@router.post("/transcribe", response_model=Transcription)
async def transcribe(audio: UploadFile = File(...)) -> Transcription:
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Speech-to-text is not configured.")

    raw = await audio.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty audio upload.")
    if len(raw) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Recording too long. Keep it under 25 MB.")

    # Whisper picks the format from the filename suffix; browsers send webm/opus.
    content_type = (audio.content_type or "").lower()
    suffix = "webm"
    for candidate in ALLOWED_SUFFIXES:
        if candidate in content_type or (audio.filename or "").lower().endswith(f".{candidate}"):
            suffix = candidate
            break

    buffer = io.BytesIO(raw)
    buffer.name = f"sos_recording.{suffix}"

    stt = OpenAISpeechToText(api_key=api_key)
    try:
        # No `language` argument: Whisper auto-detects, so Hindi and English both work.
        response = await stt.transcribe(file=buffer, model="whisper-1", response_format="json")
    except Exception as exc:  # noqa: BLE001 — surface a clean message to the UI
        raise HTTPException(status_code=502, detail=f"Transcription failed: {exc}") from exc

    text = (getattr(response, "text", "") or "").strip()
    if not text:
        raise HTTPException(status_code=422, detail="Could not hear any speech in the recording.")

    return Transcription(text=text)
