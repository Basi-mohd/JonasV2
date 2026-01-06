from langgraph.graph import StateGraph, START, END
from app.graph.state import State
from app.graph.nodes.story import generate_story
from app.graph.nodes.questions import generate_questions
from app.graph.nodes.explanation import explain_story
from app.graph.nodes.evaluation import evaluate_answers

def build_workflow():
    workflow = StateGraph(State)

    workflow.add_node("story", generate_story)
    workflow.add_node("questions", generate_questions)
    workflow.add_node("explanation", explain_story)
    workflow.add_node("evaluation", evaluate_answers)

    workflow.add_edge(START, "story")
    workflow.add_edge("story", "questions")
    workflow.add_edge("questions", "explanation")
    workflow.add_edge("explanation", "evaluation")
    workflow.add_edge("evaluation", END)

    return workflow.compile()

def create_initial_state(user_input: str):
    return {
        "messages": [{"role": "user", "content": user_input}],
        "student_level": "",
        "topic": "",
        "story": "",
        "questions": [],
        "student_answers": [],
        "feedback": [],
        "explanation": {},
    }
