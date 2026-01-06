from pydantic import BaseModel
from typing import Literal
from app.llm.ollama import llm 

class StoryOutput(BaseModel):
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    story: str

def generate_story(state):
    last_message = state['messages'][-1]
    story_gen = llm.with_structured_output(StoryOutput)
    
    result = story_gen.invoke([
        {
            'role': 'system',
            'content': 'you are German Tutor for English speakers. Your job is to make stories based on the users level of German. '
                      'The aim of the story is to teach them German. '
                      'For beginner: use simple German like everyday German. Write 8-10 sentences to give enough context. '
                      'For intermediate: make the stories based on users topic. Write 6-8 sentences. '
                      'For advanced: make the story more complex. Write 5-7 sentences.'
        },
        {
            'role': 'user',
            'content': last_message.content
        }
    ])
    
    
    return {
        "topic": result.topic,
        "story": result.story,
        'student_level': result.student_level
    }