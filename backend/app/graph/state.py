from typing import Annotated, Literal, List
from pydantic import BaseModel
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    message_type: str | None
    next: str | None
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic: str 
    story: str 
    questions: List[str]
    student_answers: List[str] 
    feedback: List[str]
    grammar: str
    translation : str
    