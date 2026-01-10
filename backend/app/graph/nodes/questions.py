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
                """"You are a professional German tutor.

TASK:
Generate questions based strictly on the given German story.
The questions test reading comprehension and grammar understanding.

LANGUAGE RULES:
- Write ALL questions in German ONLY.
- Do NOT include English.
- Do NOT answer the questions.

QUESTION RULES:
- Generate 4–6 questions total.
- Mix comprehension and grammar-focused questions.
- All questions must be answerable using the story alone.
- Avoid yes/no-only questions.

LEVEL CONTROL:
- Student level is provided.
- Beginner: very simple questions, present tense.
- Intermediate: include warum / weil / dass questions, Perfekt allowed.
- Advanced: include inference, opinions, or grammar nuance.

GRAMMAR QUESTIONS:
- Ask about grammar that actually appears in the story.
- Refer indirectly to sentence structure or verb forms.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "questions": ["...", "..."]
}

No markdown. No extra text.
"""
            ),
        },
        {
            "role": "user",
            "content": state["story"],
        },
    ])

    return {"questions": reply.questions}
