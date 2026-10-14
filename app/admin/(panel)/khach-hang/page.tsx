"use client";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { dateVN, vnd } from "@/lib/format";
import type { Customer } from "@/lib/types";
import { Field, Modal, PageHeader, Table, StatusBadge } from "@/components/admin/ui";

export default function Customers() {
  const { customers, orders, saveCustomer, deleteCustomer } = useStore();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Customer | null>(null);
  const [view, setView] = useState<Customer | null>(null);

  const rows = useMemo(() => customers.map((c) => {
    const os = orders.filter((o) => o.phone === c.phone && o.status !== "huy");
    return { c, count: os.length, spent: os.reduce((a, b) => a + b.total, 0) };
  }).filter(({ c }) => !q || (c.name + c.phone).toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.spent - a.spent), [customers, orders, q]);

  const tier = (s: number) => (s >= 5000000 ? ["VIP", "bg-gold-400 text-brand-900"] : s >= 2000000 ? ["Thân thiết", "bg-brand-100 text-brand-800"] : ["Mới", "bg-slate-100 text-slate-700"]);

  return (
    <>
      <PageHeader title="Khách hàng" sub={`${customers.length} khách hàng`} action={<button className="btn-primary" onClick={() => setEdit({ id: "", name: "", phone: "", createdAt: new Date().toISOString() })}><Plus size={18} /> Thêm khách</button>} />
      <div className="relative mb-4"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="input !pl-10" placeholder="Tìm theo tên hoặc số điện thoại…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <Table head={["Khách hàng", "Điện thoại", "Số đơn", "Tổng chi tiêu", "Hạng", "Ghi chú", ""]}>
        {rows.map(({ c, count, spent }) => { const [tl, tc] = tier(spent); return (
          <tr key={c.id} className="hover:bg-brand-50/60">
            <td className="cursor-pointer px-4 py-3 font-semibold text-brand-700" onClick={() => setView(c)}>{c.name}<div className="text-sm font-normal text-slate-500">{c.address}</div></td>
            <td className="px-4 py-3"><a href={`tel:${c.phone}`} className="underline">{c.phone}</a></td>
            <td className="px-4 py-3">{count}</td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold">{vnd(spent)}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tc}`}>{tl}</span></td>
            <td className="max-w-[220px] truncate px-4 py-3 text-sm text-slate-600" title={c.note}>{c.note}</td>
            <td className="whitespace-nowrap px-4 py-3 text-right"><button className="btn-ghost !px-3" onClick={() => setEdit(c)} aria-label="Sửa"><Pencil size={16} /></button> <button className="btn-danger !px-3" onClick={() => confirm(`Xoá khách "${c.name}"?`) && deleteCustomer(c.id)} aria-label="Xoá"><Trash2 size={16} /></button></td>
          </tr>); })}
      </Table>

      {view && (
        <Modal title={view.name} onClose={() => setView(null)}>
          <p className="text-slate-600">{view.phone} · {view.address || "Chưa có địa chỉ"} · KH từ {dateVN(view.createdAt)}</p>
          {view.note && <p className="mt-2 rounded-xl bg-amber-50 p-3">📝 {view.note}</p>}
          <h3 className="mt-4 font-bold">Lịch sử mua hàng</h3>
          <ul className="mt-2 divide-y">
            {orders.filter((o) => o.phone === view.phone).map((o) => <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2"><span><b>{o.code}</b> · {dateVN(o.createdAt)}<div className="text-sm text-slate-500">{o.items.map((i) => i.name).join(", ")}</div></span><span className="flex items-center gap-2"><b>{vnd(o.total)}</b><StatusBadge s={o.status} /></span></li>)}
            {orders.every((o) => o.phone !== view.phone) && <li className="py-3 text-slate-500">Chưa có đơn hàng.</li>}
          </ul>
        </Modal>
      )}
      {edit && <CustomerForm c={edit} onClose={() => setEdit(null)} onSave={(c) => { saveCustomer(c); setEdit(null); }} />}
    </>
  );
}

function CustomerForm({ c, onClose, onSave }: { c: Customer; onClose: () => void; onSave: (c: Customer) => void }) {
  const [f, setF] = useState(c);
  return (
    <Modal title={c.id ? "Sửa khách hàng" : "Thêm khách hàng"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
        <Field label="Họ tên"><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Số điện thoại"><input required inputMode="tel" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
        <Field label="Email"><input type="email" className="input" value={f.email ?? ""} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Địa chỉ"><input className="input" value={f.address ?? ""} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
        <Field label="Ghi chú (độ cận, loại tròng, lịch hẹn…)" className="sm:col-span-2"><textarea rows={3} className="input" value={f.note ?? ""} onChange={(e) => setF({ ...f, note: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onClose}>Huỷ</button><button className="btn-primary">Lưu</button></div>
      </form>
    </Modal>
  );
}
