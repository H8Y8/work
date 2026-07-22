"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GlossaryItem = {
  term: string;
  alias?: string;
  category: "產品" | "製造" | "系統" | "IE" | "散熱";
  definition: string;
  interview: string;
};

const glossary: GlossaryItem[] = [
  { term: "AI Server", alias: "AI 伺服器", category: "產品", definition: "針對 AI 訓練或推論設計的高效能伺服器，通常整合多顆 GPU、高速網路、大容量記憶體與高功率電源。", interview: "對 IE 而言，重點是高價物料、組態差異、散熱、測試時間與追溯性，而不只是組裝節拍。" },
  { term: "Cloud Infrastructure", alias: "雲端基礎設施", category: "產品", definition: "支撐雲端服務的伺服器、儲存、網路、機櫃、電力與冷卻等整體硬體環境。", interview: "鴻佰官方將自己定位為全球 Cloud Infrastructure Provider，而非單一伺服器代工廠。" },
  { term: "Hyperscaler", alias: "超大規模雲端服務商", category: "產品", definition: "營運巨大資料中心與雲端平台的企業，採購量大，且高度重視規格、交期、可靠度與供應鏈韌性。", interview: "面試回答可連結到客製組態、快速擴產、全球交付與嚴格品質標準。" },
  { term: "HPC", alias: "High-Performance Computing", category: "產品", definition: "高效能運算，利用大量 CPU／GPU 與高速互連處理科學模擬、AI 訓練等密集運算工作。", interview: "HPC 產品通常提升功耗、散熱、測試負載與機櫃整合複雜度。" },
  { term: "GPU", alias: "Graphics Processing Unit", category: "產品", definition: "擅長大量平行運算的處理器，是 AI 訓練、推論與 HPC 平台的核心元件。", interview: "GPU 價值高、供應受限且功耗大，需強化防錯、序號追溯、散熱與壓力測試。" },
  { term: "Rack", alias: "機櫃", category: "產品", definition: "安裝伺服器、交換器、電源與冷卻設備的標準化機櫃；rack-scale 指整櫃完成整合與驗證。", interview: "整櫃製造會把搬運、配線、網路、供電、液冷與最終測試變成 IE 的規劃重點。" },
  { term: "RU / OU", alias: "Rack / Open Rack Unit", category: "產品", definition: "表示設備在標準或開放式機櫃中的高度單位；1U 約 44.45 mm，OU 用於部分 Open Rack 架構。", interview: "規格會影響機構設計、站點治具、堆疊密度與搬運方式。" },
  { term: "L10", alias: "Server / Storage Integration", category: "製造", definition: "常見製造層級用語，通常指完成伺服器或儲存系統層級的組裝、設定與測試。", interview: "實際定義依公司與客戶而異，面試時應先確認廠區的製程邊界。" },
  { term: "L12", alias: "Rack Integration", category: "製造", definition: "常指把多台伺服器、網路、電源與冷卻元件整合到機櫃並完成系統級驗證。", interview: "L12 的瓶頸可能在配線、通電、網路或液冷測試，不一定在人工作業站。" },
  { term: "HGX", alias: "NVIDIA HGX", category: "產品", definition: "NVIDIA 的資料中心 GPU 基礎平台，整合多顆 GPU 與高速互連，供伺服器廠建立 AI 系統。", interview: "可把它理解為高價、高功率、高測試複雜度的核心運算平台。" },
  { term: "MGX", alias: "NVIDIA MGX", category: "產品", definition: "模組化伺服器參考架構，讓製造商用標準化元件組合不同 CPU、GPU 與網路組態。", interview: "模組化增加產品彈性，也會增加 BOM、Routing、工時與測試矩陣管理需求。" },
  { term: "NVL72", alias: "Rack-scale AI System", category: "產品", definition: "由 72 顆 GPU 組成的機櫃級 AI 系統架構，強調整櫃運算、網路、供電與液冷整合。", interview: "IE 應關注整櫃節拍、並行工位、測試資源、漏液風險與物流安全。" },
  { term: "BMC", alias: "Baseboard Management Controller", category: "系統", definition: "伺服器上的獨立管理控制器，可遠端監控電源、溫度、風扇與硬體狀態。", interview: "BMC 韌體版本、燒錄與驗證常是測試流程與追溯資料的一部分。" },
  { term: "Firmware", alias: "韌體", category: "系統", definition: "嵌入硬體、控制設備底層行為的軟體，例如 BIOS、BMC 與裝置韌體。", interview: "組態多時，版本錯置可能造成返工；應以自動辨識、鎖版與 MES 防錯降低風險。" },
  { term: "NVMe-oF", alias: "NVMe over Fabrics", category: "產品", definition: "讓 NVMe 儲存裝置透過高速網路被遠端存取的協定架構，兼顧低延遲與高吞吐。", interview: "儲存產品的測試瓶頸可能在網路拓撲、效能基準與長時間穩定性。" },
  { term: "EBOF", alias: "Ethernet Bunch of Flash", category: "產品", definition: "以乙太網路連接大量快閃儲存裝置的高密度儲存系統。", interview: "IE 需把產品差異轉成工時、測試資源與成本動因，而非只用產量平均分攤。" },
  { term: "Liquid Cooling", alias: "液冷", category: "散熱", definition: "利用液體比空氣更高的帶熱能力，為高功率 CPU／GPU 或整個機櫃散熱。", interview: "製造端會增加管路裝配、扭力、防呆、壓力／漏液測試與冷卻能力驗證。" },
  { term: "DLC", alias: "Direct Liquid Cooling", category: "散熱", definition: "讓冷卻液流經冷板，直接帶走 CPU／GPU 等高熱源的熱量。", interview: "站點標準需包含接頭、扭力、流量、壓差與漏液測試。" },
  { term: "CDU", alias: "Coolant Distribution Unit", category: "散熱", definition: "冷卻液分配單元，負責循環、換熱、過濾與監控機櫃或資料中心液冷迴路。", interview: "CDU 測試可能需要專用設備、管路與安全區域，直接影響 Layout 與 CapEx。" },
  { term: "RPU", alias: "Rack Power Unit", category: "產品", definition: "機櫃電力分配與管理單元，用於提供、監測與保護高密度設備用電。", interview: "高功率平台需將電力容量、安全與測試負載納入建線規劃。" },
  { term: "RDHx", alias: "Rear Door Heat Exchanger", category: "散熱", definition: "裝在機櫃後門的熱交換器，用液體吸收伺服器排出的熱風。", interview: "它會改變機櫃深度、重量、管路與工站操作空間。" },
  { term: "Immersion Cooling", alias: "浸沒式冷卻", category: "散熱", definition: "將伺服器或元件浸入不導電冷卻液中，由液體直接吸收熱量。", interview: "要額外考慮液體處理、潔淨、安全、維修與相容性驗證。" },
  { term: "DMS", alias: "Digital Manufacturing System", category: "系統", definition: "數位製造系統；鴻佰官方說明其自研 DMS 串聯 IoT、AI 與工廠系統，支援生產決策。", interview: "IE 的價值不只是做報表，而是定義資料、找異常、建立閉環與推動複製。" },
  { term: "APS", alias: "Advanced Planning and Scheduling", category: "系統", definition: "進階規劃排程，依訂單、物料、產能與限制安排生產。", interview: "面試可說明如何處理急單、缺料、換線、測試資源與優先級衝突。" },
  { term: "ERP", alias: "Enterprise Resource Planning", category: "系統", definition: "整合訂單、物料、庫存、採購、成本與財務的企業資源規劃系統。", interview: "IE 需確認料號、工單、工時與成本欄位定義，避免資料口徑不一致。" },
  { term: "WMS", alias: "Warehouse Management System", category: "系統", definition: "管理收料、庫位、揀料、補料、盤點與出庫的倉儲系統。", interview: "AI Server 高價料多，WMS 與線邊庫設計會影響齊套率、追溯與停線風險。" },
  { term: "AGV", alias: "Automated Guided Vehicle", category: "系統", definition: "依固定路徑或導引方式搬運物料的自動搬運車。", interview: "導入前要驗證物流頻率、容器、交管、安全、充電與異常備援。" },
  { term: "JIT", alias: "Just in Time", category: "IE", definition: "在需要的時間、以需要的數量供應物料，降低庫存與等待。", interview: "不是零庫存；需用需求穩定度、補料頻率與供應風險設定合理緩衝。" },
  { term: "MES", alias: "Manufacturing Execution System", category: "系統", definition: "追蹤工單、站點、在製品、序號、工時、設備與品質的製造執行系統。", interview: "可用於鎖定 Routing、收集 CT、監控 WIP、追溯料件與防止錯版。" },
  { term: "UPH", alias: "Units Per Hour", category: "IE", definition: "每小時產出數量，常用於衡量產線或站點產能。", interview: "高混產品應搭配標準工時、組態與產品組合解讀，不能只比件數。" },
  { term: "Cycle Time", alias: "CT / 週期時間", category: "IE", definition: "完成一件產品或一次作業所需的實際時間。", interview: "以站點 CT 與 Takt 比較，可找出無法滿足需求的瓶頸。" },
  { term: "Takt Time", alias: "節拍時間", category: "IE", definition: "可用生產時間除以客戶需求量，代表滿足需求所允許的平均出貨節奏。", interview: "Takt 由需求決定，CT 由製程表現決定；兩者不可混為一談。" },
  { term: "Line Balance", alias: "產線平衡", category: "IE", definition: "重新分配作業，使各站負荷更接近目標節拍，降低等待與瓶頸。", interview: "AI Server 需同時考慮技能、治具、測試槽位與不可拆作業，不宜只平均人工。" },
  { term: "Bottleneck", alias: "瓶頸", category: "IE", definition: "限制整體產出的最小有效產能環節；可能是人、設備、物料、測試或資訊。", interview: "先用等待、WIP 與負荷資料驗證瓶頸，再決定加人、並站、治具或排程。" },
  { term: "Standard Time", alias: "標準工時", category: "IE", definition: "在既定方法、條件與正常速度下，完成作業應需的時間，通常包含合理寬放。", interview: "標準工時是人力、產能、成本與報價基礎，必須綁定版本與定期維護。" },
  { term: "NPI", alias: "New Product Introduction", category: "製造", definition: "新產品從設計、試產、驗證到量產爬坡的導入流程。", interview: "IE 需在早期確認工序、治具、工時、產能、Layout、資料欄位與量產風險。" },
  { term: "Burn-in / Stress Test", alias: "燒機／壓力測試", category: "製造", definition: "讓產品長時間或在高負載條件下運行，以暴露早期失效並驗證穩定性。", interview: "測試可能不耗很多直接人工，卻大量占用機台、電力、網路與空間。" },
  { term: "FPY", alias: "First Pass Yield", category: "IE", definition: "一次通過率，產品不經重工就通過製程或測試的比例。", interview: "FPY 能揭露被最終良率掩蓋的重測、返工與隱形成本。" },
  { term: "OEE", alias: "Overall Equipment Effectiveness", category: "IE", definition: "設備綜合效率，通常由稼動率、性能效率與良率相乘。", interview: "對測試設備要先定義計畫時間與產品標準測試時間，否則 OEE 容易失真。" },
  { term: "ROI", alias: "Return on Investment", category: "IE", definition: "投資報酬率，用收益或節省相對投資金額評估方案價值。", interview: "自動化案應計入產能、品質、人力、安全、維護、停線與導入風險，而非只算省幾個人。" },
];

const navItems = [
  { id: "company", label: "公司", short: "01" },
  { id: "factory", label: "製造", short: "02" },
  { id: "role", label: "職務", short: "03" },
  { id: "interview", label: "面試", short: "04" },
];

const sources = [
  { label: "鴻佰官方｜About Ingrasys", note: "2002 年成立、鴻海集團、產品組合、全球據點與垂直整合", href: "https://www.ingrasys.com/company/about/" },
  { label: "鴻佰官方｜Smart Factory", note: "桃園南青燈塔工廠、DMS、APS、ERP、WMS、AGV 與 MES", href: "https://www.ingrasys.com/company/factory/" },
  { label: "鴻佰官方｜WEF Lighthouse Factory", note: "2023 年官方公布的效率、缺陷、交期與單位成本改善基準", href: "https://www.ingrasys.com/news-detail/20231221/" },
  { label: "鴻佰官方｜Products", note: "伺服器、儲存、AI 加速器與 GPU 平台產品分類", href: "https://www.ingrasys.com/products/57/" },
  { label: "鴻佰官方｜Advanced Cooling", note: "高密度機櫃、液冷與浸沒式冷卻方案", href: "https://www.ingrasys.com/solutions/advanced-cooling/overview/" },
  { label: "鴻佰官方｜Rack-level Liquid Cooling", note: "DLC、CDU、RPU、RDHx 與監控項目", href: "https://www.ingrasys.com/solutions/advanced-liquid-cooling/rack-level-liquid-cooling/" },
  { label: "鴻佰官方｜Join Us", note: "公司價值觀、AI Server 端到端整合與全球影響", href: "https://www.ingrasys.com/company/support/joinus/" },
  { label: "104｜鴻佰 IE 工程師公開職缺", note: "Layout、人力設備配置、AI Server 生產線標準與營運影響", href: "https://www.104.com.tw/jobs/search?jobexp=1&keyword=%E8%B3%87%E6%B7%B1IE%E5%B7%A5%E7%A8%8B%E5%B8%AB" },
  { label: "中原工工系｜鴻佰 IE 實習職務附件", note: "標準工時維護、現場量測改善、5S、專案數據與推動追蹤", href: "https://ise.cycu.edu.tw/wp-content/uploads/2024/03/%E9%B4%BB%E4%BD%B0%E7%A7%91%E6%8A%80%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8-%E6%87%89%E5%BE%B5%E8%81%B7%E7%BC%BA%E8%A1%A8.pdf" },
  { label: "Interview.tw｜IE 面試經驗彙整", note: "非官方、僅作題型參考；流程與題目依時間、廠區、面試官而異", href: "https://interview.tw/c/0CqR/positions/IE%E5%B7%A5%E7%A8%8B%E5%B8%AB" },
];

function Term({ children }: { children: string }) {
  const item = glossary.find((entry) => entry.term === children || entry.alias === children);
  return <button className="term" type="button" data-term={item?.term ?? children}>{children}<span aria-hidden="true">↗</span></button>;
}

export default function IngrasysPage() {
  const [activeSection, setActiveSection] = useState("company");
  const [progress, setProgress] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryItem | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);

      const readingLine = Math.min(window.innerHeight * 0.36, 300);
      let current = navItems[0].id;
      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= readingLine) current = item.id;
        else break;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) current = navItems.at(-1)?.id ?? current;
      setActiveSection((previous) => previous === current ? previous : current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-term]");
      if (!target) return;
      const item = glossary.find((entry) => entry.term === target.dataset.term);
      if (item) setSelectedTerm(item);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!selectedTerm && !glossaryOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTerm(null);
        setGlossaryOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTerm, glossaryOpen]);

  const filteredGlossary = useMemo(() => {
    const query = glossaryQuery.trim().toLocaleLowerCase("zh-Hant");
    if (!query) return glossary;
    return glossary.filter((entry) => `${entry.term} ${entry.alias ?? ""} ${entry.definition}`.toLocaleLowerCase("zh-Hant").includes(query));
  }, [glossaryQuery]);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
  };

  const copyPitch = async () => {
    const pitch = "我了解鴻佰是鴻海集團旗下的雲端基礎設施供應商，產品從伺服器、儲存、GPU 平台延伸到整櫃 AI 系統與液冷方案。對 IE 而言，AI Server 的挑戰不只在組裝效率，而是高價物料、複雜組態、測試瓶頸、NPI 爬坡與全球交付。我會以標準工時、產能模型與現場數據找出限制點，再把 Layout、線平衡或自動化方案量化成產出、品質、交期與 ROI。";
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="site ingrasys-site">
      <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <header className="topbar ing-topbar">
        <a className="brand" href="#top" aria-label="回到頁首">
          <span className="brand-mark">I</span>
          <span><b>INGRASYS</b><small>IE INTERVIEW FIELD GUIDE</small></span>
        </a>
        <nav className="desktop-nav" aria-label="主要章節">
          {navItems.map((item) => <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => scrollTo(item.id)} type="button" aria-current={activeSection === item.id ? "location" : undefined}><span>{item.short}</span>{item.label}</button>)}
        </nav>
        <div className="topbar-actions">
          <Link className="company-switch" href="/" aria-label="切換至凌華科技 IE 面試手冊">凌華</Link>
          <button className="glossary-trigger" onClick={() => setGlossaryOpen(true)} type="button"><span aria-hidden="true">⌕</span> 名詞庫</button>
        </div>
      </header>

      <section className="hero ing-hero" id="top">
        <div className="ing-rack-art" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="hero-kicker"><span>FOUNDED 2002 · FOXCONN TECHNOLOGY GROUP</span><span>IE ENGINEER / MOBILE FIRST</span></div>
        <div className="hero-content">
          <div>
            <p className="eyebrow">AI SERVER × SMART MANUFACTURING</p>
            <h1>讀懂鴻佰，<br /><em>把複雜度說成 IE 的改善價值。</em></h1>
            <p className="hero-lede">從 AI Server、整櫃液冷與燈塔工廠，到 Layout、標準工時、產能、自動化 ROI 的一頁面試作戰手冊。</p>
            <div className="hero-actions">
              <button className="primary-action" onClick={() => scrollTo("company")} type="button">開始複習 <span>↓</span></button>
              <Link className="secondary-action" href="/">查看凌華 IE 手冊 <span>↗</span></Link>
            </div>
          </div>
          <aside className="hero-brief" aria-label="公司速讀">
            <div className="status-row"><span>COMPANY SNAPSHOT</span><span className="live-dot">官方查證</span></div>
            <dl>
              <div><dt>成立</dt><dd>2002</dd></div>
              <div><dt>集團</dt><dd>Foxconn</dd></div>
              <div><dt>核心</dt><dd>AI Server</dd></div>
              <div><dt>工廠</dt><dd>13+</dd></div>
            </dl>
            <p>官方定位是全球 <strong>Cloud Infrastructure Provider</strong>；能力橫跨板卡／機構、伺服器與儲存、整櫃系統到 IT 基礎設施。</p>
          </aside>
        </div>
        <div className="hero-footnote">資料查閱：2026.07.22 · 職缺與流程以實際廠區、產品及面試官說明為準</div>
      </section>

      <section className="section" id="company">
        <header className="section-heading">
          <span className="section-no">01</span>
          <div><p className="eyebrow">KNOW THE BUSINESS</p><h2>鴻佰不是只做「伺服器組裝」</h2></div>
          <p>先說清楚公司替雲端與 AI 客戶交付什麼，再把產品特性連到 IE 工作。</p>
        </header>

        <div className="ing-positioning">
          <article className="ing-thesis">
            <span className="label">POSITIONING</span>
            <h3>雲端基礎設施的端到端供應商</h3>
            <p>鴻佰為鴻海科技集團旗下公司，產品從模組化伺服器、高效能儲存、<Term>GPU</Term> 平台，延伸到 <Term>Rack</Term>-scale AI 系統與液冷。官方也強調由零組件層級到 L10、L12 與 IT 基礎設施的垂直整合。</p>
            <div className="ing-levels"><span>L3 / L5 / L6<small>機構・板卡・滑軌</small></span><b>→</b><span><Term>L10</Term><small>Server / Storage</small></span><b>→</b><span><Term>L12</Term><small>Rack Integration</small></span><b>→</b><span>IT<small>Infrastructure</small></span></div>
          </article>
          <aside className="ing-company-proof">
            <span className="label">OFFICIAL SNAPSHOT</span>
            <div><strong>880+</strong><p>專利</p></div>
            <div><strong>1,700+</strong><p>工程師</p></div>
            <div><strong>880+</strong><p>每年板卡設計</p></div>
            <div><strong>13+</strong><p>製造據點</p></div>
            <small>來源：鴻佰官方 About 頁，查閱日 2026.07.22。</small>
          </aside>
        </div>

        <div className="subheading ing-subheading"><div><p className="label">PRODUCT MAP</p><h3>面試前要認得的四組產品</h3></div><p>不必背型號，但要知道不同產品會如何改變工站、測試、物料與成本。</p></div>
        <div className="ing-product-grid">
          <article><span>01</span><h3>Modular Server</h3><p>一般／模組化伺服器平台，依 CPU、儲存、網路與機構需求形成多種組態。</p><small>IE 連結：BOM／Routing 矩陣、換線、標準工時。</small></article>
          <article><span>02</span><h3>AI Accelerator</h3><p><Term>HGX</Term>、<Term>MGX</Term>、<Term>NVL72</Term>，以及 AMD Instinct、Intel Gaudi 等 GPU 平台。</p><small>IE 連結：高價料、功耗、散熱、壓力測試。</small></article>
          <article><span>03</span><h3>High-performance Storage</h3><p><Term>NVMe-oF</Term> 與 <Term>EBOF</Term> 等高吞吐、低延遲儲存平台。</p><small>IE 連結：網路／效能測試、長時間穩定性。</small></article>
          <article><span>04</span><h3>Rack & Liquid Cooling</h3><p>整櫃 AI 系統、<Term>DLC</Term>、<Term>CDU</Term>、<Term>RPU</Term>、<Term>RDHx</Term> 與浸沒式冷卻。</p><small>IE 連結：重件物流、配線、漏液與整櫃測試。</small></article>
        </div>

        <div className="ing-translation-strip">
          <span>產品語言</span><b>AI 算力密度提高</b><i>→</i><span>製造語言</span><b>功耗／散熱／測試複雜</b><i>→</i><span>IE 語言</span><b>重做產能模型與資源配置</b>
        </div>
      </section>

      <section className="section section-dark ing-factory" id="factory">
        <header className="section-heading">
          <span className="section-no">02</span>
          <div><p className="eyebrow">READ THE FACTORY</p><h2>AI Server 怎麼製造，瓶頸在哪裡？</h2></div>
          <p>官方智慧工廠案例提供方向；實際 Routing、測試與責任邊界仍依廠區與產品而異。</p>
        </header>

        <article className="lighthouse-card">
          <div><p className="label">TAOYUAN NANCHING / LIGHTHOUSE FACTORY</p><h3>把數位系統接成製造決策閉環</h3><p>官方說明自研 <Term>DMS</Term> 串聯 IoT、AI 與系統，並將 <Term>APS</Term>、<Term>ERP</Term>、<Term>WMS</Term>、<Term>AGV</Term> 導入排程與 <Term>JIT</Term> 供料；再由 DMS／<Term>MES</Term> 收集製程資料、監控品質、安全與綠色生產。</p></div>
          <div className="lighthouse-flow"><span>ORDER<small>ERP</small></span><i>→</i><span>PLAN<small>APS</small></span><i>→</i><span>MATERIAL<small>WMS · AGV</small></span><i>→</i><span>EXECUTE<small>MES · DMS</small></span><i>→</i><span>IMPROVE<small>AI · ANALYTICS</small></span></div>
        </article>

        <div className="official-metrics">
          <div><strong>+73%</strong><span>生產效率</span></div>
          <div><strong>−97%</strong><span>產品缺陷率</span></div>
          <div><strong>−21%</strong><span>交付時間</span></div>
          <div><strong>−39%</strong><span>單位製造成本</span></div>
        </div>
        <p className="metric-caveat">上列為鴻佰 2023 年燈塔工廠新聞稿公開的導入成果，不代表所有廠區或目前即時績效；面試時可用來理解數位製造方向，不宜當成職缺 KPI。</p>

        <div className="subheading"><div><p className="label">GENERIC MANUFACTURING VIEW</p><h3>AI Server 常見製造主流程</h3></div><p>這是面試準備用的通用流程，不是鴻佰內部 SOP。</p></div>
        <div className="ing-process">
          {["備料／齊套", "機構與板卡組裝", "CPU／GPU／記憶體／儲存安裝", "配線／供電／散熱組裝", "BIOS／BMC／Firmware", "系統功能測試", "燒機／壓力測試", "Rack Integration", "網路／電力／液冷／漏液測試", "包裝出貨"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b></div>)}
        </div>

        <div className="ing-risk-grid">
          {[
            ["高價與受限料件", "GPU／CPU／高速網卡需做齊套、防錯、序號與責任追溯。"],
            ["組態矩陣", "不同 BOM、韌體、配線與測試腳本增加標準工時維護難度。"],
            ["測試成為瓶頸", "燒機與壓力測試占用設備、電力、網路與空間，不能只算人工。"],
            ["液冷與高功率", "接頭、扭力、流量、壓差、漏液與安全驗證改變工站設計。"],
            ["整櫃物流", "重量、轉彎半徑、地板載重、包裝與搬運設備都要進 Layout。"],
            ["NPI 速度", "新平台迭代快，工法、治具、程式與標準工時要跟著版本爬坡。"],
          ].map(([title, copy]) => <article key={title}><h4>{title}</h4><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="section" id="role">
        <header className="section-heading">
          <span className="section-no">03</span>
          <div><p className="eyebrow">DECODE THE ROLE</p><h2>IE 工程師：高效製造體系的建築師</h2></div>
          <p>公開職缺的共同核心是：用科學化工程分析，定義 AI Server 生產線的營運標準。</p>
        </header>

        <div className="role-evidence">
          <article><span className="source-badge">目前公開職缺 · NQ</span><h3>Layout × 人力設備最佳配置</h3><p>104 公開職缺描述強調，IE 從 Layout 到人力、設備最佳配置，以數據影響獲利與全球交付。</p><a href={sources[7].href} target="_blank" rel="noreferrer">查看公開搜尋結果 ↗</a></article>
          <article><span className="source-badge">目前公開職缺 · DN</span><h3>瓶頸改善 × 自動化規劃</h3><p>公開職缺摘要包含生產問題分析、國外客戶溝通、自動化生產規劃，以及製程瓶頸改善與優化。</p><a href="https://www.104.com.tw/jobs/search/?area=6001005000%2C6001006000%2C6001007000&keyword=IE" target="_blank" rel="noreferrer">查看公開搜尋結果 ↗</a></article>
          <article><span className="source-badge">公開實習職務資料</span><h3>標準工時 × 現場改善</h3><p>中原工工系公開附件列出標準工時維護、現場量測與改善、5S、專案資料蒐集及推動追蹤。</p><a href={sources[8].href} target="_blank" rel="noreferrer">查看公開附件 ↗</a></article>
        </div>
        <p className="source-note ing-source-note">職缺名稱、廠區與內容會變動；以上為 2026.07.22 查閱到的公開資訊摘要，不推定任何未公開的內部權責。</p>

        <div className="subheading"><div><p className="label">IE OPERATING SYSTEM</p><h3>把職責拆成六個可準備的模組</h3></div><p>每一格都要能說出「資料 → 分析 → 決策 → 指標」。</p></div>
        <div className="ie-module-grid">
          {[
            ["01", "標準工時與人力", "時間研究、寬放、版本維護、Earned Hours、人力模型。"],
            ["02", "Layout 與物流", "From-To、Spaghetti、線邊庫、AGV、ESD、安全與擴充。"],
            ["03", "產能與線平衡", "Takt、CT、UPH、瓶頸、測試槽位、產品組合與情境分析。"],
            ["04", "NPI 與量產爬坡", "工序、治具、工時、技能、資料欄位、問題清單與量產移轉。"],
            ["05", "數位製造", "MES／DMS 資料定義、Dashboard、異常預警、閉環與跨廠複製。"],
            ["06", "自動化與 ROI", "需求、Cycle、良率、CapEx、維護、驗收、備援與回收期。"],
          ].map(([no, title, copy]) => <article key={no}><span>{no}</span><h4>{title}</h4><p>{copy}</p></article>)}
        </div>

        <article className="capacity-example">
          <div><p className="label">CAPACITY THINKING</p><h3>被問「怎麼估產能」時，先拆約束</h3></div>
          <div className="capacity-formula"><span>需求節拍</span><b>可用時間 ÷ 需求量</b><i>vs.</i><span>有效產能</span><b>min（人力、設備、測試、物料）</b></div>
          <p>先依產品族與組態建立標準工時，再把良率、換線、設備稼動、缺料與測試槽位加入情境模型。AI Server 最慢的限制點常不在總裝站，因此不能用「人數 × 工時」直接推全線產出。</p>
        </article>

        <div className="kpi-levels ing-kpis">
          <div><span className="level-tag">FLOW</span><h4>流動與產能</h4><ul><li><Term>UPH</Term>／CT／Takt</li><li>線平衡率／瓶頸負荷</li><li>WIP／Lead Time</li></ul></div>
          <div><span className="level-tag">QUALITY</span><h4>品質與測試</h4><ul><li><Term>FPY</Term>／重工／重測</li><li>測試設備利用率／OEE</li><li>缺陷與版本錯置</li></ul></div>
          <div><span className="level-tag">BUSINESS</span><h4>交付與財務</h4><ul><li>OTD／排程達成</li><li>Labor efficiency／Cost per unit</li><li>自動化 <Term>ROI</Term></li></ul></div>
        </div>
      </section>

      <section className="section section-paper" id="interview">
        <header className="section-heading">
          <span className="section-no">04</span>
          <div><p className="eyebrow">LAND THE INTERVIEW</p><h2>把方法變成有數字的答案</h2></div>
          <p>準備三個案例、一段公司理解，並用反問題確認職缺的實際任務與資源。</p>
        </header>

        <div className="interview-signal">
          <span>非官方經驗提醒</span><p>公開面試經驗曾出現英文／性向測驗，以及 UPH、排程、數位轉型專案、自我介紹與職務理解等題型。這些只適合用來擴大準備範圍，不能視為固定流程或題庫。</p>
        </div>

        <div className="case-deck ing-case-deck">
          {[
            { no: "CASE 01", title: "Layout／建線", metrics: "距離 · 面積 · 產能 · WIP · 安全", prompts: ["產品與產能需求如何轉成站數？", "如何納入 Rack、液冷與高價料？", "方案怎麼比較與 Pilot？", "搬遷／建線風險如何控管？"] },
            { no: "CASE 02", title: "測試瓶頸／效率", metrics: "UPH · CT · FPY · Lead Time", prompts: ["怎麼證明真正瓶頸？", "如何拆產品組合與等待？", "採並行、治具或排程哪一種？", "成果如何維持與監控？"] },
            { no: "CASE 03", title: "自動化／數位化", metrics: "CapEx · 節省 · 品質 · ROI", prompts: ["原流程與痛點有多大？", "需求與驗收條件如何定義？", "維護與異常備援怎麼做？", "如何量化財務與非財務收益？"] },
          ].map((item) => <article className="case-card" key={item.no}><span className="case-no">{item.no}</span><h3>{item.title}</h3><p className="case-metrics">{item.metrics}</p><ol>{item.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></article>)}
        </div>

        <div className="answer-framework">
          <div><p className="label">ANSWER LOOP</p><h3>每題都留下可驗證的證據鏈</h3></div>
          <div className="answer-track"><span><i>01</i>情境／目標</span><b>→</b><span><i>02</i>數據／限制</span><b>→</b><span><i>03</i>分析／方案</span><b>→</b><span><i>04</i>協作／落地</span><b>→</b><span><i>05</i>成果／維持</span></div>
        </div>

        <article className="pitch-card ing-pitch">
          <div className="pitch-head"><div><p className="label">60-SECOND COMPANY PITCH</p><h3>公司理解說法</h3></div><button type="button" onClick={copyPitch} aria-live="polite">{copied ? "已複製 ✓" : "複製回答"}</button></div>
          <blockquote>我了解鴻佰是鴻海集團旗下的雲端基礎設施供應商，產品從伺服器、儲存、GPU 平台延伸到整櫃 AI 系統與液冷方案。對 IE 而言，AI Server 的挑戰不只在組裝效率，而是高價物料、複雜組態、測試瓶頸、NPI 爬坡與全球交付。我會以標準工時、產能模型與現場數據找出限制點，再把 Layout、線平衡或自動化方案量化成產出、品質、交期與 ROI。</blockquote>
          <p className="pitch-note">把最後一句換成你的真實案例與數字；若沒有 AI Server 經驗，就說明可移轉的方法，不要假裝做過。</p>
        </article>

        <div className="question-groups ing-question-groups">
          {[
            ["廠區與產品", ["此職缺主要支援 L10、L12，或自動化／系統專案？", "目前主要產品族與量產／NPI 比例為何？", "最常限制產出的資源是總裝、測試、液冷還是物料？"]],
            ["IE 任務", ["前三個月優先任務是標準工時、Layout、產能，還是系統改善？", "IE 是否負責報價工時與設備投資評估？", "標準工時與產能模型目前如何維護與稽核？"]],
            ["數據與系統", ["可取得哪些 MES、DMS、設備與財務資料？", "資料定義與 Dashboard 由 IE、IT 或製造共同維護？", "發現異常後，是否有固定改善與追蹤機制？"]],
            ["權限與成功", ["此職位能調動哪些人力、設備與跨部門資源？", "第一年最重要的三個衡量指標是什麼？", "目前最想解決但仍卡住的製造問題是什麼？"]],
          ].map(([title, questions]) => <details key={title as string}><summary><span>{title as string}</span><span>{(questions as string[]).length} 題 ＋</span></summary><ul>{(questions as string[]).map((question) => <li key={question}>{question}</li>)}</ul></details>)}
        </div>

        <article className="checklist ing-checklist">
          <div><p className="label">FINAL CHECK</p><h3>面試前一晚確認 8 件事</h3></div>
          <div className="checklist-items">
            {["能用 30 秒說明鴻佰定位", "知道 L10 與 L12 的差別但會先確認定義", "能畫出 AI Server 通用製造流程", "說得出測試為何可能是瓶頸", "Layout 案例包含高價料、Rack 與安全", "標準工時／產能模型有版本與產品組合", "自動化案例能計算 ROI 並說明維護", "已選好 5 題反問題"].map((item) => <label key={item}><input type="checkbox" /><span>{item}</span></label>)}
          </div>
        </article>
      </section>

      <section className="sources section ing-sources">
        <div className="subheading"><div><p className="label">SOURCES & SCOPE</p><h2>資料來源與使用界線</h2></div><p>公司事實以鴻佰官方資料為主；職務以公開招募資訊交叉比對；製造流程與面試框架屬通用專業準備。</p></div>
        <div className="source-list">
          {sources.map((source, index) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{source.label}</b><small>{source.note}</small></div><i>↗</i></a>)}
        </div>
        <p className="source-note">本站不是鴻佰科技官方招募頁，與鴻佰／鴻海無隸屬或背書關係。實際組織、流程、產品、職責、測驗與面試題目請以公司最新公告及面試官說明為準；面試經驗網站僅作題型參考。</p>
      </section>

      <footer><span>INGRASYS IE INTERVIEW FIELD GUIDE</span><span>Research-backed · Mobile-first · 2026</span></footer>

      <nav className="mobile-nav" aria-label="手機章節導覽">
        {navItems.map((item) => <button className={activeSection === item.id ? "active" : ""} onClick={() => scrollTo(item.id)} type="button" key={item.id} aria-current={activeSection === item.id ? "location" : undefined}><span>{item.short}</span>{item.label}</button>)}
        <button onClick={() => setGlossaryOpen(true)} type="button"><span>⌕</span>名詞</button>
      </nav>

      {selectedTerm && (
        <div className="overlay" role="presentation" onMouseDown={() => setSelectedTerm(null)}>
          <section className="term-sheet" role="dialog" aria-modal="true" aria-labelledby="ing-term-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheet-handle" aria-hidden="true" />
            <button className="sheet-close" onClick={() => setSelectedTerm(null)} type="button" aria-label="關閉名詞解釋">×</button>
            <span className="category-tag">{selectedTerm.category}</span>
            <h2 id="ing-term-title">{selectedTerm.term}</h2>
            {selectedTerm.alias && <p className="term-alias">{selectedTerm.alias}</p>}
            <p className="term-definition">{selectedTerm.definition}</p>
            <div className="interview-connection"><span>IE 面試連結</span><p>{selectedTerm.interview}</p></div>
            <button className="browse-all" onClick={() => { setGlossaryQuery(""); setSelectedTerm(null); setGlossaryOpen(true); }} type="button">瀏覽完整名詞庫 →</button>
          </section>
        </div>
      )}

      {glossaryOpen && (
        <div className="overlay glossary-overlay" role="presentation" onMouseDown={() => setGlossaryOpen(false)}>
          <section className="glossary-panel" role="dialog" aria-modal="true" aria-labelledby="ing-glossary-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="glossary-head"><div><p className="label">AI SERVER × IE</p><h2 id="ing-glossary-title">鴻佰專業名詞庫</h2></div><button onClick={() => setGlossaryOpen(false)} type="button" aria-label="關閉名詞庫">×</button></div>
            <label className="glossary-search"><span>⌕</span><input autoFocus value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="搜尋 GPU、L12、DMS、CDU…" /></label>
            <p className="glossary-count">{filteredGlossary.length} / {glossary.length} TERMS</p>
            <div className="glossary-list">
              {filteredGlossary.map((item) => <button key={item.term} type="button" onClick={() => { setGlossaryOpen(false); setSelectedTerm(item); }}><span className="category-tag">{item.category}</span><div><b>{item.term}</b>{item.alias && <small>{item.alias}</small>}<p>{item.definition}</p></div><i>→</i></button>)}
              {filteredGlossary.length === 0 && <div className="empty-state">找不到相符名詞，試試英文縮寫或較短關鍵字。</div>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
