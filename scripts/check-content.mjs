import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const base = process.env.CONTENT_TEST_URL || "http://127.0.0.1:5173";
if (!["127.0.0.1", "localhost"].includes(new URL(base).hostname)) throw new Error("Run this development check against loopback only");
let cookie = "";
const created = [];
const uploaded = [];
async function upload(bytes, type, admin = true) {
  const form = new FormData(); form.set("file", new Blob([bytes], { type }), "test-image");
  return fetch(base + "/api/uploads", { method: "POST", headers: { Origin: base, ...(admin ? { Cookie: cookie } : {}) }, body: form });
}
async function request(path, { admin = false, method = "GET", body, origin = base, headers = {} } = {}) {
  const response = await fetch(base + path, { method, headers: { ...(body ? { "Content-Type": "application/json", Origin: origin } : {}), ...(admin ? { Cookie: cookie } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined, redirect: "manual", signal: AbortSignal.timeout(15000) });
  const text = await response.text(); let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: response.status, data, headers: response.headers };
}
try {
  assert.equal((await request("/api/content?admin=1")).status, 403);
  assert.equal((await request("/api/content?admin=1", { headers: { "oai-authenticated-user-id": "forged", "oai-authenticated-user-email": "syraedutech@gmail.com" } })).status, 403);
  assert.equal((await request("/api/content", { method: "POST", body: {} })).status, 403);
  let signin;
  if (process.env.CONTENT_TEST_ADMIN_PASSWORD) {
    assert.equal((await request("/api/admin/login", { method: "POST", body: { email: "other@example.com", password: process.env.CONTENT_TEST_ADMIN_PASSWORD } })).status, 401);
    assert.equal((await request("/api/admin/login", { method: "POST", body: { email: "syraedutech@gmail.com", password: "incorrect-password" } })).status, 401);
    assert.equal((await request("/api/content?admin=1", { headers: { Cookie: "syra_admin_session=forged.invalid" } })).status, 403);
    signin = await request("/api/admin/login", { method: "POST", body: { email: "syraedutech@gmail.com", password: process.env.CONTENT_TEST_ADMIN_PASSWORD } });
    assert.equal(signin.status, 200);
    assert.ok(signin.headers.get("set-cookie")?.includes("HttpOnly"));
    assert.ok(signin.headers.get("set-cookie")?.includes("Secure"));
  } else signin = await request("/signin-with-chatgpt?return_to=/admin");
  cookie = signin.headers.get("set-cookie")?.split(";")[0] || "";
  assert.ok(cookie, "Sign-in should issue a cookie");
  assert.equal((await request("/api/content?admin=1", { admin: true })).status, 200);
  assert.equal((await request("/api/content", { admin: true, method: "POST", origin: "https://untrusted.example", body: {} })).status, 403);
  const imageBytes = await readFile("public/syra-edutech-logo.png");
  assert.equal((await upload(imageBytes, "image/png", false)).status, 403);
  assert.equal((await upload(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), "image/svg+xml")).status, 400);
  assert.equal((await upload(new Uint8Array(5 * 1024 * 1024 + 1), "image/png")).status, 413);
  const uploadedResponse = await upload(imageBytes, "image/png");
  assert.equal(uploadedResponse.status, 201);
  const image = await uploadedResponse.json(); uploaded.push(image.url);
  const served = await fetch(base + image.url);
  assert.equal(served.status, 200); assert.equal(served.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await served.arrayBuffer()), imageBytes);
  const payload = { title: "Integration test image", image: image.url, caption: "Temporary integration test" };
  assert.equal((await request("/api/content", { admin: true, method: "POST", body: { kind: "gallery", published: true, payload: { ...payload, image: "javascript:alert(1)" } } })).status, 400);
  const draft = await request("/api/content", { admin: true, method: "POST", body: { kind: "gallery", published: false, payload } });
  assert.equal(draft.status, 200); created.push(draft.data.id);
  assert.equal((await request(image.url, { admin: true, method: "DELETE", body: {} })).status, 409);
  assert.ok(!(await request("/api/content")).data.some(r => r.id === draft.data.id));
  assert.equal((await request("/api/content", { admin: true, method: "POST", body: { id: draft.data.id, kind: "gallery", published: true, payload } })).status, 200);
  assert.ok((await request("/api/content")).data.some(r => r.id === draft.data.id));
  assert.ok((await request("/")).data.includes("Integration test image"), "Published gallery should render server-side");
  const trainerPayload = { name: "Integration Mentor", slug: `integration-${Date.now()}`, role: "Test mentor", image: "/trainer-surya.png", experience: "5 years", credential: "Test credential", specialties: "Testing", initials: "IM", isLead: "false" };
  const mentor = await request("/api/content", { admin: true, method: "POST", body: { kind: "trainer", published: true, payload: trainerPayload } });
  assert.equal(mentor.status, 200); created.push(mentor.data.id);
  assert.ok((await request(`/trainers/${trainerPayload.slug}`)).data.includes("Integration Mentor"));
  assert.equal((await request("/api/content", { admin: true, method: "POST", body: { kind: "trainer", published: true, payload: trainerPayload } })).status, 409);
  const feedback = { name: "Integration visitor", email: `check-${Date.now()}@example.com`, rating: "5", message: "Integration test for private feedback delivery.", consent: true, website: "" };
  assert.equal((await request("/api/feedback", { method: "POST", body: { ...feedback, consent: false } })).status, 400);
  assert.equal((await request("/api/feedback", { method: "POST", body: feedback })).status, 201);
  const inbox = await request("/api/content?admin=1", { admin: true });
  const saved = inbox.data.find(r => r.kind === "feedback" && r.payload.email === feedback.email);
  assert.ok(saved); created.push(saved.id);
  const publicRows = (await request("/api/content")).data;
  assert.ok(!publicRows.some(r => r.kind === "feedback"));
  assert.ok(!JSON.stringify(publicRows).includes(feedback.email));
  console.log("PASS: authorization, forged headers, origin checks, validation, draft visibility, publishing, gallery rendering, trainer profiles, duplicate slugs, private feedback persistence, authenticated image upload, image validation, upload size limit, image retrieval and in-use image protection");
} finally {
  for (const id of created) {
    const removed = await request("/api/content", { admin: true, method: "DELETE", body: { id } });
    assert.equal(removed.status, 200, `Cleanup failed for ${id}`);
    assert.ok(!(await request("/api/content?admin=1", { admin: true })).data.some(r => r.id === id));
  }
  for (const url of uploaded) {
    assert.equal((await request(url, { admin: true, method: "DELETE", body: {} })).status, 200);
    assert.equal((await request(url)).status, 404);
  }
}

if (process.env.CONTENT_TEST_ADMIN_PASSWORD) {
  const logout = await request("/api/admin/logout", { admin: true });
  assert.equal(logout.status, 303);
  assert.ok(logout.headers.get("set-cookie")?.includes("Max-Age=0"));
  console.log("PASS: Netlify admin credentials, signed session cookie, forged session rejection and logout");
}
