from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, agent,lesson

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(lesson.router)


