"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const { products } = useStore();
  const sp = useSearchParams();
  const router = useRouter();
  const cat = sp.get("danh-muc") ?? "";
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("moi");
  const [max, setMax] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const list = useMemo(() => {
    let l = products.filter((p) => (!cat || p.category === cat) && (!q || (p.name + p.brand).toLowerCase().includes(q.toLowerCase())) && (!max || (p.salePrice ?? p.price) <= max));
    const price = (p: typeof l[number]) => p.salePrice ?? p.price;
    if (sort === "tang") l = [...l].sort((a, b) => price(a) - price(b));
    if (sort === "giam") l = [...l].sort((a, b) => price(b) - price(a));
    return l;
  }, [products, cat, q, sort, max]);

  const current = CATEGORIES.find((c) => c.slug === cat);
  const setCat = (s: string) => router.push(s ? `/san-pham?danh-muc=${s}` : "/san-pham");

  return (
    <div className="container-x py-8">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb"><Link href="/" className="hover:underline">Trang chủ</Link> / <span className="text-slate-800">{current?.name ?? "Tất cả sản phẩm"}</span></nav>
      <h1 className="mt-2 text-3xl font-bold">{current?.name ?? "Tất cả sản phẩm"}</h1>
      {current && <p className="text-slate-600">{current.desc}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={20} />
          <input className="input !pl-10" placeholder="Tìm gọng, tròng, thương hiệu…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm kiếm" />
        </div>
        <select className="input sm:w-52" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sắp xếp">
          <option value="moi">Mới nhất</option><option value="tang">Giá thấp → cao</option><option value="giam">Giá cao → thấp</option>
        </select>
        <button className="btn-ghost sm:hidden" onClick={() => setShowFilter((v) => !v)}><SlidersHorizontal size={18} /> Bộ lọc</button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className={`${showFilter ? "block" : "hidden"} space-y-6 sm:block`}>
          <div className="card p-4">
            <h2 className="mb-2 font-bold">Danh mục</h2>
            <ul className="space-y-1">
              <li><button onClick={() => setCat("")} className={`w-full rounded-lg px-3 py-2 text-left ${!cat ? "bg-brand-700 text-white" : "hover:bg-brand-50"}`}>Tất cả</button></li>
              {CATEGORIES.map((c) => <li key={c.slug}><button onClick={() => setCat(c.slug)} className={`w-full rounded-lg px-3 py-2 text-left ${cat === c.slug ? "bg-brand-700 text-white" : "hover:bg-brand-50"}`}>{c.name}</button></li>)}
            </ul>
          </div>
          <div className="card p-4">
            <h2 className="mb-2 font-bold">Mức giá</h2>
            {[[0, "Tất cả"], [500000, "Dưới 500.000₫"], [1000000, "Dưới 1.000.000₫"], [2000000, "Dưới 2.000.000₫"]].map(([v, l]) => (
              <label key={v} className="flex min-h-[40px] cursor-pointer items-center gap-2"><input type="radio" name="gia" checked={max === v} onChange={() => setMax(v as number)} className="h-4 w-4 accent-brand-700" /> {l}</label>
            ))}
          </div>
        </aside>
        <div>
          <p className="mb-3 text-sm text-slate-600">{list.length} sản phẩm</p>
          {list.length === 0 ? <div className="card p-10 text-center text-slate-600">Không tìm thấy sản phẩm phù hợp.</div> : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
