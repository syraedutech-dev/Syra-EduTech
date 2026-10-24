import { BlobsServer } from "@netlify/blobs/server";
import { setEnvironmentContext } from "@netlify/blobs";
import { randomBytes, randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
const server = new BlobsServer({ directory: resolve(".sites-runtime", `netlify-check-${randomUUID()}`), token: "local-test-token", logger: () => {} });
let next;
const password = randomBytes(24).toString("hex");
try {
  const { port } = await server.start();
  const address = `http://127.0.0.1:${port}`;
  setEnvironmentContext({ siteID: "syra-local-test", token: "local-test-token", edgeURL: address, uncachedEdgeURL: address });
  const env = { ...process.env, ADMIN_PASSWORD: password, ADMIN_SESSION_SECRET: randomBytes(32).toString("hex"), CONTENT_TEST_ADMIN_PASSWORD: password, CONTENT_TEST_URL: "http://127.0.0.1:3188" };
  next = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", "3188"], { env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  let logs = ""; next.stdout.on("data", chunk => { logs += chunk; }); next.stderr.on("data", chunk => { logs += chunk; });
  let ready = false;
  for (let i = 0; i < 120; i++) {
    if (next.exitCode !== null) throw new Error(`Next.js stopped before tests: ${logs}`);
    try { const response = await fetch(env.CONTENT_TEST_URL + "/admin"); if (response.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error(`Next.js preview was not ready: ${logs}`);
  const test = spawn(process.execPath, ["scripts/check-content.mjs"], { env, windowsHide: true, stdio: "inherit" });
  const code = await new Promise(resolve => test.once("exit", resolve));
  if (code !== 0) throw new Error(`Netlify integration checks failed. Server output: ${logs}`);
} finally {
  if (next && next.exitCode === null) {
    const stopped = new Promise(resolve => next.once("exit", resolve)); next.kill(); await stopped;
  }
  await server.stop();
}
