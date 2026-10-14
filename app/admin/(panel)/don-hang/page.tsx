"use client";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PAYMENT_LABEL, STATUS_LABEL, dateTimeVN, vnd } from "@/lib/format";
import type { Order, OrderStatus, Payment } from "@/lib/types";
import { Field, Modal, PageHeader, StatusBadge, Table } from "@/components/admin/ui";

export default function Orders() {
  const { orders, updateOrderStatus, markPaid } = useStore();
  const [q, setQ] = useState("");
  const [st, setSt] = useState<"" | OrderStatus>("");
  const [sel, setSel] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => orders.filter((o) => (!st || o.status === st) && (!q || (o.code + o.customerName + o.phone).toLowerCase().includes(q.toLowerCase()))), [orders, q, st]);
  const cur = orders.find((o) => o.id === sel);

  return (
    <>
      <PageHeader title="Đơn hàng" sub={`${orders.length} đơn`} action={<button className="btn-primary" onClick={() => setCreating(true)}><Plus size={18} /> Tạo đơn tại quầy</button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="input !pl-10" placeholder="Tìm mã đơn, tên, số điện thoại…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input sm:w-56" value={st} onChange={(e) => setSt(e.target.value as OrderStatus | "")} aria-label="Lọc trạng thái">
          <option value="">Tất cả trạng thái</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <Table head={["Mã", "Khách hàng", "Ngày", "Kênh", "Tổng tiền", "Thanh toán", "Trạng thái"]}>
        {list.map((o) => (
          <tr key={o.id} onClick={() => setSel(o.id)} className="cursor-pointer hover:bg-brand-50/60">
            <td className="px-4 py-3 font-bold text-brand-700">{o.code}</td>
            <td className="px-4 py-3">{o.customerName}<div className="text-sm text-slate-500">{o.phone}</div></td>
            <td className="whitespace-nowrap px-4 py-3">{dateTimeVN(o.createdAt)}</td>
            <td className="px-4 py-3">{o.channel === "online" ? "Online" : "Tại quầy"}</td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold">{vnd(o.total)}</td>
            <td className="px-4 py-3">{o.paid ? <span className="font-semibold text-emerald-700">Đã thu</span> : <span className="text-amber-700">Chưa thu</span>}</td>
            <td className="px-4 py-3"><StatusBadge s={o.status} /></td>
          </tr>
        ))}
        {list.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">Không có đơn hàng.</td></tr>}
      </Table>

      {cur && (
        <Modal title={`Đơn ${cur.code}`} onClose={() => setSel(null)}>
          <div className="space-y-4">
            <div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-[15px] sm:grid-cols-2">
              <p><b>Khách:</b> {cur.customerName}</p><p><b>SĐT:</b> <a className="text-brand-700 underline" href={`tel:${cur.phone}`}>{cur.phone}</a></p>
              <p className="sm:col-span-2"><b>Địa chỉ:</b> {cur.address || "—"}</p>
              <p><b>Thanh toán:</b> {PAYMENT_LABEL[cur.payment]}</p><p><b>Ngày:</b> {dateTimeVN(cur.createdAt)}</p>
              {cur.note && <p className="sm:col-span-2"><b>Ghi chú:</b> {cur.note}</p>}
            </div>
            <ul className="divide-y rounded-xl border">
              {cur.items.map((i, k) => <li key={k} className="flex justify-between gap-3 p-3"><span>{i.name} × {i.qty}</span><b>{vnd(i.price * i.qty)}</b></li>)}
              <li className="flex justify-between bg-slate-50 p-3 text-lg font-bold"><span>Tổng</span><span className="text-brand-700">{vnd(cur.total)}</span></li>
            </ul>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Trạng thái đơn"><select className="input" value={cur.status} onChange={(e) => updateOrderStatus(cur.id, e.target.value as OrderStatus)}>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
              <div className="flex items-end"><button disabled={cur.status === "huy"} className={`w-full disabled:opacity-50 ${cur.paid ? "btn-ghost" : "btn-gold"}`} onClick={() => markPaid(cur.id, !cur.paid)}>{cur.paid ? "Đã thu tiền ✓ (bấm để bỏ)" : "Xác nhận đã thu tiền"}</button></div>
            </div>
            <p className="text-sm text-slate-500">Khi xác nhận thu tiền, khoản thu tự ghi vào mục Thu chi. Huỷ đơn sẽ hoàn lại tồn kho.</p>
          </div>
        </Modal>
      )}
      {creating && <PosModal onClose={() => setCreating(false)} />}
    </>
  );
}

function PosModal({ onClose }: { onClose: () => void }) {
  const { products, placeOrder } = useStore();
  const [lines, setLines] = useState<{ id: string; qty: number }[]>([]);
  const [f, setF] = useState({ name: "Khách lẻ", phone: "", pay: "tai-cua-hang" as Payment, note: "" });
  const [pid, setPid] = useState("");
  const items = lines.map((l) => ({ l, p: products.find((p) => p.id === l.id)! })).filter((x) => x.p);
  const total = items.reduce((a, { l, p }) => a + (p.salePrice ?? p.price) * l.qty, 0);

  const add = () => { if (!pid) return; setLines((ls) => ls.some((l) => l.id === pid) ? ls.map((l) => (l.id === pid ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { id: pid, qty: 1 }]); setPid(""); };
  const save = () => {
    if (!items.length) return;
    placeOrder({ customerName: f.name || "Khách lẻ", phone: f.phone || "0000000000", address: "Mua tại cửa hàng", payment: f.pay, channel: "tai-quay", note: f.note, items: items.map(({ l, p }) => ({ productId: p.id, name: p.name, price: p.salePrice ?? p.price, qty: l.qty })) });
    onClose();
  };
  return (
    <Modal title="Tạo đơn tại quầy" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <select className="input" value={pid} onChange={(e) => setPid(e.target.value)} aria-label="Chọn sản phẩm"><option value="">— Chọn sản phẩm —</option>{products.filter((p) => p.stock > 0).map((p) => <option key={p.id} value={p.id}>{p.name} ({vnd(p.salePrice ?? p.price)})</option>)}</select>
          <button className="btn-primary" onClick={add}>Thêm</button>
        </div>
        <ul className="divide-y rounded-xl border">
          {items.length === 0 && <li className="p-4 text-center text-slate-500">Chưa chọn sản phẩm.</li>}
          {items.map(({ l, p }) => (
            <li key={p.id} className="flex items-center gap-2 p-3"><span className="flex-1 leading-snug">{p.name}</span>
              <input type="number" min={1} max={p.stock} className="input !w-20" value={l.qty} onChange={(e) => setLines(lines.map((x) => x.id === p.id ? { ...x, qty: Math.max(1, Math.min(p.stock, +e.target.value || 1)) } : x))} aria-label="Số lượng" />
              <button className="text-rose-600" onClick={() => setLines(lines.filter((x) => x.id !== p.id))} aria-label="Xoá"><Trash2 size={18} /></button></li>
          ))}
        </ul>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Tên khách"><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Số điện thoại"><input className="input" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <Field label="Hình thức thanh toán"><select className="input" value={f.pay} onChange={(e) => setF({ ...f, pay: e.target.value as Payment })}><option value="tai-cua-hang">Tiền mặt tại quầy</option><option value="chuyen-khoan">Chuyển khoản</option></select></Field>
          <Field label="Ghi chú (độ cận…)"><input className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></Field>
        </div>
        <div className="flex items-center justify-between border-t pt-3"><span className="text-lg font-bold">Tổng: <span className="text-brand-700">{vnd(total)}</span></span><button className="btn-gold" disabled={!items.length} onClick={save}>Lưu & thu tiền</button></div>
      </div>
    </Modal>
  );
}
