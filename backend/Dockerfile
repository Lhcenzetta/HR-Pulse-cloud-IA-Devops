FROM python:3.13-slim

RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    unixodbc-dev \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1


COPY backend/pyproject.toml backend/uv.lock ./


RUN uv sync --no-dev


COPY backend/app/ ./app/
COPY backend/data/ ./data/
COPY ml/model/ ./ml/model/


ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1


EXPOSE 8000

WORKDIR /app/app

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
