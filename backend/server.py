from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY = os.environ.get('GOOGLE_SHEETS_API_KEY')
GOOGLE_SHEET_ID = os.environ.get('GOOGLE_SHEET_ID')

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TestData(BaseModel):
    date: str
    tester: str
    module: str
    test_cases: int
    passed: int
    failed: int
    build: str

class TestDataSummary(BaseModel):
    total_tests: int
    total_passed: int
    total_failed: int
    pass_rate: float
    total_testers: int
    total_modules: int
    total_builds: int

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Google Sheets Endpoints
def fetch_google_sheets_data():
    """Fetch data from Google Sheets"""
    try:
        service = build('sheets', 'v4', developerKey=GOOGLE_SHEETS_API_KEY)
        sheet = service.spreadsheets()
        result = sheet.values().get(
            spreadsheetId=GOOGLE_SHEET_ID,
            range='A:G'  # Columns: Date, Tester, Module, Test Cases, Passed, Failed, Build
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            return []
        
        # Skip header row
        data_rows = values[1:]
        test_data = []
        
        for row in data_rows:
            if len(row) >= 7:  # Ensure all columns are present
                try:
                    test_data.append({
                        'date': row[0],
                        'tester': row[1],
                        'module': row[2],
                        'test_cases': int(row[3]) if row[3].isdigit() else 0,
                        'passed': int(row[4]) if row[4].isdigit() else 0,
                        'failed': int(row[5]) if row[5].isdigit() else 0,
                        'build': row[6]
                    })
                except (ValueError, IndexError) as e:
                    logger.warning(f"Skipping row due to error: {e}")
                    continue
        
        return test_data
    
    except HttpError as error:
        logger.error(f"Google Sheets API error: {error}")
        raise
    except Exception as error:
        logger.error(f"Error fetching Google Sheets data: {error}")
        raise

@api_router.get("/test-data", response_model=List[TestData])
async def get_test_data(
    tester: Optional[str] = Query(None),
    module: Optional[str] = Query(None),
    build: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    """Get test data with optional filters"""
    data = fetch_google_sheets_data()
    
    # Apply filters
    if tester:
        data = [d for d in data if d['tester'].lower() == tester.lower()]
    if module:
        data = [d for d in data if d['module'].lower() == module.lower()]
    if build:
        data = [d for d in data if d['build'].lower() == build.lower()]
    if date_from:
        data = [d for d in data if d['date'] >= date_from]
    if date_to:
        data = [d for d in data if d['date'] <= date_to]
    
    return data

@api_router.get("/test-data/summary", response_model=TestDataSummary)
async def get_test_data_summary(
    tester: Optional[str] = Query(None),
    module: Optional[str] = Query(None),
    build: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None)
):
    """Get aggregated test data summary"""
    data = fetch_google_sheets_data()
    
    # Apply filters (same as above)
    if tester:
        data = [d for d in data if d['tester'].lower() == tester.lower()]
    if module:
        data = [d for d in data if d['module'].lower() == module.lower()]
    if build:
        data = [d for d in data if d['build'].lower() == build.lower()]
    if date_from:
        data = [d for d in data if d['date'] >= date_from]
    if date_to:
        data = [d for d in data if d['date'] <= date_to]
    
    if not data:
        return TestDataSummary(
            total_tests=0,
            total_passed=0,
            total_failed=0,
            pass_rate=0.0,
            total_testers=0,
            total_modules=0,
            total_builds=0
        )
    
    total_tests = sum(d['test_cases'] for d in data)
    total_passed = sum(d['passed'] for d in data)
    total_failed = sum(d['failed'] for d in data)
    pass_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0.0
    
    unique_testers = len(set(d['tester'] for d in data))
    unique_modules = len(set(d['module'] for d in data))
    unique_builds = len(set(d['build'] for d in data))
    
    return TestDataSummary(
        total_tests=total_tests,
        total_passed=total_passed,
        total_failed=total_failed,
        pass_rate=round(pass_rate, 2),
        total_testers=unique_testers,
        total_modules=unique_modules,
        total_builds=unique_builds
    )

@api_router.get("/test-data/filters")
async def get_filter_options():
    """Get available filter options (testers, modules, builds)"""
    data = fetch_google_sheets_data()
    
    testers = sorted(list(set(d['tester'] for d in data)))
    modules = sorted(list(set(d['module'] for d in data)))
    builds = sorted(list(set(d['build'] for d in data)))
    
    return {
        "testers": testers,
        "modules": modules,
        "builds": builds
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
