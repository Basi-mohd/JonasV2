from pydantic import BaseModel
from app.llm.ollama import llm 
class Translation(BaseModel):
    imp_word_translation : str 

def translate_story(state):
    story = state['story']
    prompt = [
    {
        "role": "system",
        "content": (
            "Translate and explain the words in the given story German to English."
            "the story is in German. You need to provide English Translation of German words"
        )
    },
    {
        "role": "user",
        "content": story
    }
]
    
    explanation_gen = llm.with_structured_output(Translation)
    response = explanation_gen.invoke(prompt)

    return {
    "translation": response.imp_word_translation
}

    