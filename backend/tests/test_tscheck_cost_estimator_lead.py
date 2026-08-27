"""Cost Estimator -> lead submission (POST /api/leads)."""


def test_create_lead_success(client):
    payload = {
        "name": "tscheck-lead-001",
        "phone": "9876500001",
        "service_type": "Complete Rewinding",
        "equipment_type": "3-Phase Induction Motor",
        "capacity_hp": "50",
        "estimated_cost": 6500,
        "source": "quote_calculator",
    }
    resp = client.post("/leads", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["id"].startswith("LEAD-")
    assert body["name"] == "tscheck-lead-001"
    assert body["status"] == "new"


def test_create_lead_missing_required_field_rejected(client):
    # service_type is required; omitting it must fail validation, not silently succeed.
    payload = {"name": "tscheck-lead-002", "phone": "9876500002"}
    resp = client.post("/leads", json=payload)
    assert resp.status_code == 422, resp.text
