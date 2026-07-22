import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./claude-theme.css";
import "./home.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://h8y8.github.io/work/"),
  title: "IE 面試準備中心｜公司面試作戰手冊",
  description: "依公司整理產業定位、產品製造、IE 職務重點、專業名詞與面試回答框架。",
  applicationName: "IE Interview Field Guides",
  authors: [{ name: "Interview Field Guide" }],
  keywords: ["IE", "工業工程", "面試", "凌華科技", "鴻佰科技", "ADLINK", "Ingrasys"],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: "IE 面試準備中心｜公司面試作戰手冊",
    description: "選擇公司，開始準備產業、製造與 IE 面試重點。",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "IE 面試準備中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IE 面試準備中心｜公司面試作戰手冊",
    description: "選擇公司，開始準備產業、製造與 IE 面試重點。",
    images: ["og.png"],
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
