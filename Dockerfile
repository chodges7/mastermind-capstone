FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN pip install --upgrade pip
WORKDIR /code
COPY ./mastermind_django_files/requirements.txt .
RUN pip install -r requirements.txt
COPY . /code/
