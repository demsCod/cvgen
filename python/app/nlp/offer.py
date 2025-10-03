from __future__ import annotations

from typing import List

from app.models import JobOffer
from app.nlp.keywords import extract_keywords, infer_location


def enrich_offer(offer: JobOffer) -> JobOffer:
    keywords = extract_keywords(offer.description)
    location = offer.location or infer_location(offer.description)
    company = offer.company or infer_company_name(offer.description)
    return JobOffer(
        id=offer.id,
        title=offer.title or "Poste",
        company=company,
        description=offer.description,
        location=location,
        keywords=keywords,
    )


def infer_company_name(text: str) -> str | None:
    markers = ["chez", "au sein de", "for", "pour"]
    tokens = text.split()
    for index, token in enumerate(tokens):
        lowered = token.lower()
        if lowered in markers and index + 1 < len(tokens):
            return tokens[index + 1].strip(",.;")
    return None
