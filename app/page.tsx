"use client";

import { useEffect, useMemo, useState } from "react";

type GlossaryItem = {
  term: string;
  alias?: string;
  category: "運算" | "製造" | "IE" | "成本" | "管理";
  definition: string;
  interview: string;
};

const glossary: GlossaryItem[] = [
  { term: "GPU", alias: "Graphics Processing Unit", category: "運算", definition: "擅長大量平行運算的處理器。除了繪圖，也常用來加速 AI 模型推論、影像處理與科學運算。", interview: "工業 AI 平台導入 GPU 後，除了料件成本，還要同步評估功耗、散熱、燒機與測試時間。" },
  { term: "邊緣運算", alias: "Edge Computing", category: "運算", definition: "把資料處理放在資料產生處附近，例如機器、車輛或工廠現場，而非全部傳回遠端雲端。", interview: "優點是低延遲、較少頻寬需求，也能在網路不穩時維持關鍵功能。" },
  { term: "邊緣 AI", alias: "Edge AI", category: "運算", definition: "直接在邊緣設備執行 AI 推論，例如在產線旁即時判定瑕疵。", interview: "面試時可連結到高價料件、散熱、版本管理與測試覆蓋率。" },
  { term: "Physical AI", alias: "實體 AI", category: "運算", definition: "讓 AI 不只生成資訊，還能透過機器人、車輛或設備感知環境、推理並執行實體動作。", interview: "它把即時性、功能安全、感測器整合與硬體可靠度推到更高層級。" },
  { term: "嵌入式系統", alias: "Embedded System", category: "運算", definition: "為特定設備或任務設計的運算系統，通常整合在更大的機器內，不以一般個人電腦形式出現。", interview: "重點常是尺寸、功耗、I/O、可靠度與長期供貨，而非只追求最高效能。" },
  { term: "工業電腦", alias: "IPC", category: "運算", definition: "針對工廠或嚴苛環境設計的電腦，著重長時間運作、耐候、擴充與長生命週期。", interview: "凌華官方 IPC 頁面強調 24/7、國際認證、預驗證 I/O 與長期供貨。" },
  { term: "Computer-on-Module", alias: "COM", category: "運算", definition: "把處理器、記憶體等核心運算功能做成標準化模組，再與客製載板組合。", interview: "可縮短客戶開發時間，也讓產品升級與客製化更有彈性。" },
  { term: "COTS", alias: "Commercial Off-The-Shelf", category: "運算", definition: "可直接採購、已有標準規格的商用現貨產品，與完全客製設計相對。", interview: "凌華同時提供 COTS 與客製服務，製造端需處理標準化和客製需求並存。" },
  { term: "IoT Gateway", alias: "物聯網閘道器", category: "運算", definition: "連接現場設備與上層系統的中介設備，常負責協定轉換、資料彙整與初步運算。", interview: "可把它理解為 OT 現場與 IT／雲端之間的橋梁。" },
  { term: "I/O", alias: "Input / Output", category: "運算", definition: "設備與外界交換訊號的輸入／輸出介面，例如網路、USB、序列埠、數位或類比訊號。", interview: "工業產品的 I/O 組合與相容性往往比消費型電腦更多、更客製。" },
  { term: "EtherCAT", category: "運算", definition: "以乙太網路為基礎的即時工業通訊技術，常用於多軸運動控制與自動化設備。", interview: "IE 不必講協定底層，但要知道它與設備同步、控制架構和測試需求有關。" },
  { term: "PXI / PXIe", category: "運算", definition: "模組化測試與量測平台標準，結合機箱、控制器與量測模組，PXIe 採用 PCI Express。", interview: "常見於半導體、電子與自動化測試；需注意機箱、模組配置與測試產能。" },
  { term: "DAQ", alias: "Data Acquisition", category: "運算", definition: "資料擷取：把感測器或現場的類比／數位訊號收集並轉成可分析資料。", interview: "可連結到量測精度、取樣率、通道數與自動化檢測。" },
  { term: "AMR", alias: "Autonomous Mobile Robot", category: "運算", definition: "能感知環境並自行規劃路徑的自主移動機器人，與沿固定路線的傳統 AGV 不完全相同。", interview: "需要低延遲感知、控制與高可靠度邊緣運算。" },
  { term: "SMT", alias: "Surface Mount Technology", category: "製造", definition: "表面黏著技術：將電子元件貼裝於 PCB 表面，核心步驟包括錫膏印刷、貼片與回焊。", interview: "高混低量時需關注換線、鋼板、料站準備、程式版本與首件確認。" },
  { term: "AOI", alias: "Automated Optical Inspection", category: "製造", definition: "自動光學檢查，透過相機與影像演算法檢查焊點、元件位置或外觀缺陷。", interview: "要看誤判率、漏判率與瓶頸，而不只看設備是否存在。" },
  { term: "ICT", alias: "In-Circuit Test", category: "製造", definition: "電路內測試，透過治具量測 PCBA 上的電性與元件連接狀態。", interview: "治具投資、程式開發與測試節拍都會進入成本模型。" },
  { term: "PCBA", alias: "Printed Circuit Board Assembly", category: "製造", definition: "已完成元件組裝與焊接的印刷電路板；PCB 則通常指尚未裝件的裸板。", interview: "系統組裝前常會先完成 PCBA 功能測試。" },
  { term: "DIP", alias: "插件製程", category: "製造", definition: "將穿孔元件插入 PCB，再以波焊或手焊完成連接的製程。", interview: "常涉及人工平衡、防呆、焊接品質與治具設計。" },
  { term: "ESD", alias: "Electrostatic Discharge", category: "製造", definition: "靜電放電。電子元件可能因人體或物料帶電而受損，因此需規劃接地、工作站與管制動線。", interview: "Layout 不能只看物流最短，也要保留 ESD 區域邏輯。" },
  { term: "燒機測試", alias: "Burn-in", category: "製造", definition: "讓產品在特定負載或環境下持續運作，以提早暴露早期失效或穩定性問題。", interview: "它可能不吃很多直接人工，卻大量占用空間、電力與設備時間。" },
  { term: "NPI", alias: "New Product Introduction", category: "製造", definition: "新產品從設計走向試產、驗證與量產的導入流程。", interview: "高技術更新速度下，NPI 會影響試產資源、變更管理、良率爬坡與報價準確度。" },
  { term: "WIP", alias: "Work in Process", category: "IE", definition: "製程中的在製品。過多 WIP 會占空間、增加等待與掩蓋瓶頸。", interview: "Layout 與產能改善後，應同時觀察 WIP 與 Lead Time，而非只看單站產量。" },
  { term: "Lead Time", alias: "前置時間", category: "IE", definition: "從某個起點到完成交付所需的總時間，通常包含加工、等待、搬運與排隊。", interview: "縮短真正有價值的方式通常是減少等待與排隊，不只是加快作業動作。" },
  { term: "Routing", alias: "製程途程", category: "IE", definition: "產品依序經過哪些製程、工作站與資源的路徑。", interview: "Layout 規劃前要先按產品族分析 Routing，避免平均值掩蓋差異。" },
  { term: "VSM", alias: "Value Stream Mapping", category: "IE", definition: "價值流程圖：呈現資訊流、物流、加工時間、等待與庫存，用來找出整體改善機會。", interview: "適合把跨站問題拉到端到端流程檢視。" },
  { term: "Spaghetti Diagram", alias: "義大利麵圖", category: "IE", definition: "把人員或物料實際移動路徑畫在平面圖上，以找出繞行、交叉與重複搬運。", interview: "最好量化搬運距離、次數與風險，再比較改善前後。" },
  { term: "From-To Chart", category: "IE", definition: "用矩陣整理各區域之間的搬運量或移動次數，協助判斷哪些站點應相鄰。", interview: "可把『覺得動線很亂』轉成可比較的數據。" },
  { term: "Pilot", alias: "小規模驗證", category: "IE", definition: "在全面導入前，先以小批量、局部區域或模擬方式驗證方案。", interview: "應預先設定產出、品質、人力負荷與供料等通過標準。" },
  { term: "OEE", alias: "Overall Equipment Effectiveness", category: "管理", definition: "設備綜合效率，通常為稼動率 × 性能效率 × 良率。", interview: "高混低量不能只用 OEE 管全廠；換線、產品複雜度與排程條件也要拆開看。" },
  { term: "MTBF", alias: "Mean Time Between Failures", category: "管理", definition: "平均故障間隔，用來觀察可修復設備兩次故障之間的平均運作時間。", interview: "與 MTTR 搭配，分別看可靠度和修復能力。" },
  { term: "MTTR", alias: "Mean Time To Repair", category: "管理", definition: "平均修復時間，反映故障發生後恢復運作的速度。", interview: "可透過備品、標準維修流程與故障診斷縮短。" },
  { term: "FPY", alias: "First Pass Yield", category: "管理", definition: "一次通過率：產品不經重工就一次通過某製程或測試的比例。", interview: "FPY 比最終良率更能揭露隱藏重工。" },
  { term: "Earned Hours", alias: "賺得工時", category: "管理", definition: "實際完成數量乘以標準工時，用來把不同複雜度產品換算成可比較的標準產出。", interview: "高混低量產線比單看件數更公平，但前提是標準工時可信且持續維護。" },
  { term: "OTD", alias: "On-Time Delivery", category: "管理", definition: "準時交貨率，衡量是否在承諾日期前完成交付。", interview: "需先定義以訂單、訂單行或數量計算，避免部門各說各話。" },
  { term: "OTIF", alias: "On Time In Full", category: "管理", definition: "準時且足量交付；不只看日期，也確認數量完整。", interview: "比單純 OTD 更能反映客戶真正收到完整訂單的體驗。" },
  { term: "COPQ", alias: "Cost of Poor Quality", category: "成本", definition: "不良品質成本，例如報廢、重工、退貨、保固、停線與客訴處理。", interview: "把品質問題轉成金額，較容易排定改善優先順序。" },
  { term: "成本動因", alias: "Cost Driver", category: "成本", definition: "真正造成資源消耗與成本發生的因素，例如測試工時、機時、換線次數或批量。", interview: "用合適動因分攤，能降低簡單產品補貼複雜產品的交叉補貼。" },
  { term: "CapEx", alias: "Capital Expenditure", category: "成本", definition: "資本支出，用於取得或改善可使用多期的資產，例如設備、廠房與大型系統。", interview: "通常需評估投資回收期、產能需求與折舊影響。" },
  { term: "OpEx", alias: "Operating Expenditure", category: "成本", definition: "營運支出，例如租金、維修、耗材、人力與日常服務費。", interview: "改善案不能只看 CapEx 低，也要比較全生命週期 OpEx。" },
  { term: "ERP", alias: "Enterprise Resource Planning", category: "管理", definition: "企業資源規劃系統，整合訂單、物料、庫存、採購、成本與財務等資料。", interview: "IE 需要理解資料定義與來源，不能只拿報表結果。" },
  { term: "MES", alias: "Manufacturing Execution System", category: "管理", definition: "製造執行系統，追蹤工單、站點、在製品、工時、設備與品質等現場資訊。", interview: "可與 ERP、設備資料交叉核對，建立從現場到財務的證據鏈。" },
];

const sources = [
  { label: "凌華官方｜關於凌華", note: "公司定位、1995 年成立、規模、總部、COTS 與長生命週期", href: "https://www.adlinktech.com/tw/aboutus" },
  { label: "凌華官方｜IPC Systems", note: "24/7、國際認證、I/O 生態、長期供貨", href: "https://www.adlinktech.com/en/industrial-pc-systems.aspx" },
  { label: "凌華官方｜Robotics & Physical AI", note: "AMR、機器人控制器、Edge AI 平台與 COM 產品", href: "https://www.adlinktech.com/en/robotics-physical-ai" },
  { label: "凌華官方｜Motion Control", note: "EtherCAT、運動控制、遠端 I/O 與工業自動化", href: "https://www.adlinktech.com/en/motion_control" },
  { label: "凌華官方｜Data Acquisition", note: "DAQ 產品與工業資料擷取應用", href: "https://www.adlinktech.com/en/data_acquisition" },
  { label: "凌華官方｜Machine Vision", note: "影像擷取卡、嵌入式視覺與 AI 智慧相機", href: "https://www.adlinktech.com/en/Machine_Vision" },
  { label: "凌華官方｜PXI / PXIe", note: "模組化測試量測平台與應用", href: "https://www.adlinktech.com/en/pxi_pxie.aspx" },
  { label: "凌華官方｜COMPUTEX 2026", note: "Physical AI、Agentic Edge、醫療影像與智慧製造方向", href: "https://www.adlinktech.com/en/News/adlink-computex-2026" },
  { label: "凌華官方｜NVIDIA Thor 平台", note: "Jetson Thor、IGX Thor、工業機器人與醫療影像", href: "https://www.adlinktech.com/en/News/adlink-edge-ai-platforms-nvidia-thor" },
  { label: "凌華官方｜IEC 62443-4-1", note: "工業控制系統安全開發流程認證", href: "https://www.adlinktech.com/tw/companynews?page=1" },
];

const processSteps = ["備料", "錫膏印刷", "SMT 貼片", "回焊", "AOI", "ICT", "DIP 插件", "波焊／手焊", "PCBA 功測", "系統組裝", "燒機", "整機測試", "包裝出貨"];

const questionGroups = [
  { title: "職缺定位", questions: ["這是新增職位，還是補缺？", "直屬主管與 IE 團隊規模為何？", "工作比重偏現場改善、製造企劃，還是成本管理？"] },
  { title: "Layout 與產線", questions: ["重規劃主因是搬廠、擴產、產品轉型，還是效率改善？", "工廠範圍含 PCBA、系統組裝或整機測試哪些段落？", "產線依產品別、製程別，還是混線生產？"] },
  { title: "成本模型", questions: ["目前製造費用依什麼基礎分攤？", "報價與實際成本落差主要來自哪些項目？", "此職位是提供資料，還是主導成本模型設計？"] },
  { title: "KPI 與權限", questions: ["KPI 由總部制定，還是工廠可重新設計？", "可取得哪些 ERP、MES、財務與生產資料？", "發現問題後，能調動哪些人力、設備與跨部門資源？"] },
  { title: "成功標準", questions: ["到職前三個月最重要的任務是什麼？", "第一年的成功標準是什麼？", "過去一年最想改善但尚未解決的是什麼？"] },
];

const navItems = [
  { id: "company", label: "公司", short: "01" },
  { id: "role", label: "職務", short: "02" },
  { id: "playbook", label: "方法", short: "03" },
  { id: "interview", label: "面試", short: "04" },
];

function Term({ children }: { children: string }) {
  const item = glossary.find((entry) => entry.term === children || entry.alias === children);
  return (
    <button className="term" type="button" data-term={item?.term ?? children}>
      {children}<span aria-hidden="true">↗</span>
    </button>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("company");
  const [progress, setProgress] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryItem | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [sprintMode, setSprintMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("adlink-sprint-mode", String(sprintMode));
  }, [sprintMode]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const sections = navItems
        .map(({ id }) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);
      if (sections.length === 0) return;

      // The chapter crossing this reading line is treated as the current one.
      // A fixed upper bound keeps the behavior predictable on tall phone screens.
      const readingLine = Math.min(window.innerHeight * 0.36, 300);
      let current = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= readingLine) current = section.id;
        else break;
      }

      const reachedPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      if (reachedPageEnd) current = sections.at(-1)?.id ?? current;
      setActiveSection((previous) => previous === current ? previous : current);
    };

    const scheduleUpdate = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame);
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTerm(null);
        setGlossaryOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const copyPitch = async () => {
    const pitch = "我了解凌華不是消費性電腦公司，而是以工業電腦、嵌入式運算、自動化控制與邊緣 AI 平台為主的 B2B 公司。這類產品具有高混低量、客製化與長生命週期特性，因此 IE 的價值不只是改善單站工時，而是整合產品組合、產能、Layout、測試資源、成本動因與工廠 KPI。我會從現場數據出發，把改善轉換成產能、成本、投資效益與管理決策。";
    await navigator.clipboard.writeText(pitch);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className={sprintMode ? "site sprint-mode" : "site"}>
      <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到頁首">
          <span className="brand-mark">A</span>
          <span><b>ADLINK</b><small>INTERVIEW FIELD GUIDE</small></span>
        </a>
        <nav className="desktop-nav" aria-label="主要章節">
          {navItems.map((item) => (
            <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => scrollTo(item.id)} type="button" aria-current={activeSection === item.id ? "location" : undefined}>
              <span>{item.short}</span>{item.label}
            </button>
          ))}
        </nav>
        <button className="glossary-trigger" onClick={() => setGlossaryOpen(true)} type="button">
          <span aria-hidden="true">⌕</span> 名詞庫
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-kicker"><span>6166 · TAOYUAN</span><span>2026 / INTERVIEW PREP</span></div>
        <div className="hero-content">
          <div>
            <p className="eyebrow">INDUSTRIAL ENGINEERING × EDGE AI</p>
            <h1>讀懂凌華，<br /><em>說出 IE 的商業價值。</em></h1>
            <p className="hero-lede">從公司產品、電子製造流程，到 Layout、成本模型與 KPI 的一頁面試作戰手冊。</p>
            <div className="hero-actions">
              <button className="primary-action" onClick={() => scrollTo("company")} type="button">開始複習 <span>↓</span></button>
              <button className={sprintMode ? "mode-toggle active" : "mode-toggle"} onClick={() => setSprintMode((value) => !value)} type="button" aria-pressed={sprintMode}>
                <span className="toggle-dot" />{sprintMode ? "衝刺模式 ON" : "開啟 10 分鐘衝刺"}
              </button>
            </div>
          </div>
          <aside className="hero-brief" aria-label="公司速讀">
            <div className="status-row"><span>COMPANY SNAPSHOT</span><span className="live-dot">已查證</span></div>
            <dl>
              <div><dt>成立</dt><dd>1995</dd></div>
              <div><dt>員工</dt><dd>1,650+</dd></div>
              <div><dt>定位</dt><dd>Edge AI</dd></div>
              <div><dt>模式</dt><dd>B2B</dd></div>
            </dl>
            <p>官方定位已由「工業電腦供應商」推進到 <strong>Leading Edge AI Computing</strong>，但底層競爭力仍是工業級可靠度、整合與長期供貨。</p>
          </aside>
        </div>
        <div className="hero-footnote">資料更新：2026.07 · 公司事實以官方公開資料為準</div>
      </section>

      <section className="section" id="company">
        <header className="section-heading">
          <span className="section-no">01</span>
          <div><p className="eyebrow">KNOW THE BUSINESS</p><h2>公司與產業定位</h2></div>
          <p>先回答「凌華替誰解決什麼問題」，再談產品名稱。</p>
        </header>

        <div className="positioning-grid">
          <article className="positioning-statement">
            <p className="label">一句話定位</p>
            <blockquote>凌華提供可長期部署在真實設備與嚴苛環境中的<strong>工業級運算、控制與邊緣 AI 平台</strong>，服務設備商與企業客戶，而非一般消費者。</blockquote>
            <div className="fact-strip">
              <span>總部：桃園龜山</span><span>股票：6166</span><span>成立：1995</span><span>全球 B2B</span>
            </div>
          </article>
          <article className="industry-character">
            <p className="label">工業市場的四個關鍵字</p>
            <div className="character-list">
              <div><b>高混低量</b><span>SKU 多、單一品項量不一定大，排程與換線複雜。</span></div>
              <div><b>高度客製</b><span>CPU、GPU、I/O、散熱、機構與認證依客戶變動。</span></div>
              <div><b>長生命週期</b><span>官方說明依產品／協議提供約 5–10 年生命週期管理。</span></div>
              <div><b>關鍵任務</b><span>醫療、交通、半導體等停機成本高，品質優先於單純速度。</span></div>
            </div>
          </article>
        </div>

        <div className="product-map">
          <article><span className="product-index">A</span><h3>嵌入式與工業運算</h3><p>工業電腦、無風扇系統、主機板、SBC、<Term>Computer-on-Module</Term>、Panel PC、Gateway。</p><small>價值：可靠、長供貨、完整 I/O、容易整合</small></article>
          <article><span className="product-index">B</span><h3>邊緣 AI 與機器人</h3><p>NVIDIA Jetson／IGX 平台、<Term>GPU</Term> 伺服器、AI 相機、機器人控制器與裝置端模型推論。</p><small>價值：低延遲、即時感知、現場自治</small></article>
          <article><span className="product-index">C</span><h3>自動化、視覺與量測</h3><p><Term>EtherCAT</Term> 運動控制、<Term>DAQ</Term>、影像擷取、工業相機、遠端 I/O、<Term>PXI / PXIe</Term>。</p><small>價值：把感測、量測、控制與運算串起來</small></article>
          <article><span className="product-index">D</span><h3>垂直產業方案</h3><p>半導體、智慧製造、醫療、鐵路、車載、自主系統、航太國防、博弈與網通。</p><small>價值：認證、領域知識與完整方案整合</small></article>
        </div>

        <details className="deep-dive">
          <summary><span>為什麼不是「賣電腦」這麼簡單？</span><span>展開分析</span></summary>
          <div className="deep-dive-content cols-2">
            <div><h3>一般消費性電腦</h3><ul><li>規格與價格透明</li><li>量大、改款快</li><li>使用環境相對可控</li><li>故障通常影響單一使用者</li></ul></div>
            <div><h3>凌華的工業平台</h3><ul><li>需整合設備、感測器與工業協定</li><li>長供貨、客製、認證與版本控管</li><li>需應對高低溫、震動、粉塵或有限空間</li><li>故障可能造成停線、誤診或交通風險</li></ul></div>
          </div>
        </details>

        <article className="strategy-radar">
          <div className="strategy-copy">
            <p className="label">2026 STRATEGY RADAR</p>
            <h3>從 Edge AI 走向 <Term>Physical AI</Term></h3>
            <p>2026 年官方訊息聚焦 NVIDIA Jetson Thor／IGX Thor、機器人、醫療影像、無人載具、Agentic Edge 與智慧製造。這不是只換更快晶片，而是把 AI 放進會感知與行動的真實設備。</p>
          </div>
          <div className="strategy-impact">
            <div><span>01</span><b>高價料件與庫存風險</b><p>GPU、記憶體與高速儲存提高單機價值。</p></div>
            <div><span>02</span><b>散熱與電源更複雜</b><p>高運算負載改變機構、測試與設備需求。</p></div>
            <div><span>03</span><b>測試時間與覆蓋增加</b><p>AI、影像、穩定性與功能安全皆需驗證。</p></div>
            <div><span>04</span><b>NPI 頻率提高</b><p>快速晶片世代與客戶長供貨要求同時存在。</p></div>
          </div>
        </article>
      </section>

      <section className="section section-dark" id="role">
        <header className="section-heading">
          <span className="section-no">02</span>
          <div><p className="eyebrow">READ THE ROLE</p><h2>這個 IE 職位真正要做什麼</h2></div>
          <p>依你提供的職務內容判讀：它更接近工廠經營幕僚／製造企劃。</p>
        </header>

        <div className="role-equation" aria-label="職務構成">
          <span>工業工程</span><i>＋</i><span>成本管理</span><i>＋</i><span>營運績效</span><i>＝</i><strong>OPERATIONAL EXCELLENCE</strong>
        </div>

        <div className="signal-table">
          <div className="table-head"><span>JD 訊號</span><span>工作本質</span><span>面試證據</span></div>
          {[
            ["廠區 Layout 重規劃", "物料流、人流、空間與風險整合", "搬運距離、WIP、面積、停線風險"],
            ["產線設立與整合", "NPI、設備、人力、測試與量產移轉", "Ramp-up、節拍、良率、如期投產"],
            ["成本模型改善", "把資源消耗轉為合理分攤邏輯", "成本動因、交叉補貼、報價落差"],
            ["產品報價確認", "標準工時、製費與風險假設治理", "Quote vs. Actual、假設版本、敏感度"],
            ["預算與費用控管", "量差、價差、效率差、組合差拆解", "預算達成、節省金額、預測準確度"],
            ["年度 KPI 推進", "跨設備、產線、工廠的目標治理", "基準值、Owner、節奏與閉環改善"],
          ].map((row) => <div className="table-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span></div>)}
        </div>

        <aside className="role-warning">
          <span className="warning-mark">!</span>
          <div><p className="label">職缺風險辨識</p><h3>「對結果負責」必須配上「能取得資料與調動資源」。</h3><p>最重要的反問題：此職位需要對成本、效率與 KPI 結果負責，實際上可以調動哪些人力、設備與跨部門資源？</p></div>
        </aside>
      </section>

      <section className="section" id="playbook">
        <header className="section-heading">
          <span className="section-no">03</span>
          <div><p className="eyebrow">SHOW YOUR METHOD</p><h2>方法論與現場語言</h2></div>
          <p>回答不要停在工具名稱，要說明如何從資料走到決策與驗證。</p>
        </header>

        <article className="process-block">
          <div className="subheading"><div><p className="label">ELECTRONICS FLOW</p><h3>電子產品製造流程</h3></div><p>不必假裝是 SMT 專家，但要說得出每段如何影響 Layout、產能、成本與品質。</p></div>
          <div className="process-track">
            {processSteps.map((step, index) => <div className="process-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><b>{step}</b></div>)}
          </div>
          <div className="process-callout"><b>凌華類產品的 IE 盲點</b><p>組裝工時可能不長，但<Term>燒機測試</Term>、功能驗證與環境測試會長時間占用空間、設備、電力與 WIP。</p></div>
        </article>

        <div className="method-grid">
          <article className="method-card layout-card">
            <div className="method-title"><span>01</span><div><p className="label">LAYOUT / LINE SETUP</p><h3>Layout 與產線設立</h3></div></div>
            <ol className="method-steps">
              <li><b>定義需求</b><p>產品族、Routing、標準工時、設備、人力與成長情境。</p></li>
              <li><b>量化現況</b><p>Spaghetti Diagram、From-To Chart、VSM、WIP 與瓶頸。</p></li>
              <li><b>比較方案</b><p>產能、投資、距離、安全、擴充、搬遷時間與停線風險。</p></li>
              <li><b>Pilot 驗證</b><p>先以小規模確認產出、品質、人力負荷、供料與測試能力。</p></li>
              <li><b>追蹤成效</b><p>人均產出、Lead Time、WIP、換線、面積與回收期。</p></li>
            </ol>
            <details><summary>Layout 必查 9 項</summary><div className="tag-cloud"><span>人員動線</span><span>物料動線</span><span>WIP 暫存</span><span>ESD</span><span>測試區</span><span>換線</span><span>消防安全</span><span>擴充</span><span>維修空間</span></div></details>
          </article>

          <article className="method-card cost-card">
            <div className="method-title"><span>02</span><div><p className="label">COST MODEL</p><h3>成本模型</h3></div></div>
            <div className="cost-stack" aria-label="完整產品成本組成">
              <div style={{ "--weight": 92 } as React.CSSProperties}><b>直接材料</b><span>CPU / GPU / 記憶體 / 機構</span></div>
              <div style={{ "--weight": 68 } as React.CSSProperties}><b>直接人工</b><span>組裝、測試、包裝</span></div>
              <div style={{ "--weight": 82 } as React.CSSProperties}><b>製造費用</b><span>折舊、維修、耗材、間接人力</span></div>
              <div style={{ "--weight": 74 } as React.CSSProperties}><b>品質損失</b><span>報廢、重工、低良率、COPQ</span></div>
              <div style={{ "--weight": 58 } as React.CSSProperties}><b>複雜度成本</b><span>換線、小批量、認證、NPI</span></div>
            </div>
            <blockquote>不要只按產量或單一人工工時分攤；應依 SMT 機時、測試工時、燒機時間、換線次數、批量與產品複雜度選擇<Term>成本動因</Term>。</blockquote>
          </article>
        </div>

        <article className="kpi-section">
          <div className="subheading"><div><p className="label">KPI ARCHITECTURE</p><h3>高混低量不能只看 OEE</h3></div><p>分層設計，避免為了局部效率犧牲交期、品質或總成本。</p></div>
          <div className="kpi-levels">
            <div><span className="level-tag">L1 · 設備</span><h4>資產是否穩定可用？</h4><ul><li><Term>OEE</Term>／稼動率</li><li>停機時間／<Term>MTBF</Term>／<Term>MTTR</Term></li><li>換線時間</li></ul></div>
            <div><span className="level-tag">L2 · 產線</span><h4>混合產品是否有效流動？</h4><ul><li>標準工時達成／<Term>Earned Hours</Term></li><li><Term>FPY</Term>／重工率</li><li>WIP／Lead Time／排程達成</li></ul></div>
            <div><span className="level-tag">L3 · 工廠</span><h4>是否創造交付與財務結果？</h4><ul><li><Term>OTD</Term>／<Term>OTIF</Term></li><li>製造成本／COPQ／庫存週轉</li><li>人均附加價值／預算達成</li></ul></div>
          </div>
        </article>

        <article className="variance-section">
          <div className="subheading"><div><p className="label">FINANCIAL LANGUAGE</p><h3>把現場問題翻成財務語言</h3></div><p>主管要的不只是「效率下降」，而是可解釋、可行動的差異。</p></div>
          <div className="variance-flow">
            <div><small>01 / OBSERVE</small><b>本月加班費超支</b></div><span>→</span>
            <div><small>02 / DECOMPOSE</small><b>量差 · 價差 · 效率差 · 組合差</b></div><span>→</span>
            <div><small>03 / ISOLATE</small><b>高測試工時產品占比＋NPI 試產</b></div><span>→</span>
            <div><small>04 / DECIDE</small><b>扣除組合後，判定真實效率缺口</b></div>
          </div>
          <div className="budget-tags"><span>年度人力</span><span>派遣</span><span>加班</span><span>CapEx</span><span>OpEx</span><span>維修</span><span>耗材</span><span>廠務</span><span>折舊</span></div>
        </article>
      </section>

      <section className="section section-paper" id="interview">
        <header className="section-heading">
          <span className="section-no">04</span>
          <div><p className="eyebrow">LAND THE INTERVIEW</p><h2>把準備變成可說出口的答案</h2></div>
          <p>三個量化案例、一段公司理解、以及能判斷職缺品質的反問題。</p>
        </header>

        <div className="case-deck">
          {[
            { no: "CASE 01", title: "Layout／產線設立", metrics: "距離 · WIP · 面積 · 產能 · 回收期", prompts: ["需求與限制是什麼？", "比較了哪些方案？", "如何降低搬遷／停線風險？", "最後改善多少？"] },
            { no: "CASE 02", title: "效率改善", metrics: "工時 · 產能 · FPY · Lead Time", prompts: ["用什麼資料找到瓶頸？", "根因而非症狀是什麼？", "跨部門如何分工？", "效果維持多久？"] },
            { no: "CASE 03", title: "成本／預算", metrics: "成本差異 · 節省 · 預測 · ROI", prompts: ["怎麼拆量差與效率差？", "成本動因如何選？", "財務如何確認成果？", "有無副作用？"] },
          ].map((item) => (
            <article className="case-card" key={item.no}>
              <span className="case-no">{item.no}</span><h3>{item.title}</h3><p className="case-metrics">{item.metrics}</p>
              <ol>{item.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol>
            </article>
          ))}
        </div>

        <div className="answer-framework">
          <div><p className="label">ANSWER LOOP</p><h3>每個案例都用同一條證據鏈</h3></div>
          <div className="answer-track">
            <span><i>01</i>原始問題</span><b>→</b><span><i>02</i>資料與分析</span><b>→</b><span><i>03</i>決策與協作</span><b>→</b><span><i>04</i>量化成果</span><b>→</b><span><i>05</i>持續機制</span>
          </div>
        </div>

        <article className="pitch-card">
          <div className="pitch-head"><div><p className="label">60-SECOND COMPANY PITCH</p><h3>公司理解說法</h3></div><button type="button" onClick={copyPitch}>{copied ? "已複製 ✓" : "複製回答"}</button></div>
          <blockquote>我了解凌華不是消費性電腦公司，而是以工業電腦、嵌入式運算、自動化控制與邊緣 AI 平台為主的 B2B 公司。這類產品具有高混低量、客製化與長生命週期特性，因此 IE 的價值不只是改善單站工時，而是整合產品組合、產能、Layout、測試資源、成本動因與工廠 KPI。我會從現場數據出發，把改善轉換成產能、成本、投資效益與管理決策。</blockquote>
          <p className="pitch-note">不要逐字背。把最後一句換成你最強的實際案例，可信度會更高。</p>
        </article>

        <div className="questions-section">
          <div className="subheading"><div><p className="label">QUESTIONS TO ASK</p><h3>反問題庫</h3></div><p>挑 4–6 題即可；追問對方回答，比把清單問完更重要。</p></div>
          <div className="question-groups">
            {questionGroups.map((group) => <details key={group.title}><summary><span>{group.title}</span><span>{group.questions.length} 題 ＋</span></summary><ul>{group.questions.map((question) => <li key={question}>{question}</li>)}</ul></details>)}
          </div>
          <div className="gold-question"><span>最重要的一題</span><p>「這個職位需要對成本、效率與 KPI 結果負責，實際上可以調動哪些人力、設備與跨部門資源？」</p></div>
        </div>

        <article className="checklist">
          <div><p className="label">FINAL CHECK / 面試前一晚</p><h3>你不需要再讀更多，只要確認這 8 件事。</h3></div>
          <div className="checklist-items">
            {["能用 30 秒說明凌華定位", "能區分 Edge AI 與雲端 AI", "能畫出電子製造主流程", "三個案例各有基準與量化結果", "Layout 案例包含 Pilot 與風險", "成本案例說得出成本動因", "KPI 回答有設備／產線／工廠三層", "已選好 4–6 題反問題"].map((item) => <label key={item}><input type="checkbox" /> <span>{item}</span></label>)}
          </div>
        </article>
      </section>

      <section className="sources section">
        <div className="subheading"><div><p className="label">SOURCES & SCOPE</p><h2>資料來源與使用界線</h2></div><p>公司事實與策略以官方公開資料為主；製造與 IE 建議是依你提供的職缺內容所做的專業準備框架。</p></div>
        <div className="source-list">
          {sources.map((source, index) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{source.label}</b><small>{source.note}</small></div><i>↗</i></a>)}
        </div>
        <p className="source-note">非凌華官方招募頁或內部資料；實際組織、流程、權責與產品規格請以面試官及公司最新公告為準。本站為個人面試準備用途，與凌華科技無隸屬或背書關係。</p>
      </section>

      <footer><span>ADLINK INTERVIEW FIELD GUIDE</span><span>Research-backed · Mobile-first · 2026</span></footer>

      <nav className="mobile-nav" aria-label="手機章節導覽">
        {navItems.map((item) => <button className={activeSection === item.id ? "active" : ""} onClick={() => scrollTo(item.id)} type="button" key={item.id} aria-current={activeSection === item.id ? "location" : undefined}><span>{item.short}</span>{item.label}</button>)}
        <button onClick={() => setGlossaryOpen(true)} type="button"><span>⌕</span>名詞</button>
      </nav>

      {selectedTerm && (
        <div className="overlay" role="presentation" onMouseDown={() => setSelectedTerm(null)}>
          <section className="term-sheet" role="dialog" aria-modal="true" aria-labelledby="term-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheet-handle" aria-hidden="true" />
            <button className="sheet-close" onClick={() => setSelectedTerm(null)} type="button" aria-label="關閉名詞解釋">×</button>
            <span className="category-tag">{selectedTerm.category}</span>
            <h2 id="term-title">{selectedTerm.term}</h2>
            {selectedTerm.alias && <p className="term-alias">{selectedTerm.alias}</p>}
            <p className="term-definition">{selectedTerm.definition}</p>
            <div className="interview-connection"><span>面試連結</span><p>{selectedTerm.interview}</p></div>
            <button className="browse-all" onClick={() => { setSelectedTerm(null); setGlossaryOpen(true); }} type="button">瀏覽完整名詞庫 →</button>
          </section>
        </div>
      )}

      {glossaryOpen && (
        <div className="overlay glossary-overlay" role="presentation" onMouseDown={() => setGlossaryOpen(false)}>
          <section className="glossary-panel" role="dialog" aria-modal="true" aria-labelledby="glossary-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="glossary-head"><div><p className="label">INTERVIEW GLOSSARY</p><h2 id="glossary-title">專業名詞庫</h2></div><button onClick={() => setGlossaryOpen(false)} type="button" aria-label="關閉名詞庫">×</button></div>
            <label className="glossary-search"><span>⌕</span><input autoFocus value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="搜尋 GPU、OEE、燒機…" /></label>
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
