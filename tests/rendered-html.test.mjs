import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("server-renders the company interview guide directory", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-Hant"/i);
  assert.match(html, /<title>IE 面試準備中心｜公司面試作戰手冊<\/title>/i);
  assert.match(html, /選一家公司/);
  assert.match(html, /凌華科技/);
  assert.match(html, /鴻佰科技/);
  assert.match(html, /href="\/adlink"/);
  assert.match(html, /href="\/ingrasys"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("server-renders the complete ADLINK interview guide shell", async () => {
  const response = await render("/adlink");
  assert.equal(response.status, 200);

  const html = await response.text();
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
  const response = await render("/adlink");
  const html = await response.text();

  assert.match(html, /aria-label="手機章節導覽"/);
  assert.match(html, /aria-label="主要章節"/);
  assert.match(html, /data-term="GPU"/);
  assert.match(html, /開啟 10 分鐘衝刺/);
  assert.match(html, /href="\/"[^>]*aria-label="返回公司手冊首頁"/);
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

test("ships mobile-first overflow and contrast safeguards", async () => {
  const homePage = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const homeCss = await readFile(new URL("../app/home.css", import.meta.url), "utf8");
  const adlinkPage = await readFile(new URL("../app/adlink/page.tsx", import.meta.url), "utf8");
  const ingrasysPage = await readFile(new URL("../app/ingrasys/page.tsx", import.meta.url), "utf8");
  const sharedCss = await readFile(new URL("../app/claude-theme.css", import.meta.url), "utf8");
  const ingrasysCss = await readFile(new URL("../app/ingrasys/ingrasys.css", import.meta.url), "utf8");

  assert.match(sharedCss, /@media \(max-width: 699px\)/);
  assert.match(sharedCss, /\.process-track\s*\{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(sharedCss, /\.glossary-list p\s*\{[\s\S]*?-webkit-line-clamp: unset/);
  assert.match(sharedCss, /--muted-light: #706c65/);
  assert.match(sharedCss, /\.section-no\s*\{[\s\S]*?color: var\(--signal-dark\)/);
  assert.match(sharedCss, /\.role-equation strong\s*\{[\s\S]*?background: var\(--ink\);[\s\S]*?color: var\(--paper\)/);
  assert.match(ingrasysCss, /\.ingrasys-site \.ing-factory\s*\{[\s\S]*?background: var\(--ink-2\)/);
  assert.match(ingrasysCss, /\.lighthouse-flow\s*\{[\s\S]*?grid-template-columns: 1fr/);
  assert.match(homePage, /const companyGuides: CompanyGuide\[\]/);
  assert.match(homeCss, /\.company-directory\s*\{[\s\S]*?display: grid/);
  assert.match(homeCss, /@media \(min-width: 700px\)[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(adlinkPage, /setGlossaryQuery\(""\); setSelectedTerm\(null\); setGlossaryOpen\(true\)/);
  assert.match(ingrasysPage, /setGlossaryQuery\(""\); setSelectedTerm\(null\); setGlossaryOpen\(true\)/);
});
