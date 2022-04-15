from typing import Any, Dict

import orjson
import socketio

from . import models

server = socketio.AsyncServer(
    async_mode="asgi",
    logger=True,
)


users: Dict[str, models.User] = {}


@server.event
async def connect(sid, environ: Dict[str, Any]):
    async with server.session(sid) as session:
        user = models.User(id=sid, **session)
        users[sid] = user
        for user in users.values():
            await server.emit("login", orjson.loads(user.json()))


@server.event
async def disconnect(sid):
    user = users[sid]
    del users[sid]
    await server.emit("logout", user.id)


@server.event
async def message(sid: str, msg: str):
    message = models.Message(message=msg, sender=sid)
    await server.emit("message", orjson.loads(message.json()))


@server.on("setName")
async def set_name(sid: str, name: str):
    print({"name": name, "sid": sid})
    user = users[sid]
    user = user.copy(update={"name": name})
    users[sid] = user
    await server.emit("update", orjson.loads(user.json()))
