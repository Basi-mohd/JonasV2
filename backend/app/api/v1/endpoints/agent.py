from app.core.agents import run
from fastapi import APIRouter

router = APIRouter()

@router.get('/agent')
async def runagent(inp):

    run(inp)