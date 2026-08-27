"""Owner updates before/after site photos (PUT /api/settings/media)."""

import os
import uuid

OWNER_PIN = os.environ.get("OWNER_PIN", "2003")


def test_owner_can_update_site_media(client):
    login = client.post("/auth/owner-login", json={"pin": OWNER_PIN})
    assert login.status_code == 200, login.text

    marker = uuid.uuid4().hex[:8]
    payload = {
        "before_image_url": f"https://example.com/tscheck-before-{marker}.jpg",
        "after_image_url": f"https://example.com/tscheck-after-{marker}.jpg",
        "before_caption": f"tscheck BEFORE {marker}",
        "after_caption": f"tscheck AFTER {marker}",
        "gallery": [{"label": "tscheck-gallery", "image_url": f"https://example.com/tscheck-gallery-{marker}.jpg"}],
    }
    resp = client.put("/settings/media", json=payload)
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["before_image_url"] == payload["before_image_url"]
    assert body["after_image_url"] == payload["after_image_url"]

    # public GET must reflect the update
    public = client.get("/settings/media")
    assert public.status_code == 200
    assert public.json()["before_image_url"] == payload["before_image_url"]


def test_update_site_media_requires_owner_auth(client):
    payload = {
        "before_image_url": "https://example.com/x.jpg",
        "after_image_url": "https://example.com/y.jpg",
        "before_caption": "x",
        "after_caption": "y",
        "gallery": [],
    }
    resp = client.put("/settings/media", json=payload)
    assert resp.status_code in (401, 403), resp.text
