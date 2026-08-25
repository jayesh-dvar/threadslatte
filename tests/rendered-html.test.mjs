import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const serverUrl = new URL("../.output/server/index.mjs", import.meta.url);
  serverUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  await import(serverUrl.href);
  const response = await globalThis.__nitro__.default.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }));
  return { status: response.status, contentType: response.headers.get("content-type"), html: await response.text() };
}

test("server-renders the Threads & Latte homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.contentType ?? "", /^text\/html\b/i);
  const html = response.html;
  assert.match(html, /<title>Made-to-Order Womenswear, Made More You\./i);
  assert.match(html, /Made-to-order/);
  assert.match(html, /Currently in everyone&#x27;s/);
  assert.match(html, /Chai &amp; Chill Set/);
  assert.match(html, /Make it yours/);
  assert.match(html, /Join the T&amp;L tribe/);
  assert.match(html, /cdn\.shopify\.com/);
  assert.doesNotMatch(html, /images\.unsplash\.com/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("starter preview infrastructure is removed from the finished site", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /activeCategory/);
  assert.match(page, /bagCount/);
  assert.match(layout, /Threads & Latte/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});
