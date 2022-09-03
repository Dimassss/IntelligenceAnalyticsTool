#!/bin/sh

find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete

sudo -iu postgres dropdb -f intelligence_analytic_tool
sudo -iu postgres createdb intelligence_analytic_tool

python3 manage.py makemigrations
python manage.py migrate
