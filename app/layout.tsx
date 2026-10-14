import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: `${SITE.name} – Kính mắt, đo mắt miễn phí tại Cầu Diễn, Hà Nội`, template: `%s | ${SITE.name}` },
  description: `${SITE.name}: ${SITE.tagline}. Đo khám mắt miễn phí, lắp kính nhanh. ${SITE.address}. Hotline ${SITE.phone}.`,
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#173b78" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
