import sys
import os

# Add backend to sys.path so "app" is discoverable
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import Base
