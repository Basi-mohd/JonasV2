from pydantic import BaseModel
from app.llm.ollama import llm 

class Explanation(BaseModel):
    translation: str 
    grammar_notes: str 

def explain_story(state):
    story = state['story']
    level = state['student_level']
    
    grammar_focus = {
    "beginner": (
        "Only explain grammar that explicitly appears in the story. "
        "Focus on core concepts such as word order, basic verb conjugation, "
        "articles (der/die/das), and simple sentence structure. "
        "Avoid linguistic terminology unless necessary."
    ),
    "intermediate": (
        "Explain grammar patterns that appear in the story, such as "
        "verb position, separable verbs, cases, prepositions, and "
        "sentence connectors. Use correct linguistic terms, but keep explanations concise."
    ),
    "advanced": (
        "Analyze nuanced or advanced grammar that appears in the story, "
        "such as subordinate clauses, modal particles, tense nuance, "
        "case governance, or stylistic choices. Do not explain basic grammar."
    )
}

    
    explanation_prompt = [
        {
            'role': 'system',
            'content': f'You are a German tutor explaining a story to an English speaker at {level} level. '
                      f'Provide: 1) Full English translation 2) Grammar explanations. In English '
                      f'{grammar_focus[level]} '
                      f'Return as JSON with "translation" and "grammar_notes" fields.'
        },
        {
            'role': 'user',
            'content': f'German Story:\n{story}\n\nExplain this story with translation and grammar notes:'
        }
    ]
    
    explanation_gen = llm.with_structured_output(Explanation)
    response = explanation_gen.invoke(explanation_prompt)
    
    
    return {
        "explanation": {
            "translation": response.translation,
            "grammar_notes": response.grammar_notes
        }
    }