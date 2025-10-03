from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional
from uuid import uuid4

from app.utils.serialization import dataclass_to_camel


def new_id() -> str:
    return str(uuid4())


@dataclass
class Experience:
    company: str
    role: str
    start_date: str
    end_date: Optional[str] = None
    achievements: List[str] = field(default_factory=list)
    technologies: List[str] = field(default_factory=list)
    id: str = field(default_factory=new_id)

    @classmethod
    def from_dict(cls, data: dict) -> "Experience":
        return cls(
            company=data.get("company", "Entreprise"),
            role=data.get("role", "Poste"),
            start_date=data.get("startDate") or data.get("start_date", "N/A"),
            end_date=data.get("endDate") or data.get("end_date"),
            achievements=data.get("achievements", []),
            technologies=data.get("technologies", []),
            id=data.get("id", new_id()),
        )


@dataclass
class Education:
    school: str
    degree: str
    start_date: str
    end_date: Optional[str] = None
    notes: Optional[str] = None
    id: str = field(default_factory=new_id)

    @classmethod
    def from_dict(cls, data: dict) -> "Education":
        return cls(
            school=data.get("school", "Établissement"),
            degree=data.get("degree", "Diplôme"),
            start_date=data.get("startDate") or data.get("start_date", "N/A"),
            end_date=data.get("endDate") or data.get("end_date"),
            notes=data.get("notes"),
            id=data.get("id", new_id()),
        )


@dataclass
class Project:
    name: str
    description: str
    url: Optional[str] = None
    impact: Optional[str] = None
    id: str = field(default_factory=new_id)

    @classmethod
    def from_dict(cls, data: dict) -> "Project":
        return cls(
            name=data.get("name", "Projet"),
            description=data.get("description", ""),
            url=data.get("url"),
            impact=data.get("impact"),
            id=data.get("id", new_id()),
        )


@dataclass
class LanguageLevel:
    label: str
    level: str

    @classmethod
    def from_dict(cls, data: dict) -> "LanguageLevel":
        return cls(label=data.get("label", ""), level=data.get("level", "Intermédiaire"))


@dataclass
class CandidateProfile:
    full_name: str
    email: Optional[str]
    phone: Optional[str]
    summary: Optional[str]
    experiences: List[Experience]
    skills: List[str]
    education: List[Education]
    projects: List[Project]
    languages: List[LanguageLevel]
    id: str = field(default_factory=new_id)

    def to_dict(self) -> dict:
        return dataclass_to_camel(self)

    @classmethod
    def from_dict(cls, data: dict) -> "CandidateProfile":
        experiences = [Experience.from_dict(item) for item in data.get("experiences", [])]
        education = [Education.from_dict(item) for item in data.get("education", [])]
        projects = [Project.from_dict(item) for item in data.get("projects", [])]
        languages = [LanguageLevel.from_dict(item) for item in data.get("languages", [])]

        return cls(
            full_name=data.get("fullName") or data.get("full_name", "Candidat"),
            email=data.get("email"),
            phone=data.get("phone"),
            summary=data.get("summary"),
            experiences=experiences,
            skills=data.get("skills", []),
            education=education,
            projects=projects,
            languages=languages,
            id=data.get("id", new_id()),
        )


@dataclass
class JobOffer:
    id: str
    title: str
    company: Optional[str]
    description: str
    location: Optional[str]
    keywords: List[str]

    def to_dict(self) -> dict:
        return dataclass_to_camel(self)

    @classmethod
    def from_dict(cls, data: dict) -> "JobOffer":
        return cls(
            id=data.get("id", new_id()),
            title=data.get("title", "Poste"),
            company=data.get("company"),
            description=data.get("description", ""),
            location=data.get("location"),
            keywords=data.get("keywords", []),
        )


@dataclass
class HighlightSpan:
    id: str
    type: str
    start: int
    end: int

    @classmethod
    def from_dict(cls, data: dict) -> "HighlightSpan":
        return cls(
            id=data.get("id", new_id()),
            type=data.get("type", "emphasis"),
            start=data.get("start", 0),
            end=data.get("end", 0),
        )


@dataclass
class AdaptationResult:
    adapted_resume: str
    adapted_cover_letter: str
    highlights: List[HighlightSpan]

    def to_dict(self) -> dict:
        return dataclass_to_camel(self)

    @classmethod
    def from_dict(cls, data: dict) -> "AdaptationResult":
        highlights = [HighlightSpan.from_dict(item) for item in data.get("highlights", [])]
        return cls(
            adapted_resume=data.get("adaptedResume") or data.get("adapted_resume", ""),
            adapted_cover_letter=data.get("adaptedCoverLetter")
            or data.get("adapted_cover_letter", ""),
            highlights=highlights,
        )


@dataclass
class ExtractionPayload:
    profile: CandidateProfile
    raw_text: str
    warnings: List[str]

    def to_dict(self) -> dict:
        return {
            "profile": self.profile.to_dict(),
            "rawText": self.raw_text,
            "warnings": self.warnings,
        }


@dataclass
class ExportPayload:
    resume_path: str
    cover_letter_path: str

    def to_dict(self) -> dict:
        return dataclass_to_camel(self)
