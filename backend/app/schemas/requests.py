from pydantic import BaseModel
from typing import Literal, List

class StartLessonRequest(BaseModel):
    level: Literal["beginner", "intermediate", "advanced"]
    topic: str

class SubmitAnswersRequest(BaseModel):
    answers: List[str]
    