from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from flow.api.schemas import SectionUpdate, WayUpdate
from flow.models.candidates import Candidates
from flow.models.candidate_ways import CandidateWays
from flow.models.candidate_way_sections import CandidateWaySections
from settings.db import get_session

router = APIRouter(prefix="/api/v1/flow")


def candidate_to_dict(c: Candidates) -> dict:
    return {
        "id": c.id,
        "full_name": c.full_name,
        "description": c.description,
        "specialty": c.specialty,
        "links": c.links or [],
        "created_at": c.created_at.isoformat() if c.created_at else None,
    }


def way_to_dict(w: CandidateWays) -> dict:
    return {
        "id": w.id,
        "candidate_id": w.candidate_id,
        "period_start": w.period_start.isoformat() if w.period_start else None,
        "period_end": w.period_end.isoformat() if w.period_end else None,
        "specialty": w.specialty,
        "decision": w.decision,
        "status": w.status,
        "created_at": w.created_at.isoformat() if w.created_at else None,
        "tags": [{"id": t.id, "name": t.name, "color": t.color} for t in (w.tags or [])],
        "sections": [section_to_dict(s) for s in sorted(w.sections or [], key=lambda x: x.sort_order)],
        "candidate": candidate_to_dict(w.candidate) if w.candidate else None,
    }


def section_to_dict(s: CandidateWaySections) -> dict:
    return {
        "id": s.id,
        "way_id": s.way_id,
        "name": s.name,
        "type": s.type,
        "status": s.status,
        "review": s.review,
        "decision": s.decision,
        "sort_order": s.sort_order,
        "skill_assessments": s.skill_assessments or [],
    }


@router.get("/candidates/")
async def list_candidates(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Candidates).order_by(Candidates.created_at.desc())
    )
    candidates = result.scalars().all()
    return [candidate_to_dict(c) for c in candidates]


@router.get("/candidates/{candidate_id}/")
async def get_candidate(candidate_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Candidates)
        .options(
            selectinload(Candidates.ways).selectinload(CandidateWays.sections),
            selectinload(Candidates.ways).selectinload(CandidateWays.tags),
        )
        .where(Candidates.id == candidate_id)
    )
    candidate = result.scalar_one_or_none()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    data = candidate_to_dict(candidate)
    data["ways"] = [way_to_dict(w) for w in candidate.ways]
    return data


@router.get("/ways/")
async def list_ways(session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(CandidateWays)
        .options(
            selectinload(CandidateWays.candidate),
            selectinload(CandidateWays.sections),
            selectinload(CandidateWays.tags),
        )
        .order_by(CandidateWays.created_at.desc())
    )
    ways = result.scalars().all()
    return [way_to_dict(w) for w in ways]


@router.get("/ways/{way_id}/")
async def get_way(way_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(CandidateWays)
        .options(
            selectinload(CandidateWays.candidate),
            selectinload(CandidateWays.sections),
            selectinload(CandidateWays.tags),
        )
        .where(CandidateWays.id == way_id)
    )
    way = result.scalar_one_or_none()
    if not way:
        raise HTTPException(status_code=404, detail="Way not found")
    return way_to_dict(way)


@router.put("/ways/{way_id}/")
async def update_way(
    way_id: int,
    update: WayUpdate,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(CandidateWays).where(CandidateWays.id == way_id)
    )
    way = result.scalar_one_or_none()
    if not way:
        raise HTTPException(status_code=404, detail="Way not found")

    if update.decision is not None:
        way.decision = update.decision
    if update.status is not None:
        way.status = update.status

    await session.commit()
    return {"success": True}


@router.put("/sections/{section_id}/")
async def update_section(
    section_id: int,
    update: SectionUpdate,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(CandidateWaySections).where(CandidateWaySections.id == section_id)
    )
    section = result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    if update.name is not None:
        section.name = update.name
    if update.type is not None:
        section.type = update.type
    if update.status is not None:
        section.status = update.status
    if update.review is not None:
        section.review = update.review
    if update.decision is not None:
        section.decision = update.decision
    if update.sort_order is not None:
        section.sort_order = update.sort_order
    if update.skill_assessments is not None:
        section.skill_assessments = update.skill_assessments

    await session.commit()
    return {"success": True}
