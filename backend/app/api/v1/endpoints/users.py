from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.user import UserResponse, UserLevelUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
):
    return current_user


@router.patch("/me/level", response_model=UserResponse)
async def update_user_level(
    level_data: UserLevelUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    current_user.level = level_data.level
    await db.commit()
    await db.refresh(current_user)
    return current_user

