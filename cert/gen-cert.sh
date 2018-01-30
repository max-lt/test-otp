#!/usr/bin/env bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt

openssl x509 -outform PEM -in nginx.crt -out nginx.pem