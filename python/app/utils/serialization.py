from __future__ import annotations

from dataclasses import asdict, is_dataclass
from typing import Any


def to_camel_case(value: str) -> str:
    segments = value.split("_")
    return segments[0] + "".join(segment.capitalize() for segment in segments[1:])


def convert_keys(data: Any) -> Any:
    if isinstance(data, dict):
        return {to_camel_case(str(key)): convert_keys(value) for key, value in data.items()}
    if isinstance(data, list):
        return [convert_keys(item) for item in data]
    return data


def dataclass_to_camel(data: Any) -> Any:
    if is_dataclass(data):
        return convert_keys(asdict(data))
    if isinstance(data, list):
        return [dataclass_to_camel(item) for item in data]
    return convert_keys(data)
