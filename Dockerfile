FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements-prod.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements-prod.txt

COPY agents ./agents
COPY backend ./backend
COPY config ./config
COPY database ./database
COPY evaluation ./evaluation
COPY ingestion ./ingestion
COPY memory ./memory
COPY prompts ./prompts
COPY retrieval ./retrieval
COPY utils ./utils

RUN mkdir -p /app/data/chroma_db \
    /app/data/uploads

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]