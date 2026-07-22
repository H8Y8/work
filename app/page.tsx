import Link from "next/link";

type CompanyGuide = {
  slug: string;
  mark: string;
  name: string;
  englishName: string;
  industry: string;
  role: string;
  summary: string;
  topics: string[];
  tone: "clay" | "sage";
};

const companyGuides: CompanyGuide[] = [
  {
    slug: "/adlink",
    mark: "A",
    name: "凌華科技",
    englishName: "ADLINK Technology",
    industry: "工業電腦 · Edge AI",
    role: "IE 工程師",
    summary: "從工業級運算、電子製造流程，到 Layout、成本模型與工廠 KPI。",
    topics: ["Edge AI", "高混低量", "成本模型", "Operational Excellence"],
    tone: "clay",
  },
  {
    slug: "/ingrasys",
    mark: "I",
    name: "鴻佰科技",
    englishName: "Ingrasys Technology",
    industry: "AI Server · Cloud Infrastructure",
    role: "IE 工程師",
    summary: "從 AI Server、整櫃液冷與智慧工廠，到標準工時、產能與自動化 ROI。",
    topics: ["AI Server", "智慧工廠", "液冷", "產能規劃"],
    tone: "sage",
  },
];

export default function CompanyDirectoryPage() {
  return (
    <main className="directory-home">
      <header className="directory-header">
        <Link className="directory-brand" href="/" aria-label="IE 面試準備中心首頁">
          <span>IE</span>
          <b>INTERVIEW FIELD GUIDES</b>
        </Link>
        <span className="directory-count">{companyGuides.length} 份手冊</span>
      </header>

      <section className="directory-intro" aria-labelledby="directory-title">
        <p className="directory-eyebrow">COMPANY INTERVIEW PREP</p>
        <h1 id="directory-title">選一家公司，<br /><em>開始準備。</em></h1>
        <p>把公司研究、製造知識與 IE 面試方法整理成可以快速複習的一頁式手冊。</p>
      </section>

      <section className="company-directory" aria-label="公司面試手冊">
        {companyGuides.map((company, index) => (
          <Link
            className={`company-card company-card--${company.tone}`}
            href={company.slug}
            key={company.slug}
            aria-label={`開啟${company.name}${company.role}面試手冊`}
          >
            <div className="company-card__topline">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{company.industry}</span>
            </div>
            <div className="company-card__identity">
              <span className="company-card__mark" aria-hidden="true">{company.mark}</span>
              <div>
                <h2>{company.name}</h2>
                <p>{company.englishName}</p>
              </div>
            </div>
            <p className="company-card__summary">{company.summary}</p>
            <ul className="company-card__topics" aria-label="手冊重點">
              {company.topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
            <div className="company-card__action">
              <span>{company.role}</span>
              <b>開啟手冊 <i aria-hidden="true">↗</i></b>
            </div>
          </Link>
        ))}
      </section>

      <footer className="directory-footer">
        <p>未來新增公司時，只需在首頁加入新的公司入口。</p>
        <span>Research-backed · Mobile-first · 2026</span>
      </footer>
    </main>
  );
}
