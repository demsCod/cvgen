from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import pdfminer.high_level
import pytesseract
from PIL import Image

try:
    import textract  # type: ignore
except ImportError:  # pragma: no cover
    textract = None

try:
    import docx  # type: ignore
except ImportError:  # pragma: no cover
    docx = None


class ExtractionError(RuntimeError):
    """Raised when an extraction fails."""


def extract_text(file_path: Path) -> Tuple[str, List[str]]:
    suffix = file_path.suffix.lower()
    warnings: List[str] = []

    if suffix == ".pdf":
        text = pdfminer.high_level.extract_text(str(file_path))
        return text, warnings

    if suffix in {".png", ".jpg", ".jpeg"}:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image, lang="fra+eng")
        return text, warnings

    if suffix in {".docx"} and docx:
        document = docx.Document(str(file_path))
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)
        return text, warnings

    if suffix == ".doc":
        if not textract:  # pragma: no cover - optional dependency
            raise ExtractionError(
                "Extraction .doc requiert textract: installez-le manuellement ou convertissez en .docx"
            )
        try:
            text = textract.process(str(file_path)).decode("utf-8")
            warnings.append("Extraction .doc via textract — qualité variable")
            return text, warnings
        except Exception as error:  # pragma: no cover
            raise ExtractionError(str(error))

    raise ExtractionError(f"Format de fichier non supporté: {suffix}")
