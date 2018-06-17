#!/bin/bash
#For development convenience
#This script is made for macOS, may work on other *nix systems
cd "$(dirname "$0")"
source venv/bin/activate
export FLASK_APP=run.py
flask run
