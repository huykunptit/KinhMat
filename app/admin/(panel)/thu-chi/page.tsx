"use client";
import { useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { dateVN, vnd, ymd } from "@/lib/format";
import type { Transaction } from "@/lib/types";
import { Field, Modal, PageHeader, StatCard, Table } from "@/components/admin/ui";
import { sumTx } from "@/lib/report";

const INCOME_CATS = ["Bán hàng", "Dịch vụ", "Thu khác"];
const EXPENSE_CATS = ["Nhập hàng", "Thuê mặt bằng", "Lương nhân viên", "Điện nước", "Marketing", "Chi khác"];

export default function Cashbook() {
  const { transactions, saveTransaction, deleteTransaction } = useStore();
  const [month, setMonth] = useState(ymd(new Date()).slice(0, 7));
  const [type, setType] = useState<"" | "thu" | "chi">("");
  const [edit, setEdit] = useState<Transaction | null>(null);

  const inMonth = useMemo(() => transactions.filter((t) => ymd(new Date(t.date)).startsWith(month)), [transactions, month]);
  const list = inMonth.filter((t) => !type || t.type === type);
  const thu = sumTx(inMonth, "thu"), chi = sumTx(inMonth, "chi");

  const blank = (t: "thu" | "chi"): Transaction => ({ id: "", type: t, category: t === "thu" ? INCOME_CATS[0] : EXPENSE_CATS[0], amount: 0, note: "", date: new Date().toISOString() });

  return (
    <>
      <PageHeader title="Thu chi" sub="Sổ quỹ tiền mặt & chuyển khoản" action={
        <div className="flex gap-2"><button className="btn-primary" onClick={() => setEdit(blank("thu"))}><Plus size={18} /> Phiếu thu</button><button className="btn-gold" onClick={() => setEdit(blank("chi"))}><Plus size={18} /> Phiếu chi</button></div>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Field label="Tháng" className="sm:w-48"><input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} /></Field>
        <Field label="Loại" className="sm:w-48"><select className="input" value={type} onChange={(e) => setType(e.target.value as "" | "thu" | "chi")}><option value="">Tất cả</option><option value="thu">Thu</option><option value="chi">Chi</option></select></Field>
      </div>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Tổng thu" value={vnd(thu)} tone="green" />
        <StatCard label="Tổng chi" value={vnd(chi)} tone="red" />
        <StatCard label="Chênh lệch" value={vnd(thu - chi)} tone={thu - chi >= 0 ? "brand" : "red"} />
      </div>
      <Table head={["Ngày", "Loại", "Hạng mục", "Nội dung", "Số tiền", ""]}>
        {list.map((t) => (
          <tr key={t.id}>
            <td className="whitespace-nowrap px-4 py-3">{dateVN(t.date)}</td>
            <td className="px-4 py-3">{t.type === "thu" ? <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><ArrowDownCircle size={16} /> Thu</span> : <span className="inline-flex items-center gap-1 font-semibold text-rose-700"><ArrowUpCircle size={16} /> Chi</span>}</td>
            <td className="px-4 py-3">{t.category}</td>
            <td className="px-4 py-3 text-slate-600">{t.note}</td>
            <td className={`whitespace-nowrap px-4 py-3 font-bold ${t.type === "thu" ? "text-emerald-700" : "text-rose-700"}`}>{t.type === "thu" ? "+" : "−"}{vnd(t.amount)}</td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              {!t.orderId && <><button className="btn-ghost !px-3" onClick={() => setEdit(t)} aria-label="Sửa"><Pencil size={16} /></button> <button className="btn-danger !px-3" onClick={() => confirm("Xoá phiếu này?") && deleteTransaction(t.id)} aria-label="Xoá"><Trash2 size={16} /></button></>}
              {t.orderId && <span className="text-xs text-slate-400">Từ đơn hàng</span>}
            </td>
          </tr>
        ))}
        {list.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Chưa có giao dịch trong tháng này.</td></tr>}
      </Table>
      {edit && <TxForm t={edit} onClose={() => setEdit(null)} onSave={(t) => { saveTransaction(t); setEdit(null); }} />}
    </>
  );
}

function TxForm({ t, onClose, onSave }: { t: Transaction; onClose: () => void; onSave: (t: Transaction) => void }) {
  const [f, setF] = useState(t);
  const cats = f.type === "thu" ? INCOME_CATS : EXPENSE_CATS;
  return (
    <Modal title={`${t.id ? "Sửa" : "Lập"} phiếu ${f.type === "thu" ? "thu" : "chi"}`} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
        <Field label="Ngày"><input type="date" required className="input" value={ymd(new Date(f.date))} onChange={(e) => e.target.value && setF({ ...f, date: new Date(e.target.value + "T12:00:00").toISOString() })} /></Field>
        <Field label="Hạng mục"><select className="input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{cats.map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Số tiền (₫)"><input required type="number" min={1} className="input" value={f.amount || ""} onChange={(e) => setF({ ...f, amount: +e.target.value })} /></Field>
        <Field label="Nội dung"><input className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></Field>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-ghost" onClick={onClose}>Huỷ</button><button className="btn-primary">Lưu</button></div>
      </form>
    </Modal>
  );
}
