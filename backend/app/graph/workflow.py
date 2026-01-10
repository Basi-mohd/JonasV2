from langgraph.graph import StateGraph, START, END
from app.graph.state import State
from app.graph.nodes.story import generate_story
from app.graph.nodes.questions import generate_questions
from app.graph.nodes.explanation import explain
from app.graph.nodes.evaluation import evaluate_answers
from app.graph.nodes.translation import translate_story

def build_workflow():
    workflow = StateGraph(State)

    workflow.add_node("story", generate_story)
    workflow.add_node("questions", generate_questions)
    workflow.add_node("explanation", explain)
    workflow.add_node("evaluation", evaluate_answers)
    workflow.add_node("translation", translate_story)


    workflow.add_edge(START, "story")
    workflow.add_edge("story", "translation")
    workflow.add_edge("story", "explanation")
    workflow.add_edge("explanation", "questions")
    workflow.add_edge("questions", "evaluation")
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
        "grammar" : ""
    }
