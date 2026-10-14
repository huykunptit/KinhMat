"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden><path d="M6 32c8-12 18-18 26-18s18 6 26 18c-8 12-18 18-26 18S14 44 6 32z" fill="#fff" stroke="#173b78" strokeWidth="4" /><circle cx="32" cy="32" r="9" fill="#173b78" /></svg>
      </span>
      <span className="whitespace-nowrap leading-tight">
        <span className={`block text-lg font-bold uppercase tracking-wide ${light ? "text-white" : "text-brand-800"}`}>Mắt Kính</span>
        <span className="block text-sm font-bold uppercase tracking-[.2em] text-gold-600">Thành Vinh</span>
      </span>
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { cart } = useStore();
  const count = cart.reduce((a, l) => a + l.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="hidden bg-brand-800 text-sm text-white md:block">
        <div className="container-x flex items-center justify-between py-1.5">
          <span>📍 {SITE.address}</span>
          <span>🕒 {SITE.hours} · Đo khám mắt miễn phí</span>
        </div>
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="Trang chủ"><Logo /></Link>
        <nav className="hidden items-center gap-5 whitespace-nowrap text-[15px] font-semibold text-slate-700 xl:flex" aria-label="Chính">
          <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
          <Link href="/san-pham" className="hover:text-brand-600">Tất cả sản phẩm</Link>
          {CATEGORIES.slice(0, 3).map((c) => <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} className="hover:text-brand-600">{c.name.split(" · ")[0]}</Link>)}
          <Link href="/#dat-lich" className="hover:text-brand-600">Đặt lịch đo mắt</Link>
          <Link href="/#lien-he" className="hover:text-brand-600">Liên hệ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${SITE.tel}`} className="btn-gold hidden whitespace-nowrap sm:inline-flex"><Phone size={18} /> {SITE.phone}</a>
          <Link href="/gio-hang" className="btn-ghost relative !px-3" aria-label={`Giỏ hàng, ${count} sản phẩm`}>
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white">{count}</span>}
          </Link>
          <button className="btn-ghost !px-3 xl:hidden" onClick={() => setOpen(true)} aria-label="Mở menu"><Menu size={22} /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between"><Logo /><button className="btn-ghost !px-3" onClick={() => setOpen(false)} aria-label="Đóng menu"><X size={22} /></button></div>
            <ul className="space-y-1 text-[17px] font-semibold" onClick={() => setOpen(false)}>
              <li><Link className="block rounded-lg px-3 py-3 hover:bg-brand-50" href="/">Trang chủ</Link></li>
              <li><Link className="block rounded-lg px-3 py-3 hover:bg-brand-50" href="/san-pham">Tất cả sản phẩm</Link></li>
              {CATEGORIES.map((c) => <li key={c.slug}><Link className="block rounded-lg px-3 py-3 text-slate-700 hover:bg-brand-50" href={`/san-pham?danh-muc=${c.slug}`}>{c.emoji} {c.name}</Link></li>)}
              <li><Link className="block rounded-lg px-3 py-3 hover:bg-brand-50" href="/#dat-lich">Đặt lịch đo mắt</Link></li>
              <li><Link className="block rounded-lg px-3 py-3 hover:bg-brand-50" href="/#lien-he">Liên hệ</Link></li>
            </ul>
            <a href={`tel:${SITE.tel}`} className="btn-gold mt-5 w-full"><Phone size={18} /> Gọi {SITE.phone}</a>
          </div>
        </div>
      )}
    </header>
  );
}
