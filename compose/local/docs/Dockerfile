FROM python:3.11.3-slim-bullseye

ENV PATH="/root/.local/bin:${PATH}" \
    POETRY_VIRTUALENVS_CREATE=false \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install --no-install-recommends -y \
  curl libpq-dev build-essential make gettext \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

ARG POETRY_VERSION
ENV POETRY_VERSION="${POETRY_VERSION:-1.1.14}"
RUN curl -sSL https://install.python-poetry.org \
  | python - --version "${POETRY_VERSION}" \
  && poetry --version

COPY poetry.lock pyproject.toml .
RUN poetry install

COPY ./compose/local/docs/start /start-docs
RUN sed -i 's/\r$//g' /start-docs
RUN chmod +x /start-docs

WORKDIR /docs
