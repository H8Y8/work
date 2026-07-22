import type { Metadata } from "next";
import "./ingrasys.css";

export const metadata: Metadata = {
  title: "鴻佰科技 Ingrasys｜IE 工程師面試作戰手冊",
  description: "鴻佰科技公司定位、AI Server 製造、智慧工廠、Layout、標準工時、產能、自動化與 IE 工程師面試準備。",
  applicationName: "Ingrasys IE Interview Field Guide",
  keywords: ["鴻佰科技", "Ingrasys", "IE 工程師", "工業工程", "AI Server", "智慧製造", "面試"],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: "鴻佰科技 Ingrasys｜IE 工程師面試作戰手冊",
    description: "把 AI Server 的製造複雜度，說成 IE 的改善價值。",
    images: [{ url: "ingrasys-og.jpg", width: 1200, height: 630, alt: "鴻佰科技 Ingrasys IE 工程師面試作戰手冊" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "鴻佰科技 Ingrasys｜IE 工程師面試作戰手冊",
    description: "AI Server、智慧工廠、Layout、產能與自動化的一頁面試準備。",
    images: ["ingrasys-og.jpg"],
  },
};

export default function IngrasysLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
