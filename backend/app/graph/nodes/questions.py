from pydantic import BaseModel
from typing import List
from app.llm.ollama import llm

class QuestionOutput(BaseModel):
    questions: List[str]

def generate_questions(state):
    question_gen = llm.with_structured_output(QuestionOutput)

    reply = question_gen.invoke([
        {
            "role": "system",
            "content": (
                "You are a German tutor. "
                "Generate comprehension and grammar questions "
                f"for {state['student_level']} level."
            ),
        },
        {
            "role": "user",
            "content": state["story"],
        },
    ])

    return {"questions": reply.questions}
