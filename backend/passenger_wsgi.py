"""
Passenger WSGI file for cPanel deployment
Place this in your app root directory
"""
import sys
import os

# Add your project directory to the sys.path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Activate virtual environment
INTERP = os.path.join(project_home, 'venv', 'bin', 'python')
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Import FastAPI app
from server import app

# Expose as 'application' for WSGI
application = app
