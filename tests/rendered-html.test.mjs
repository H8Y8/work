import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete interview guide shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-Hant"/i);
  assert.match(html, /<title>凌華科技 ADLINK｜IE 面試作戰手冊<\/title>/i);
  assert.match(html, /讀懂凌華/);
  assert.match(html, /公司與產業定位/);
  assert.match(html, /這個 IE 職位真正要做什麼/);
  assert.match(html, /電子產品製造流程/);
  assert.match(html, /名詞庫/);
  assert.match(html, /資料來源與使用界線/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("includes accessible mobile navigation and glossary dialogs", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /aria-label="手機章節導覽"/);
  assert.match(html, /aria-label="主要章節"/);
  assert.match(html, /data-term="GPU"/);
  assert.match(html, /開啟 10 分鐘衝刺/);
  assert.match(html, /href="https:\/\/www\.adlinktech\.com\/tw\/aboutus"/);
});

test("server-renders the Ingrasys IE interview guide", async () => {
  const response = await render("/ingrasys");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>鴻佰科技 Ingrasys｜IE 工程師面試作戰手冊<\/title>/i);
  assert.match(html, /讀懂鴻佰/);
  assert.match(html, /AI Server 怎麼製造/);
  assert.match(html, /IE 工程師：高效製造體系的建築師/);
  assert.match(html, /名詞庫/);
  assert.match(html, /data-term="GPU"/);
  assert.match(html, /aria-label="手機章節導覽"/);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /href="https:\/\/www\.ingrasys\.com\/company\/about\/"/);
  assert.match(html, /非官方經驗提醒/);
});
