import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Story Reader",
  description: "小说、书籍在线翻阅网站与后台管理系统"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
