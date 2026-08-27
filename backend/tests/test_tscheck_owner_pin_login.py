"""Owner PIN login (POST /api/auth/owner-login)."""

import os

OWNER_PIN = os.environ.get("OWNER_PIN", "2003")


def test_owner_login_correct_pin_succeeds(client):
    resp = client.post("/auth/owner-login", json={"pin": OWNER_PIN})
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["authenticated"] is True
    assert body["role"] == "owner"
    # session cookie must actually grant access to an owner-only endpoint
    me = client.get("/auth/me")
    assert me.json()["authenticated"] is True


def test_owner_login_wrong_pin_rejected_and_stays_locked(client):
    resp = client.post("/auth/owner-login", json={"pin": "0000"})
    assert resp.status_code == 401, resp.text

    # owner-only endpoint must still be inaccessible
    leads_resp = client.get("/leads")
    assert leads_resp.status_code in (401, 403)
