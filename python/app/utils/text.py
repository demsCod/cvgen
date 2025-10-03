from __future__ import annotations

import re
from typing import Iterable, List

MULTISPACE = re.compile(r"\s+")
EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_REGEX = re.compile(r"(?:\+\d{1,3}[\s.-]?)?(?:\(\d{2,3}\)[\s.-]?|\d{2,3}[\s.-]?)?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}(?:[\s.-]?\d{2})?")


def sanitize_line(line: str) -> str:
    cleaned = line.strip()
    cleaned = MULTISPACE.sub(" ", cleaned)
    return cleaned


def extract_email(text: str) -> str | None:
    match = EMAIL_REGEX.search(text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    match = PHONE_REGEX.search(text)
    return match.group(0) if match else None


def window(iterable: Iterable[str], size: int) -> List[str]:
    items = list(iterable)
    return [" ".join(items[i : i + size]) for i in range(0, len(items), size)]
