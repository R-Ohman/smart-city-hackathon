FROM python:3.11

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/

RUN chmod +x /code/scripts/start.sh

CMD ["/code/scripts/start.sh"]
