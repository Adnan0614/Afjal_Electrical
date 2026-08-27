"""Emergency dispatch form submission (POST /api/emergency-dispatch)."""


def test_create_emergency_dispatch_success(client):
    payload = {
        "contact_name": "tscheck-emg-001",
        "phone": "9876500003",
        "location_area": "Tilda Neora",
        "equipment_type": "Motor Breakdown",
        "problem_description": "Motor smoking and stopped abruptly during production run.",
    }
    resp = client.post("/emergency-dispatch", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["id"].startswith("SOS-")
    assert body["status"] == "dispatched"
    assert body["eta_minutes"] > 0


def test_create_emergency_dispatch_missing_field_rejected(client):
    payload = {"contact_name": "tscheck-emg-002", "phone": "9876500004"}
    resp = client.post("/emergency-dispatch", json=payload)
    assert resp.status_code == 422, resp.text
