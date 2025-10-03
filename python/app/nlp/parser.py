from __future__ import annotations

import re
from typing import List

from app.models import CandidateProfile, Education, Experience, LanguageLevel, Project
from app.utils.text import extract_email, extract_phone, sanitize_line

YEAR_RANGE = re.compile(r"(?P<start>\d{4})\s*(?:[-–—]|à|to)\s*(?P<end>(?:\d{4}|présent|present|ongoing))?", re.IGNORECASE)
SKILL_SECTION = re.compile(r"compétence|skills", re.IGNORECASE)
EDU_SECTION = re.compile(r"formation|education", re.IGNORECASE)
LANG_SECTION = re.compile(r"langue|languages", re.IGNORECASE)
PROJECT_SECTION = re.compile(r"projets?|projects?", re.IGNORECASE)
BULLET = re.compile(r"^[\-•·]")


def extract_sections(lines: List[str]) -> dict[str, List[str]]:
    sections: dict[str, List[str]] = {
        "skills": [],
        "education": [],
        "languages": [],
        "projects": [],
    }
    current: str | None = None

    for line in lines:
        if SKILL_SECTION.search(line):
            current = "skills"
            continue
        if EDU_SECTION.search(line):
            current = "education"
            continue
        if LANG_SECTION.search(line):
            current = "languages"
            continue
        if PROJECT_SECTION.search(line):
            current = "projects"
            continue

        if current:
            if not line.strip():
                current = None
                continue
            sections[current].append(line)

    return sections


def parse_skills(raw: List[str]) -> List[str]:
    items: List[str] = []
    for line in raw:
        line = line.strip().strip("-•·")
        items.extend(part.strip() for part in re.split(r",|/|;", line) if part.strip())
    unique = list(dict.fromkeys(items))
    return unique[:25]


def parse_languages(raw: List[str]) -> List[LanguageLevel]:
    languages: List[LanguageLevel] = []
    for line in raw:
        parts = re.split(r":|-", line)
        if len(parts) == 2:
            label, level = parts
        else:
            label, level = line, "Intermédiaire"
        languages.append(LanguageLevel(label=label.strip(), level=level.strip()))
    return languages


def parse_education(raw: List[str]) -> List[Education]:
    entries: List[Education] = []
    for line in raw:
        match = YEAR_RANGE.search(line)
        if match:
            start = match.group("start")
            end = match.group("end") or "En cours"
            description = YEAR_RANGE.sub("", line).strip(" -•·")
            if ":" in description:
                school, degree = [part.strip() for part in description.split(":", 1)]
            else:
                parts = description.split(" - ")
                if len(parts) >= 2:
                    school, degree = parts[0], parts[1]
                else:
                    school, degree = description, "Programme"
            entries.append(Education(school=school, degree=degree, start_date=start, end_date=end))
        else:
            entries.append(Education(school=line, degree="Formation", start_date="N/A"))
    return entries[:6]


def parse_projects(raw: List[str]) -> List[Project]:
    projects: List[Project] = []
    for line in raw:
        clean = line.strip(" -•·")
        if not clean:
            continue
        if "-" in clean:
            name, desc = clean.split("-", 1)
        else:
            name, desc = clean, "Projet personnel"
        projects.append(Project(name=name.strip(), description=desc.strip()))
    return projects[:6]


def parse_experiences(lines: List[str]) -> List[Experience]:
    experiences: List[Experience] = []
    buffer: List[str] = []
    current_dates: tuple[str, str | None] | None = None

    def flush():
        nonlocal buffer, current_dates
        if not buffer:
            return
        header = buffer[0]
        company = header
        role = "Professionnel"
        achievements: List[str] = []
        technologies: List[str] = []

        if "-" in header:
            fragments = [fragment.strip() for fragment in header.split("-") if fragment.strip()]
            if len(fragments) >= 2:
                company, role = fragments[0], fragments[1]
        if len(buffer) > 1:
            for line in buffer[1:]:
                clean = line.strip(" -•·")
                if not clean:
                    continue
                if BULLET.match(line):
                    achievements.append(clean)
                else:
                    technologies.extend(part.strip() for part in re.split(r",|/", clean) if part.strip())
        start, end = current_dates if current_dates else ("N/A", None)
        experiences.append(
            Experience(
                company=company,
                role=role,
                start_date=start,
                end_date=end,
                achievements=achievements[:5],
                technologies=list(dict.fromkeys(technologies))[:8],
            )
        )
        buffer = []
        current_dates = None

    for line in lines:
        clean = sanitize_line(line)
        match = YEAR_RANGE.search(clean)
        if match:
            flush()
            current_dates = (match.group("start"), match.group("end"))
            clean = YEAR_RANGE.sub("", clean).strip(" -•·")
            if clean:
                buffer = [clean]
            else:
                buffer = [line]
            continue

        if buffer:
            if not clean:
                flush()
                continue
            buffer.append(clean)

    flush()
    return experiences[:8]


def parse_candidate_profile(raw_text: str) -> CandidateProfile:
    lines = [sanitize_line(line) for line in raw_text.splitlines()]
    lines = [line for line in lines if line]

    full_name = lines[0] if lines else "Candidat"
    email = extract_email(raw_text)
    phone = extract_phone(raw_text)

    sections = extract_sections(lines)
    skills = parse_skills(sections["skills"])
    languages = parse_languages(sections["languages"]) if sections["languages"] else []
    education = parse_education(sections["education"]) if sections["education"] else []
    projects = parse_projects(sections["projects"]) if sections["projects"] else []
    experiences = parse_experiences(lines)

    summary_candidates = lines[1:6]
    summary = " ".join(summary_candidates[:3]) if summary_candidates else None

    if not education:
        education = [Education(school="Université", degree="Formation", start_date="N/A")]
    if not experiences:
        experiences = [
            Experience(
                company="Expérience",
                role="Professionnel",
                start_date="N/A",
                achievements=["Résumé supprimé"],
                technologies=skills[:5],
            )
        ]
    if not skills:
        skills = ["Gestion de projet", "Programmation", "Communication"]

    return CandidateProfile(
        full_name=full_name,
        email=email,
        phone=phone,
        summary=summary,
        experiences=experiences,
        skills=skills,
        education=education,
        projects=projects,
        languages=languages,
    )
