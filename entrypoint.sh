#!/bin/bash

python3 mastermind_django_files/manage.py migrate
python3 mastermind_django_files/manage.py runserver 0.0.0.0:80