"use client";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Printer } from "lucide-react";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/seed";
import { vnd, vndShort, ymd } from "@/lib/format";
import { Field, PageHeader, StatCard, Table } from "@/components/admin/ui";
import { addDays, dailySeries, endOfDay, inRange, startOfDay, sumTx, validOrders } from "@/lib/report";

const COLORS = ["#173b78", "#f5b400", "#2a5db0", "#c98f00", "#7aa2e3", "#0f766e", "#be123c", "#64748b"];

export default function Reports() {
  const { orders, transactions, products } = useStore();
  const [from, setFrom] = useState(ymd(addDays(new Date(), -29)));
  const [to, setTo] = useState(ymd(new Date()));

  const r = useMemo(() => {
    const f = startOfDay(new Date(from + "T00:00:00")), t = endOfDay(new Date(to + "T00:00:00"));
    const os = validOrders(orders).filter((o) => inRange(o.createdAt, f, t));
    const txs = transactions.filter((x) => inRange(x.date, f, t));
    const revenue = os.reduce((a, b) => a + b.total, 0);
    const thu = sumTx(txs, "thu"), chi = sumTx(txs, "chi");
    const byCat = new Map<string, number>();
    const byProd = new Map<string, { name: string; qty: number; amount: number }>();
    os.forEach((o) => o.items.forEach((i) => {
      const cat = products.find((p) => p.id === i.productId)?.category ?? "khac";
      byCat.set(cat, (byCat.get(cat) ?? 0) + i.price * i.qty);
      const x = byProd.get(i.productId) ?? { name: i.name, qty: 0, amount: 0 }; x.qty += i.qty; x.amount += i.price * i.qty; byProd.set(i.productId, x);
    }));
    const expCat = new Map<string, number>();
    txs.filter((x) => x.type === "chi").forEach((x) => expCat.set(x.category, (expCat.get(x.category) ?? 0) + x.amount));
    const days = dailySeries(orders, transactions, f, t);
    return {
      os, revenue, thu, chi, profit: thu - chi, avg: os.length ? revenue / os.length : 0,
      online: os.filter((o) => o.channel === "online").length, counter: os.filter((o) => o.channel === "tai-quay").length,
      cat: Array.from(byCat, ([k, v]) => ({ name: CATEGORIES.find((c) => c.slug === k)?.name ?? "Khác", value: v })).sort((a, b) => b.value - a.value),
      prods: Array.from(byProd.values()).sort((a, b) => b.amount - a.amount).slice(0, 10),
      exp: Array.from(expCat, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      days: days.length > 31 ? days.filter((_, i) => i % Math.ceil(days.length / 31) === 0) : days,
    };
  }, [orders, transactions, products, from, to]);

  const exportCsv = () => {
    const rows = [["Mã đơn", "Ngày", "Khách", "SĐT", "Kênh", "Trạng thái", "Tổng tiền"], ...r.os.map((o) => [o.code, ymd(new Date(o.createdAt)), o.customerName, o.phone, o.channel, o.status, String(o.total)])];
    const csv = "﻿" + rows.map((x) => x.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `bao-cao-${from}_${to}.csv`; a.click();
  };

  return (
    <>
      <PageHeader title="Báo cáo" sub="Doanh thu, lợi nhuận, sản phẩm bán chạy" action={
        <div className="flex gap-2 print:hidden"><button className="btn-ghost" onClick={exportCsv}><Download size={18} /> Xuất CSV</button><button className="btn-ghost" onClick={() => window.print()}><Printer size={18} /> In</button></div>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-4 print:hidden">
        <Field label="Từ ngày"><input type="date" className="input" value={from} max={to} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="Đến ngày"><input type="date" className="input" value={to} min={from} onChange={(e) => setTo(e.target.value)} /></Field>
        <div className="flex items-end gap-2 sm:col-span-2">
          {[["7 ngày", 6], ["30 ngày", 29], ["90 ngày", 89]].map(([l, n]) => <button key={l} className="btn-ghost flex-1" onClick={() => { setFrom(ymd(addDays(new Date(), -(n as number)))); setTo(ymd(new Date())); }}>{l}</button>)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Doanh thu" value={vnd(r.revenue)} hint={`${r.os.length} đơn · TB ${vnd(r.avg)}`} tone="gold" />
        <StatCard label="Tổng thu" value={vnd(r.thu)} tone="green" />
        <StatCard label="Tổng chi" value={vnd(r.chi)} tone="red" />
        <StatCard label="Lợi nhuận" value={vnd(r.profit)} tone={r.profit >= 0 ? "green" : "red"} hint={`Online ${r.online} · Tại quầy ${r.counter}`} />
      </div>

      <section className="card mt-6 p-4 sm:p-5">
        <h2 className="mb-3 text-lg font-bold">Thu – chi theo ngày</h2>
        <div className="h-72"><ResponsiveContainer width="100%" height="100%">
          <BarChart data={r.days} margin={{ left: -10, right: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="ngay" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={vndShort} width={54} /><Tooltip formatter={(v: number) => vnd(v)} /><Legend />
            <Bar dataKey="thu" name="Thu" fill="#173b78" radius={[4, 4, 0, 0]} /><Bar dataKey="chi" name="Chi" fill="#f5b400" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer></div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {[["Doanh thu theo danh mục", r.cat], ["Chi phí theo hạng mục", r.exp]].map(([title, data]) => (
          <section key={title as string} className="card p-4 sm:p-5">
            <h2 className="mb-3 text-lg font-bold">{title as string}</h2>
            {(data as { name: string; value: number }[]).length === 0 ? <p className="py-10 text-center text-slate-500">Chưa có dữ liệu.</p> : (
              <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart>
                <Pie data={data as { name: string; value: number }[]} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>{(data as unknown[]).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
                <Tooltip formatter={(v: number) => vnd(v)} /><Legend /></PieChart></ResponsiveContainer></div>)}
          </section>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold">Top sản phẩm theo doanh thu</h2>
      <Table head={["#", "Sản phẩm", "Số lượng", "Doanh thu"]}>
        {r.prods.map((p, i) => <tr key={p.name}><td className="px-4 py-3">{i + 1}</td><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.qty}</td><td className="px-4 py-3 font-semibold">{vnd(p.amount)}</td></tr>)}
        {r.prods.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có dữ liệu.</td></tr>}
      </Table>
    </>
  );
}
