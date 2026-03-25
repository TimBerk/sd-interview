from pydantic import BaseModel
from typing import Any


class SectionUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    status: str | None = None
    review: str | None = None
    decision: str | None = None
    sort_order: int | None = None
    skill_assessments: list[Any] | None = None


class WayUpdate(BaseModel):
    decision: str | None = None
    status: str | None = None
    period_end: str | None = None
