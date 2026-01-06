from typing import Annotated, Literal, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama
from pydantic import BaseModel
from typing_extensions import TypedDict 
from langchain_core.messages import SystemMessage, HumanMessage

llm = ChatOllama(
    model="qwen2:1.5b",
    temperature=0,
)

class StoryOutput(BaseModel):
    student_level: Literal["beginner", "intermediate", "advanced"]
    topic: str
    story: str

class Questionoutput(BaseModel):
    questions: List[str]

class Explanation(BaseModel):
    translation: str 
    grammar_notes: str 

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
    explanation: dict

def generate_story(state: State):
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
    
    # Display the generated story
    print("\n" + "="*70)
    print("GENERATED STORY")
    print("="*70)
    print(result.story)
    print("="*70 + "\n")
    
    return {
        "topic": result.topic,
        "story": result.story,
        'student_level': result.student_level
    }

def question_generator(state: State):
    story = state['story']
    level = state['student_level']
    question_gen = llm.with_structured_output(Questionoutput)
    messages = [
        {
            'role': 'system',
            'content': f'You are a German Tutor. Your job is to make questions based on the stories. '
                      f'Make the questions appropriate for {level} level learners. '
                      f'Include grammar questions also.'
        },
        {
            'role': 'user',
            'content': f'Student level: {level}\n\nStory:\n{story}\n\nGenerate questions:'
        }
    ]
    
    reply = question_gen.invoke(messages)
    return {"questions": reply.questions}

def teacher_explains(state: State):
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
    
    # Display to student
    print("\n" + "="*70)
    print("TRANSLATION")
    print("="*70)
    print(response.translation)
    print("\n" + "="*70)
    print("GRAMMAR NOTES")
    print("="*70)
    print(response.grammar_notes)
    print("="*70 + "\n")
    
    return {
        "explanation": {
            "translation": response.translation,
            "grammar_notes": response.grammar_notes
        }
    }

def teacher(state: State):
    questions = state['questions']
    story = state['story']
    level = state['student_level']
    student_answers = []
    feedback_list = []
    
    
    for i, question in enumerate(questions):
        print(f'Question {i+1}/{len(questions)}: {question}')
        answer = input("Your answer: ").strip()
        student_answers.append(answer)
        
        feedback = evaluate_answer(question, answer, story, level)
        feedback_list.append(feedback)
        
    
    return {
        "student_answers": student_answers,
        "feedback": feedback_list
    }

def evaluate_answer(question: str, student_answer: str, story: str, level: str):
    eval_prompt = [
        {
            'role': 'system',
            'content': f'You are a friendly German tutor. Evaluate if the student answered correctly based on the story. '
                      f'Be encouraging and helpful. If wrong, gently explain the question and correct answer in English. '
                      f'Keep feedback brief (2-3 sentences). Student is at {level} level. '
                      f'Explain everything in English.'
        },
        {
            'role': 'user',
            'content': f'Story:\n{story}\n\n'
                      f'Question: {question}\n'
                      f'Student answered: "{student_answer}"\n\n'
                      f'Evaluate and give encouraging feedback:'
        }
    ]
    result = llm.invoke(eval_prompt)
    return result.content

def create_initial_state(user_input: str):
    """Helper function to create fresh state for each lesson"""
    return {
        "messages": [
            {'role': 'user', 'content': user_input}
        ],
        "student_level": "",  
        "topic": "",
        "story": "",
        "questions": [],
        "explanation": {},
        'student_answers': [],
        "feedback": []
    }

# Build workflow
workflow = StateGraph(State)
workflow.add_node('generate_story', generate_story)
workflow.add_node('generate_questions', question_generator)
workflow.add_node('teacher_explains', teacher_explains)
workflow.add_node('teacher', teacher)

workflow.add_edge(START, "generate_story")
workflow.add_edge("generate_story", "generate_questions")
workflow.add_edge('generate_questions', 'teacher_explains')
workflow.add_edge('teacher_explains', 'teacher')
workflow.add_edge("teacher", END)

app = workflow.compile()

# Main chat loop
def run(inp):
    print("="*70)
    print("WELCOME TO GERMAN LANGUAGE TUTOR")
    print("="*70)
    print("\nHow to use:")
    print("- Tell me your level (beginner/intermediate/advanced)")
    print("- Tell me what topic you want to learn about")
    print("- Example: 'I am beginner, give me a story about Dogs'\n")
    print("="*70 + "\n")
    
    while True:
        # Get user input
        user_input = inp
        
        if user_input.lower() in ['quit', 'exit', 'q']:
            print("\n" + "="*70)
            print("Thank you for learning German with me!")
            print("Keep practicing and you'll improve!")
            print("="*70)
            break
        
        if not user_input:
            print("Please enter a topic and level.\n")
            continue
        
        # Create fresh state for this lesson
        initial_state = create_initial_state(user_input)
        
        # Run the workflow
        print("\nStarting your lesson...")
        print("="*70 + "\n")
        
        try:
            result = app.invoke(initial_state)
            
            # Show summary
            print("\n" + "="*70)
            print("LESSON SUMMARY")
            print("="*70)
            print(f"Topic: {result['topic']}")
            print(f"Level: {result['student_level']}")
            print(f"Questions asked: {len(result['questions'])}")
            print(f"Your answers: {result['student_answers']}")
            print("="*70 + "\n")
            
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            print("Please try again with a different request.\n")
            continue
        
        # Ask if they want to continue
        print("\n" + "="*70)
        continue_choice = input("Would you like another lesson? (yes/no): ").strip().lower()
        
        if continue_choice not in ['yes', 'y']:
            print("\n" + "="*70)
            print("Thank you for learning German with me!")
            print("Keep practicing and you'll improve!")
            print("="*70)
            break
        
        print("\n" + "="*70)
        print("Great! Let's start a new lesson.")
        print("="*70 + "\n")

