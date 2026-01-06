from fastapi import APIRouter, HTTPException
from uuid import uuid4

from app.graph.workflow import build_workflow
from app.graph.state import State
from app.schemas.requests import StartLessonRequest, SubmitAnswersRequest
from app.schemas.responses import LessonStartResponse, FeedbackResponse
from app.storage.memory import LESSON_STORE

router = APIRouter(prefix="/lesson", tags=["Lesson"])

graph = build_workflow()
@router.post("/start", response_model=LessonStartResponse)
def start_lesson(req: StartLessonRequest):
    lesson_id = str(uuid4())

    initial_state: State = {
        "messages": [
            {
                "role": "user",
                "content": f"I am {req.level}, give me a story about {req.topic}",
            }
        ],
        "student_level": "",
        "topic": "",
        "story": "",
        "questions": [],
        "student_answers": [],
        "feedback": [],
        "explanation": {},
    }

    result = graph.invoke(initial_state)

    LESSON_STORE[lesson_id] = result

    return {
        "lesson_id": lesson_id,
        "story": result["story"],
        "questions": result["questions"],
        "explanation": result["explanation"],
    }

@router.post("/{lesson_id}/answer", response_model=FeedbackResponse)
def submit_answers(lesson_id: str, req: SubmitAnswersRequest):
    state = LESSON_STORE.get(lesson_id)

    if not state:
        raise HTTPException(status_code=404, detail="Lesson not found")

    state["student_answers"] = req.answers

    result = graph.invoke(state)

    LESSON_STORE[lesson_id] = result

    return {
        "feedback": result["feedback"]
    }
