"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { vnd } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductImage from "./ProductImage";

export default function ProductCard({ p }: { p: Product }) {
  const { addToCart } = useStore();
  const out = p.stock <= 0;
  const off = p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft transition hover:-translate-y-1">
      <Link href={`/san-pham/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage p={p} className="transition duration-500 group-hover:scale-105" />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">-{off}%</span>}
        {out && <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-slate-700">Tạm hết hàng</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{p.brand}</p>
        <Link href={`/san-pham/${p.slug}`} className="mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-slate-900 hover:text-brand-600">{p.name}</Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-700">{vnd(p.salePrice ?? p.price)}</span>
          {p.salePrice && <span className="text-sm text-slate-400 line-through">{vnd(p.price)}</span>}
        </div>
        <button disabled={out} onClick={() => addToCart(p.id)} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50">
          <ShoppingBag size={18} /> Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
