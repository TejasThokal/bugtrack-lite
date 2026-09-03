from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Bug(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    status: str = "Open"

# 10 Real QA bugs
bugs_db = [
    Bug(id=1001, title="Login crashes on Safari 17", description="TypeError when submitting form on Safari desktop", priority="High", status="Open"),
    Bug(id=1002, title="Payment webhook not triggering in prod", description="Stripe webhook failing, no event received", priority="High", status="Open"),
    Bug(id=1003, title="Export CSV fails for >10k rows", description="Timeout after 30s when exporting large data", priority="Medium", status="Open"),
    Bug(id=1004, title="Dark mode toggle not persisting", description="Theme resets to light on page reload", priority="Medium", status="In Progress"),
    Bug(id=1005, title="Rate limiting missing on /api/users", description="Need to add throttling to prevent abuse", priority="Medium", status="In Progress"),
    Bug(id=1006, title="Mobile navbar overlapping content", description="On iPhone 13, menu covers hero section", priority="High", status="In Progress"),
    Bug(id=1007, title="Fix typo in onboarding modal", description="Getting Started spelled wrong", priority="Low", status="Closed"),
    Bug(id=1008, title="Update privacy policy link in footer", description="Link pointing to old /privacy-v1", priority="Low", status="Closed"),
    Bug(id=1009, title="Search API returning 500 on empty query", description="Should return [] not 500", priority="High", status="Open"),
    Bug(id=1010, title="Avatar upload not compressing image", description="5MB images causing slow load", priority="Medium", status="Closed"),
]

@app.get("/")
def home(): return {"message": "BugTrack API Running", "total": len(bugs_db)}

@app.get("/bugs", response_model=List[Bug])
def get_bugs(): return bugs_db

@app.post("/bugs")
def create_bug(bug: Bug):
    bugs_db.append(bug)
    return bug

@app.put("/bugs/{bug_id}")
def update_status(bug_id: int, status: str):
    for b in bugs_db:
        if b.id == bug_id:
            b.status = status
            return b
    return {"error": "Not found"}

@app.delete("/bugs/{bug_id}")
def delete_bug(bug_id: int):
    global bugs_db
    bugs_db = [b for b in bugs_db if b.id!= bug_id]
    return {"deleted": True}