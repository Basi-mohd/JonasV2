from pydantic import BaseModel
from app.llm.ollama import llm

class Grammar(BaseModel):
    main_grammar_rules: str

def explain(state):
    story = state["story"]

    messages = [
        {
            "role": "system",
            "content": """You are a German grammar tutor for English-speaking learners.

TASK:
explain German Grammar from the given Story to a English speaker 
ONLY FROM THE GIVEN STORY IN ENGLISH
"""
        },
        {
            "role": "user",
            "content": f"German story:\n{story}"
        }
    ]

    grammar_gen = llm.with_structured_output(Grammar)
    response = grammar_gen.invoke(messages)

    return {
        "grammar": response.main_grammar_rules
    }
