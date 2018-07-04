#!/bin/bash
#For development convenience
#This script is made for macOS, may work on other *nix systems
cd "$(dirname "$0")"
#pip3 install -r ./requirements.txt
#source ./venv/bin/activate
export FLASK_APP=run.py
flask run --host=192.168.1.194
