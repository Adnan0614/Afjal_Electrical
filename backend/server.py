from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
from lib.db import client, db

# Import routers
from routers.leads import router as leads_router
from routers.emergency import router as emergency_router
from routers.jobs import router as jobs_router
from routers.reviews import router as reviews_router
from routers.stats import router as stats_router
from routers.auth import router as auth_router
from routers.settings import router as settings_router
from routers.sales import router as sales_router
from routers.speech import router as speech_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    client.close()

# Create the main app without a prefix
app = FastAPI(lifespan=lifespan, title="Afjal Electrical and Rewinding Works API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models for generic status
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Status check routes
@api_router.get("/")
async def root() -> Dict[str, Any]:
    return {
        "business_name": "Afjal Electrical and Rewinding Works",
        "proprietor": "Mohammad Afjal",
        "established": 2003,
        "location": "Tilda Neora, Raipur, Chhattisgarh",
        "phone": "+91 9669718100",
        "status": "online"
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Mount all feature routers under /api
api_router.include_router(leads_router)
api_router.include_router(emergency_router)
api_router.include_router(jobs_router)
api_router.include_router(reviews_router)
api_router.include_router(stats_router)
api_router.include_router(auth_router)
api_router.include_router(settings_router)
api_router.include_router(sales_router)
api_router.include_router(speech_router)

# Include api_router into app at the very end
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
