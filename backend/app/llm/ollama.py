from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="Jonas:latest",
    temperature=0,
    num_predict=3000
)
