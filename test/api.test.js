import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createApp } from "../server/app.js";

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test("health endpoint reports the available vocabulary", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.ok(body.words >= 20);
});

test("words endpoint follows the contract from the assignment", async () => {
  const response = await fetch(`${baseUrl}/api/words?count=5`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.length, 5);
  for (const item of body) {
    assert.deepEqual(Object.keys(item), ["word", "description", "useCase"]);
    assert.ok(item.word && item.description && item.useCase);
  }
});

test("words endpoint clamps the requested amount", async () => {
  const response = await fetch(`${baseUrl}/api/words?count=100`);
  const body = await response.json();
  assert.equal(body.length, 12);
});
