"""Vercel entry point for the FastAPI backend.

Vercel exposes this function under /api/* and FastAPI handles the remaining
route path internally.
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from server import app  # noqa: E402
