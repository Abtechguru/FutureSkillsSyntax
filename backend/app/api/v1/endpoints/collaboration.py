from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Dict, List, Set, Any
import json
import logging

from app.core.database import get_db
from app.models.mentorship import MentorshipSession, CollaborativeSession
from app.core.security import get_current_user_from_token

router = APIRouter()
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Maps session_id -> set of active WebSockets
        self.active_connections: Dict[int, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: int):
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = set()
        self.active_connections[session_id].add(websocket)

    def disconnect(self, websocket: WebSocket, session_id: int):
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def broadcast(self, message: str, session_id: int, exclude: WebSocket = None):
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id]:
                if connection != exclude:
                    await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/{session_id}/ws")
async def collaboration_ws(
    websocket: WebSocket,
    session_id: int,
    token: str,
    db: AsyncSession = Depends(get_db)
):
    """
    WebSocket for real-time code collaboration and monitoring.
    Expects format:
    {
        "type": "code_update" | "language_update" | "classroom_link",
        "data": { ... }
    }
    """
    try:
        # Authenticate user from token (passed as query param or in message)
        user = await get_current_user_from_token(token, db)
    except Exception as e:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Verify session exists and user is part of it
    result = await db.execute(
        select(MentorshipSession).where(
            and_(
                MentorshipSession.id == session_id,
                (MentorshipSession.mentor_id == user.id) | (MentorshipSession.mentee_id == user.id)
            )
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket, session_id)
    
    # Get or create collaborative state
    collab_result = await db.execute(
        select(CollaborativeSession).where(CollaborativeSession.session_id == session_id)
    )
    collab = collab_result.scalar_one_or_none()
    if not collab:
        collab = CollaborativeSession(session_id=session_id)
        db.add(collab)
        await db.commit()
    
    # Send current state to newly joined user
    await websocket.send_text(json.dumps({
        "type": "init",
        "data": {
            "code": collab.current_code,
            "language": collab.language,
            "classroom_link": session.classroom_link
        }
    }))

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            msg_type = message.get("type")
            msg_data = message.get("data", {})

            if msg_type == "code_update":
                new_code = msg_data.get("code")
                collab.current_code = new_code
                await db.commit()
                # Broadcast to others
                await manager.broadcast(
                    json.dumps({"type": "code_update", "data": {"code": new_code, "user_id": user.id}}),
                    session_id,
                    exclude=websocket
                )

            elif msg_type == "language_update":
                new_lang = msg_data.get("language")
                collab.language = new_lang
                await db.commit()
                await manager.broadcast(
                    json.dumps({"type": "language_update", "data": {"language": new_lang}}),
                    session_id,
                    exclude=websocket
                )

            elif msg_type == "classroom_link" and user.role == "mentor":
                # Only mentor can update classroom link
                link = msg_data.get("link")
                session.classroom_link = link
                await db.commit()
                await manager.broadcast(
                    json.dumps({"type": "classroom_link", "data": {"link": link}}),
                    session_id
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket, session_id)
    except Exception as e:
        logger.error(f"Collaboration WebSocket error: {e}")
        manager.disconnect(websocket, session_id)
