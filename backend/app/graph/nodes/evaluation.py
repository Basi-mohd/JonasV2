from app.llm.ollama import llm

def evaluate_answers(state):
    feedback = []

    for question, answer in zip(state["questions"], state["student_answers"]):
        result = llm.invoke([
            {
                "role": "system",
                "content": (
                    "You are a friendly German tutor. "
                    "Evaluate the student's answer based on the story. "
                    "Be brief and encouraging (2–3 sentences)."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Story:\n{state['story']}\n\n"
                    f"Question: {question}\n"
                    f"Student answer: {answer}"
                ),
            },
        ])
        feedback.append(result.content)

    return {"feedback": feedback}
