from __future__ import annotations

import re
from functools import lru_cache
from typing import Iterable, List, Sequence
from uuid import uuid4

from sentence_transformers import SentenceTransformer, util

from app.models import AdaptationResult, CandidateProfile, HighlightSpan, JobOffer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


def rank_skills(skills: Sequence[str], keywords: Sequence[str]) -> List[str]:
    if not skills:
        return []
    if not keywords:
        return list(skills)
    model = get_model()
    skill_embeddings = model.encode(skills, convert_to_tensor=True)
    keyword_embeddings = model.encode(list(keywords), convert_to_tensor=True)
    scores = util.cos_sim(skill_embeddings, keyword_embeddings).max(dim=1).values
    paired = sorted(zip(skills, scores.tolist()), key=lambda item: item[1], reverse=True)
    return [skill for skill, _ in paired]


def build_resume(profile: CandidateProfile, keywords: Sequence[str]) -> tuple[str, List[HighlightSpan]]:
    ranked_skills = rank_skills(profile.skills, keywords)
    lines: List[str] = [profile.full_name, ""]
    if profile.summary:
        lines.extend([profile.summary, ""])

    lines.append("Compétences clés : " + ", ".join(ranked_skills[:10]))
    lines.append("")
    lines.append("Expériences professionnelles :")

    for experience in profile.experiences[:6]:
        header = f"- {experience.role} chez {experience.company} ({experience.start_date} - {experience.end_date or 'Présent'})"
        lines.append(header)
        for achievement in experience.achievements[:4]:
            lines.append(f"  • {achievement}")
        if experience.technologies:
            lines.append(f"    Technologies : {', '.join(experience.technologies[:6])}")
        lines.append("")

    if profile.education:
        lines.append("Formation :")
        for edu in profile.education[:4]:
            lines.append(f"- {edu.degree} - {edu.school} ({edu.start_date} - {edu.end_date or 'Présent'})")

    if profile.languages:
        lines.append("")
        lines.append("Langues : " + ", ".join(f"{lang.label} ({lang.level})" for lang in profile.languages))

    text = "\n".join(lines).strip()
    highlights = build_highlights(text, keywords)
    return text, highlights


def build_cover_letter(profile: CandidateProfile, offer: JobOffer, keywords: Sequence[str]) -> str:
    intro = f"Madame, Monsieur,\n\nJe vous propose ma candidature au poste {offer.title}."
    strengths = ", ".join(keywords[:5]) if keywords else ", ".join(profile.skills[:5])
    body = (
        "Fort d'expériences significatives, je maîtrise "
        f"{strengths}. J'ai conduit des projets en autonomie tout en collaborant étroitement avec les équipes métiers."
    )
    achievements = []
    for experience in profile.experiences[:2]:
        if experience.achievements:
            achievements.append(experience.achievements[0])
    if achievements:
        body += "\n\nAmong mes réalisations clés : " + "; ".join(achievements)

    closing = (
        "\n\nJe suis disponible rapidement pour un entretien afin d'échanger sur votre besoin.\n\n"
        "Cordialement,\n"
        f"{profile.full_name}"
    )

    return "\n".join([intro, body, closing]).strip()


def build_highlights(text: str, keywords: Sequence[str]) -> List[HighlightSpan]:
    spans: List[HighlightSpan] = []
    for keyword in keywords:
        if not keyword:
            continue
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        for match in pattern.finditer(text):
            spans.append(
                HighlightSpan(
                    id=str(uuid4()),
                    type="emphasis",
                    start=match.start(),
                    end=match.end(),
                )
            )
    return spans


def adapt_documents(profile: CandidateProfile, offer: JobOffer) -> AdaptationResult:
    keywords = offer.keywords or []
    resume_text, highlights = build_resume(profile, keywords)
    cover_letter = build_cover_letter(profile, offer, keywords)

    return AdaptationResult(
        adapted_resume=resume_text,
        adapted_cover_letter=cover_letter,
        highlights=highlights,
    )
