"use client";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { vnd } from "@/lib/format";
import type { Product, Shape } from "@/lib/types";
import { Field, Modal, PageHeader, Table } from "@/components/admin/ui";
import ProductImage from "@/components/ProductImage";

const SHAPES: [Shape, string][] = [["round", "Tròn"], ["square", "Vuông"], ["rect", "Chữ nhật"], ["cat", "Mắt mèo"], ["aviator", "Phi công"], ["oval", "Oval"]];
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const blank: Product = { id: "", slug: "", name: "", brand: "", category: CATEGORIES[0].slug, price: 0, stock: 0, color: "#2b2b2b", shape: "rect", material: "", desc: "" };

export default function Products() {
  const { products, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [edit, setEdit] = useState<Product | null>(null);
  const list = useMemo(() => products.filter((p) => (!cat || p.category === cat) && (!q || (p.name + p.brand).toLowerCase().includes(q.toLowerCase()))), [products, q, cat]);
  const stockValue = products.reduce((a, p) => a + p.stock * p.price, 0);

  return (
    <>
      <PageHeader title="Sản phẩm & kho" sub={`${products.length} sản phẩm · Giá trị tồn kho ${vnd(stockValue)}`} action={<button className="btn-primary" onClick={() => setEdit({ ...blank })}><Plus size={18} /> Thêm sản phẩm</button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="input !pl-10" placeholder="Tìm sản phẩm…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input sm:w-60" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Danh mục"><option value="">Tất cả danh mục</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
      </div>
      <Table head={["Sản phẩm", "Danh mục", "Giá", "Tồn kho", ""]}>
        {list.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg"><ProductImage p={p} className="!p-1" /></div><div><b className="leading-snug">{p.name}</b><div className="text-sm text-slate-500">{p.brand}</div></div></div></td>
            <td className="px-4 py-3">{CATEGORIES.find((c) => c.slug === p.category)?.name}</td>
            <td className="whitespace-nowrap px-4 py-3">{p.salePrice ? <><b>{vnd(p.salePrice)}</b> <s className="text-slate-400">{vnd(p.price)}</s></> : <b>{vnd(p.price)}</b>}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-sm font-bold ${p.stock === 0 ? "bg-rose-100 text-rose-700" : p.stock <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{p.stock}</span></td>
            <td className="whitespace-nowrap px-4 py-3 text-right"><button className="btn-ghost !px-3" onClick={() => setEdit(p)} aria-label="Sửa"><Pencil size={16} /></button> <button className="btn-danger !px-3" onClick={() => confirm(`Xoá "${p.name}"?`) && deleteProduct(p.id)} aria-label="Xoá"><Trash2 size={16} /></button></td>
          </tr>
        ))}
      </Table>
      {edit && <Form p={edit} onClose={() => setEdit(null)} onSave={(p) => { saveProduct({ ...p, slug: p.slug || slugify(p.name) }); setEdit(null); }} />}
    </>
  );
}

function Form({ p, onClose, onSave }: { p: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [f, setF] = useState(p);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <Modal title={p.id ? "Sửa sản phẩm" : "Thêm sản phẩm"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, salePrice: f.salePrice || undefined }); }}>
        <Field label="Tên sản phẩm" className="sm:col-span-2"><input required className="input" value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Thương hiệu"><input className="input" value={f.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
        <Field label="Danh mục"><select className="input" value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Field>
        <Field label="Giá bán (₫)"><input required type="number" min={0} className="input" value={f.price} onChange={(e) => set("price", +e.target.value)} /></Field>
        <Field label="Giá khuyến mại (₫)"><input type="number" min={0} className="input" value={f.salePrice ?? ""} onChange={(e) => set("salePrice", e.target.value ? +e.target.value : undefined)} /></Field>
        <Field label="Tồn kho"><input required type="number" min={0} className="input" value={f.stock} onChange={(e) => set("stock", +e.target.value)} /></Field>
        <Field label="Chất liệu"><input className="input" value={f.material} onChange={(e) => set("material", e.target.value)} /></Field>
        <Field label="Kiểu dáng (minh hoạ)"><select className="input" value={f.shape} onChange={(e) => set("shape", e.target.value as Shape)}>{SHAPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Màu gọng"><input type="color" className="input !p-1" value={f.color} onChange={(e) => set("color", e.target.value)} /></Field>
        <Field label="Link ảnh sản phẩm (nếu có)" className="sm:col-span-2"><input className="input" placeholder="https://… hoặc /images/ten-anh.jpg" value={f.image ?? ""} onChange={(e) => set("image", e.target.value || undefined)} /></Field>
        <Field label="Mô tả" className="sm:col-span-2"><textarea rows={3} className="input" value={f.desc} onChange={(e) => set("desc", e.target.value)} /></Field>
        <label className="flex min-h-[44px] items-center gap-2 sm:col-span-2"><input type="checkbox" className="h-5 w-5 accent-brand-700" checked={!!f.featured} onChange={(e) => set("featured", e.target.checked)} /> Hiển thị ở mục “Nổi bật” trang chủ</label>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onClose}>Huỷ</button><button className="btn-primary">Lưu</button></div>
      </form>
    </Modal>
  );
}
