"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Boxes, LayoutDashboard, LogOut, Menu, ReceiptText, ShoppingCart, Users, Wallet, X, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Header";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/admin/san-pham", label: "Sản phẩm & kho", icon: Boxes },
  { href: "/admin/khach-hang", label: "Khách hàng", icon: Users },
  { href: "/admin/thu-chi", label: "Thu chi", icon: Wallet },
  { href: "/admin/bao-cao", label: "Báo cáo", icon: BarChart3 },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { ready, orders } = useStore();
  const pending = orders.filter((o) => o.status === "moi").length;

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); };
  const active = (h: string) => (h === "/admin" ? path === "/admin" : path.startsWith(h));

  const menu = (
    <nav className="space-y-1" aria-label="Quản trị" onClick={() => setOpen(false)}>
      {NAV.map(({ href, label, icon: I }) => (
        <Link key={href} href={href} className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 font-semibold transition ${active(href) ? "bg-gold-500 text-brand-900" : "text-brand-100 hover:bg-white/10"}`}>
          <I size={20} /> {label}
          {href === "/admin/don-hang" && pending > 0 && <span className="ml-auto rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">{pending}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-brand-900 p-4 lg:flex">
        <div className="mb-6 px-1"><Logo light /></div>
        {menu}
        <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
          <Link href="/" target="_blank" className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-brand-100 hover:bg-white/10"><ExternalLink size={20} /> Xem website</Link>
          <button onClick={logout} className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-brand-100 hover:bg-white/10"><LogOut size={20} /> Đăng xuất</button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <button className="btn-ghost !px-2.5" onClick={() => setOpen(true)} aria-label="Mở menu"><Menu size={22} /></button>
        <span className="font-bold text-brand-800">Quản trị Thành Vinh</span>
        <button className="btn-ghost !px-2.5" onClick={logout} aria-label="Đăng xuất"><LogOut size={20} /></button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-brand-900 p-4">
            <div className="mb-5 flex items-center justify-between"><Logo light /><button className="text-white" onClick={() => setOpen(false)} aria-label="Đóng"><X /></button></div>
            {menu}
          </div>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        {ready ? children : <p className="py-20 text-center text-slate-500">Đang tải dữ liệu…</p>}
      </main>
    </div>
  );
}
