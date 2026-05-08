FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Runtime stage ───────────────────────────────────────────────────────────
FROM python:3.12-slim

# Non-root user
RUN groupadd -r scscs && useradd -r -g scscs -d /app -s /sbin/nologin scscs

WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .

# Fix ownership
RUN chown -R scscs:scscs /app

USER scscs

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/docs')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
