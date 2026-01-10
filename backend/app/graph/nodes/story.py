from pydantic import BaseModel
from typing import Literal
from app.llm.ollama import llm 

class StoryOutput(BaseModel):
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    story: str

def generate_story(state):
    last_message = state["messages"][-1]
    story_gen = llm.with_structured_output(StoryOutput)

    result = story_gen.invoke([
        {
            "role": "system",
            "content": (
                """You are a professional German tutor for English-speaking learners.

TASK:
Generate a LONG German story that helps the student learn German naturally through context.
You must infer the student’s German level from the user message and generate the story accordingly.

LANGUAGE RULES:
- Write the story in German ONLY.
- Do NOT include English words, translations, explanations, or comments.
- Use natural, correct German.

LEVEL DETECTION:
- Choose EXACTLY one level: beginner, intermediate, advanced.

STORY LENGTH REQUIREMENTS (MANDATORY):
- The story MUST be long and detailed.
- Minimum length rules:
  - Beginner: at least 6 paragraphs, each with 3–4 sentences
  - Intermediate: at least 8 paragraphs, each with 4–5 sentences
  - Advanced: at least 10 paragraphs, each with 5–6 sentences
- Do NOT summarize.
- Do NOT rush the ending.
- If the story is short, compressed, or underdeveloped, the output is INVALID.

STORY STRUCTURE (MANDATORY):
1. Introduction of setting and main character(s)
2. Description of daily life or normal situation
3. A small change, challenge, or event
4. Reactions, thoughts, or emotions
5. Development and consequences
6. Resolution or reflection at the end

LEVEL-SPECIFIC RULES:

Beginner:
- A1-level German only.
- Very simple sentence structures.
- Present tense only.
- Everyday vocabulary.
- No subordinate clauses except very basic ones.

Intermediate:
- A2–B1-level German.
- Use subordinate clauses (weil, dass, wenn).
- Perfekt tense allowed.
- Clear, concrete storyline.

Advanced:
- B2–C1-level German.
- Complex sentence structures and varied tenses.
- Richer vocabulary and stylistic nuance.
- Abstract ideas or reflections allowed.

TOPIC RULES:
- Extract or infer a clear topic from the user message.
- If no topic is given, choose a realistic everyday topic.
- The topic must clearly match the story content.

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "student_level": "beginner | intermediate | advanced",
  "topic": "short topic description",
  "story": "German story text"
}

No markdown.
No extra text.
No explanations.

"""
            ),
        },
        {
            "role": "user",
            "content": last_message.content,
        }
    ])

    return {
        "topic": result.topic,
        "story": result.story,
        "student_level": result.student_level,
    }
