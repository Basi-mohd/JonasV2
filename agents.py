from typing import Annotated, Literal, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field
from typing_extensions import TypedDict 
from langchain_core.messages import SystemMessage, HumanMessage
llm = ChatOllama(
    model="cas/discolm-mfto-german",
    temperature=0,
)

class StoryOutput(BaseModel):
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    story: str

class State(TypedDict):
    messages: Annotated[list,add_messages]
    message_type: str  | None
    next : str | None
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic : str 
    story : str 
    questions: List[dict]
    current_question_idx: int  
    student_answers: List[str]  
    teaching_conversation: List[dict]  
    hints_used: int

def generate_story(state:State):

    last_message = state['messages'][-1]
    story_gen = llm.with_structured_output(StoryOutput)
    result = story_gen.invoke([
        {'role':'system','content':'you are German Tutor for English speakers,Your job is to make stories based on the users level of German. The aim of the story is to '
        'team them German. if the user is beginner use simple German like every day German.if the user is intermediate make the stories based on users topic.if the user'
        'is advanced make the story more hard.'}
        , {'role':'user','content':last_message.content}
    ])
    return {"topic": result.topic,"story":result.story,'student_level': result.student_level}

def question_generator(state:State):
    story = state['story']
    level = state['student_level']
    messages = [
        {
            'role': 'system',
            'content': f'You are a German Tutor. Your job is to make questions based on the stories. '
                      f'Make the questions appropriate for {level} level learners.'
                      'include Grammar questions also'  
        },
        {
            'role': 'user',
            'content': f'Student level: {level}\n\nStory:\n{story}\n\nGenerate questions:'
        }
    ]


    reply = llm.invoke(messages)
    return {"questions": reply.content}







workflow = StateGraph(State)
workflow.add_node('generate story',generate_story)
workflow.add_node('generate questions',question_generator)

workflow.add_edge(START, "generate story")
workflow.add_edge("generate story", "generate questions")
workflow.add_edge("generate questions", END)

app = workflow.compile()
initial_state = {
    "messages": [
        {'role': 'user', 'content': 'I am beginner, give me a story about Dogs'}
    ],
    "student_level": "",  
    "topic": "",
    "story": "",
    "questions": ""
}

result = app.invoke(initial_state)

print("Story:", result['story'])
print("Questions:", result['questions'])