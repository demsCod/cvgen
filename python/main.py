from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import typer

from app.models import AdaptationResult, CandidateProfile, ExtractionPayload, JobOffer
from app.nlp.adapter import adapt_documents
from app.nlp.offer import enrich_offer
from app.nlp.parser import parse_candidate_profile
from app.ocr.extractor import ExtractionError, extract_text
from app.exporter.documents import export_documents

cli = typer.Typer(help="Local AI toolbox for CV adaptation")


def read_payload(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def output(data: Any) -> None:
    print(json.dumps(data, ensure_ascii=False), flush=True)


@cli.command(name="import_cv")
def import_cv(input: Path) -> None:  # type: ignore[override]
    payload = read_payload(input)
    file_path = Path(payload["file_path"]).expanduser()
    try:
        raw_text, warnings = extract_text(file_path)
    except ExtractionError as error:
        typer.secho(f"Erreur d'extraction : {error}", fg=typer.colors.RED, err=True)
        raise typer.Exit(code=1) from error

    profile = parse_candidate_profile(raw_text)
    result = ExtractionPayload(profile=profile, raw_text=raw_text, warnings=warnings)
    output(result.to_dict())


@cli.command(name="analyze_offer")
def analyze_offer(input: Path) -> None:  # type: ignore[override]
    payload = read_payload(input)
    offer = JobOffer.from_dict(payload["offer"])
    enriched = enrich_offer(offer)
    output(enriched.to_dict())


@cli.command(name="adapt_documents")
def adapt_documents_cmd(input: Path) -> None:  # type: ignore[override]
    payload = read_payload(input)
    profile = CandidateProfile.from_dict(payload["profile"])
    offer = JobOffer.from_dict(payload["offer"])
    result = adapt_documents(profile, offer)
    output(result.to_dict())


@cli.command(name="export_documents")
def export_documents_cmd(input: Path) -> None:  # type: ignore[override]
    payload = read_payload(input)
    profile = CandidateProfile.from_dict(payload["profile"])
    adaptation = AdaptationResult.from_dict(payload["adaptation"])
    fmt = payload.get("format", "pdf")
    result = export_documents(profile, adaptation, fmt)
    output(result.to_dict())


if __name__ == "__main__":
    cli()
