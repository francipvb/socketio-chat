import pathlib

import fastapi
import socketio
from fastapi.exception_handlers import http_exception_handler
from fastapi.staticfiles import StaticFiles

from .socket import server

root_dir = pathlib.Path(__file__).parent.parent


def get_app():
    _app = fastapi.FastAPI()
    static = StaticFiles(check_dir=False, directory=root_dir / "client-app" / "dist")

    @_app.exception_handler(404)
    async def fallback_request(request: fastapi.Request, exc: fastapi.HTTPException):
        return await static.get_response("index.html", request.scope)

    _app.mount("/", static)

    @_app.get("/hello")
    def hello():
        return {"detail": "Hello"}

    return socketio.ASGIApp(server, _app)
