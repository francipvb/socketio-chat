FROM node:17 AS client

RUN npm install -g pnpm

WORKDIR /app

COPY client-app/package.json client-app/pnpm-lock.yaml ./
RUN pnpm install
COPY client-app/ ./
RUN pnpm build

FROM python:3.10 AS dependencies

RUN pip install --no-cache-dir --upgrade pip poetry==1.1.13 && \
    poetry config virtualenvs.in-project true

WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --no-dev

FROM python:3.10-slim
WORKDIR /app
COPY --from=client /app/dist ./client-app/dist
COPY --from=dependencies /app/.venv ./.venv
COPY . .
ENV PATH="/app/.venv/bin:${PATH}" PYTHONPATH="/app:${PYTHONPATH}"
CMD uvicorn --host=0.0.0.0 --port=${PORT-8000} --factory socketio_chat.main:get_app
