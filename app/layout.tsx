import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./claude-theme.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://h8y8.github.io/work/"),
  title: "凌華科技 ADLINK｜IE 面試作戰手冊",
  description: "凌華科技公司定位、產品、製造流程、Layout、成本、KPI 與 IE 面試準備的一頁式互動手冊。",
  applicationName: "ADLINK Interview Field Guide",
  authors: [{ name: "Interview Field Guide" }],
  keywords: ["凌華科技", "ADLINK", "IE", "工業工程", "面試", "邊緣運算", "Edge AI", "工業電腦"],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: "凌華科技 ADLINK｜IE 面試作戰手冊",
    description: "從 Edge AI 到工廠成本，把公司理解變成面試競爭力。",
    images: [{ url: "og.jpg", width: 1200, height: 630, alt: "凌華科技 ADLINK IE 面試作戰手冊" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "凌華科技 ADLINK｜IE 面試作戰手冊",
    description: "公司、產品、製造、成本與 KPI 的一頁面試準備。",
    images: ["og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
