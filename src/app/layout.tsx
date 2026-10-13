import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { connection } from "next/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Наружная реклама в Алматы | RPK — Больше чем реклама",
  description:
    "Проектируем, производим и монтируем световые вывески, входные группы и навигацию в Алматы. Собственное производство. Получите предварительный расчёт в WhatsApp.",
  icons: { icon: "/assets/brand/rpk-favicon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
