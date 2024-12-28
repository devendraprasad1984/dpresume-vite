#https://hub.docker.com/_/python
#run project steps
# docker build .
# docker-compose build
# docker-compose up -d --no-deps --build <service_name>
# docker-compose run --rm app sh -c "django-admin.py startproject app ."
# docker-compose run --rm app sh -c "python manage.py startapp core"
# docker-compose run --rm app sh -c "python manage.py startapp user"
# docker-compose run --rm app sh -c "python manage.py startapp dummy"
# docker-compose run --rm  app sh -c "python manage.py startapp bank_manager"
# docker-compose run --rm  app sh -c "python manage.py startapp customer_manager"
# docker-compose run --rm  app sh -c "python manage.py startapp loan_manager"
# docker-compose run --rm  app sh -c "python manage.py createsuperuser"
# docker-compose run --rm  app sh -c "python manage.py collectstatic"
# docker-compose run --rm  app sh -c "python manage.py makemigrations"
# docker-compose run --rm  app sh -c "python manage.py makemigrations core"
# docker-compose run --rm  app sh -c "python manage.py migrate --run-syncdb"
# docker-compose run app sh -c "python manage.py runserver 0.0.0.0:80"
# docker-compose run --rm app sh -c "python manage.py test"
# docker-compose run --rm app sh -c "python manage.py test && flake8"
# docker-compose up
# docker-compose logs

FROM python:3.7-alpine
MAINTAINER DEVENDRAPRASAD1984@gmail.com

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt

RUN apk add --update --no-cache postgresql-client jpeg-dev
RUN apk add --update --no-cache --virtual .tmp_build_deps gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev
RUN pip install -r /requirements.txt
RUN apk del .tmp_build_deps

RUN mkdir /app
WORKDIR /app
COPY ./ /app

#create user for running app in docker
RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser -D user
RUN chown -R user:user /vol/
RUN chmod -R 755 /vol/web
USER user



