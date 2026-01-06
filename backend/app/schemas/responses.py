from pydantic import BaseModel
from typing import List

class LessonStartResponse(BaseModel):
    lesson_id: str
    story: str
    questions: List[str]
    explanation: dict

class FeedbackResponse(BaseModel):
    feedback: List[str]
