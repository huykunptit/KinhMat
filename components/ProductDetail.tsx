"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, ShoppingBag, Truck, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { vnd } from "@/lib/format";
import { CATEGORIES } from "@/lib/seed";
import { SITE } from "@/lib/site";
import ProductImage from "./ProductImage";
import ProductCard from "./ProductCard";

export default function ProductDetail({ slug }: { slug: string }) {
  const { products, addToCart, ready } = useStore();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const p = products.find((x) => x.slug === slug);
  if (!p) return <div className="container-x py-24 text-center">{ready ? <><h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1><Link href="/san-pham" className="btn-primary mt-5">Về danh sách</Link></> : "Đang tải…"}</div>;
  const cat = CATEGORIES.find((c) => c.slug === p.category);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const out = p.stock <= 0;
  return (
    <div className="container-x py-8">
      <nav className="text-sm text-slate-500"><Link href="/" className="hover:underline">Trang chủ</Link> / <Link href={`/san-pham?danh-muc=${p.category}`} className="hover:underline">{cat?.name}</Link> / <span className="text-slate-800">{p.name}</span></nav>
      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl border border-brand-100 bg-white"><ProductImage p={p} /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-600">{p.brand}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-700">{vnd(p.salePrice ?? p.price)}</span>
            {p.salePrice && <span className="text-lg text-slate-400 line-through">{vnd(p.price)}</span>}
          </div>
          <p className="mt-4 text-slate-700">{p.desc}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-brand-50 p-4 text-sm">
            <div><dt className="text-slate-500">Chất liệu</dt><dd className="font-semibold">{p.material}</dd></div>
            <div><dt className="text-slate-500">Tình trạng</dt><dd className={`font-semibold ${out ? "text-rose-600" : "text-emerald-700"}`}>{out ? "Hết hàng" : `Còn ${p.stock}`}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-300 bg-white">
              <button className="flex h-11 w-11 items-center justify-center" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Giảm"><Minus size={18} /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button className="flex h-11 w-11 items-center justify-center" onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="Tăng"><Plus size={18} /></button>
            </div>
            <button disabled={out} className="btn-primary flex-1 disabled:opacity-50" onClick={() => { addToCart(p.id, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); }}>
              <ShoppingBag size={18} /> {added ? "Đã thêm ✓" : "Thêm vào giỏ"}
            </button>
          </div>
          <Link href="/gio-hang" className="mt-3 block text-sm font-semibold text-brand-700 underline">Đến giỏ hàng</Link>
          <a href={`tel:${SITE.tel}`} className="btn-ghost mt-4 w-full"><Phone size={18} /> Gọi tư vấn / đo mắt: {SITE.phone}</a>
          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><ShieldCheck size={18} className="text-brand-600" /> Bảo hành, hỗ trợ nắn chỉnh gọng trọn đời</li>
            <li className="flex gap-2"><Truck size={18} className="text-brand-600" /> Miễn phí ship đơn từ {vnd(SITE.freeShipFrom)}</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && <section className="mt-14"><h2 className="mb-5 text-2xl font-bold">Sản phẩm liên quan</h2><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div></section>}
    </div>
  );
}
