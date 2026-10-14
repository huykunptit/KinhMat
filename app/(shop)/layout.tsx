import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Nút liên hệ nhanh cho điện thoại */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-3 md:bottom-6 md:right-6">
        <a href={`https://zalo.me/${SITE.zalo}`} target="_blank" rel="noreferrer" aria-label="Chat Zalo" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-500"><MessageCircle size={22} /></a>
        <a href={`tel:${SITE.tel}`} aria-label="Gọi ngay" className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-brand-900 shadow-lg hover:bg-gold-400"><Phone size={22} /></a>
      </div>
    </>
  );
}
