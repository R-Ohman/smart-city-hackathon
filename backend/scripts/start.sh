#!/bin/bash


if [ -z ${DEV+x} ]
then
    fastapi prod app/app.py --host 0.0.0.0 --port 80
else
    fastapi dev app/app.py --host 0.0.0.0 --port 80
fi
