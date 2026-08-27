"""Owner advances a job stage (POST /api/jobs/{job_id}/advance).

Uses a job created by this test (tscheck- prefixed), never the seeded
AE-2024-8901 job, so the fixture is fully isolated and rerun-safe.
"""

import os
import uuid

OWNER_PIN = os.environ.get("OWNER_PIN", "2003")


def _create_job(client):
    job_id = f"AE-TSCHECK-{uuid.uuid4().hex[:6].upper()}"
    payload = {
        "job_id": job_id,
        "customer_name": "tscheck-job-customer",
        "phone": "9876500005",
        "equipment_name": "10 HP Test Motor",
        "equipment_specs": "10 HP, 1440 RPM",
        "service_type": "Rewinding",
        "intake_date": "2025-01-01",
        "estimated_delivery": "2025-01-05",
        "current_stage": "Diagnostic & Surge Testing",
        "status_percentage": 0,
    }
    resp = client.post("/jobs", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()


def test_owner_can_advance_job_stage(client):
    login = client.post("/auth/owner-login", json={"pin": OWNER_PIN})
    assert login.status_code == 200, login.text

    job = _create_job(client)
    job_id = job["job_id"]
    before_pct = job["status_percentage"]

    resp = client.post(f"/jobs/{job_id}/advance")
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["job"]["status_percentage"] > before_pct
    assert body["job"]["job_id"] == job_id
    assert "message" in body


def test_advance_job_stage_requires_owner_auth(client):
    job = _create_job(client)
    job_id = job["job_id"]
    resp = client.post(f"/jobs/{job_id}/advance")
    assert resp.status_code in (401, 403), resp.text
