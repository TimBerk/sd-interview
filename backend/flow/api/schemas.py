from typing import Any

from flow.enums import (
    SectionDecisionEnum,
    SectionStatusEnum,
    SectionTypeEnum,
    WayDecisionEnum,
    WayStatusEnum,
)
from pydantic import BaseModel


class SectionUpdateSchema(BaseModel):
    name: str | None = None
    type: SectionTypeEnum | None = None
    status: SectionStatusEnum | None = None
    review: str | None = None
    decision: SectionDecisionEnum | None = None
    sort_order: int | None = None
    skill_assessments: list[Any] | None = None


class WayUpdateSchema(BaseModel):
    decision: WayDecisionEnum | None = None
    status: WayStatusEnum | None = None
    period_end: str | None = None
