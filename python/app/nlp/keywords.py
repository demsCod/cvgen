from __future__ import annotations

import re
from typing import List

from rapidfuzz import process
from sklearn.feature_extraction.text import TfidfVectorizer

COMMON_LOCATIONS = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Lille",
    "Bordeaux",
    "Nantes",
    "Rennes",
    "Grenoble",
    "Montréal",
    "Genève",
    "Remote",
]

STOP_WORDS = [
    "avec",
    "pour",
    "vous",
    "nous",
    "les",
    "des",
    "une",
    "dans",
    "plus",
    "team",
    "vous",
    "mission",
]


def extract_keywords(text: str, top_k: int = 15) -> List[str]:
    if not text.strip():
        return []
    vectorizer = TfidfVectorizer(stop_words=STOP_WORDS, max_features=64, ngram_range=(1, 2))
    matrix = vectorizer.fit_transform([text])
    scores = matrix.toarray()[0]
    pairs = sorted(
        zip(vectorizer.get_feature_names_out(), scores),
        key=lambda item: item[1],
        reverse=True,
    )
    keywords = [word for word, score in pairs if score > 0][:top_k]
    return keywords


def infer_location(text: str) -> str | None:
    mention = process.extractOne(text, COMMON_LOCATIONS)
    if mention and mention[1] > 70:
        return mention[0]
    match = re.search(r"(?:à|based in|location)\s+([A-ZÀ-Ü][\w-]+)", text, flags=re.IGNORECASE)
    if match:
        return match.group(1)
    return None
