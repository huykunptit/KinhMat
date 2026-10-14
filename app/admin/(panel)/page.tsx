"use client";
import Link from "next/link";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { vnd, vndShort, dateTimeVN } from "@/lib/format";
import { PageHeader, StatCard, StatusBadge } from "@/components/admin/ui";
import { addDays, dailySeries, endOfDay, inRange, startOfDay, sumTx, validOrders } from "@/lib/report";

export default function Dashboard() {
  const { orders, transactions, products, customers } = useStore();
  const d = useMemo(() => {
    const now = new Date();
    const today = [startOfDay(now), endOfDay(now)] as const;
    const month = [new Date(now.getFullYear(), now.getMonth(), 1), endOfDay(now)] as const;
    const valid = validOrders(orders);
    const rev = (r: readonly [Date, Date]) => valid.filter((o) => inRange(o.createdAt, ...r)).reduce((a, b) => a + b.total, 0);
    const mtx = transactions.filter((t) => inRange(t.date, ...month));
    const thu = sumTx(mtx, "thu"), chi = sumTx(mtx, "chi");
    const series = dailySeries(orders, transactions, addDays(now, -29), endOfDay(now));
    const sold = new Map<string, { name: string; qty: number }>();
    valid.filter((o) => inRange(o.createdAt, ...month)).forEach((o) => o.items.forEach((i) => { const r = sold.get(i.productId) ?? { name: i.name, qty: 0 }; r.qty += i.qty; sold.set(i.productId, r); }));
    return {
      revToday: rev(today), revMonth: rev(month), thu, chi, profit: thu - chi,
      ordersToday: valid.filter((o) => inRange(o.createdAt, ...today)).length,
      series, top: Array.from(sold.values()).sort((a, b) => b.qty - a.qty).slice(0, 5),
    };
  }, [orders, transactions]);
  const low = products.filter((p) => p.stock <= 5);

  return (
    <>
      <PageHeader title="Tổng quan" sub="Tình hình kinh doanh cửa hàng" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Doanh thu hôm nay" value={vnd(d.revToday)} hint={`${d.ordersToday} đơn`} />
        <StatCard label="Doanh thu tháng này" value={vnd(d.revMonth)} tone="gold" />
        <StatCard label="Chi tháng này" value={vnd(d.chi)} tone="red" />
        <StatCard label="Lợi nhuận (thu − chi)" value={vnd(d.profit)} tone={d.profit >= 0 ? "green" : "red"} hint={`${customers.length} khách hàng`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card p-4 sm:p-5 xl:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Doanh thu 30 ngày gần nhất</h2>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.series} margin={{ left: -10, right: 8, top: 5 }}>
                <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f5b400" stopOpacity={0.5} /><stop offset="95%" stopColor="#f5b400" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="ngay" tick={{ fontSize: 12 }} interval={4} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={vndShort} width={54} />
                <Tooltip formatter={(v: number) => vnd(v)} />
                <Area type="monotone" dataKey="doanhThu" name="Doanh thu" stroke="#c98f00" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card p-4 sm:p-5">
          <h2 className="mb-3 text-lg font-bold">Bán chạy tháng này</h2>
          <ol className="space-y-3">
            {d.top.length === 0 && <li className="text-slate-500">Chưa có dữ liệu.</li>}
            {d.top.map((t, i) => <li key={t.name} className="flex items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{i + 1}</span><span className="flex-1 leading-snug">{t.name}</span><b>{t.qty}</b></li>)}
          </ol>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card p-4 sm:p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Đơn hàng mới nhất</h2><Link href="/admin/don-hang" className="text-sm font-semibold text-brand-700 underline">Xem tất cả</Link></div>
          <ul className="divide-y">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div><b>{o.code}</b> · {o.customerName}<p className="text-sm text-slate-500">{dateTimeVN(o.createdAt)}</p></div>
                <div className="flex items-center gap-3"><b>{vnd(o.total)}</b><StatusBadge s={o.status} /></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-4 sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><AlertTriangle className="text-amber-600" size={20} /> Sắp hết hàng</h2>
          <ul className="space-y-2">
            {low.length === 0 && <li className="text-slate-500">Tồn kho ổn định.</li>}
            {low.slice(0, 8).map((p) => <li key={p.id} className="flex justify-between gap-2"><span className="leading-snug">{p.name}</span><b className={p.stock === 0 ? "text-rose-600" : "text-amber-700"}>{p.stock}</b></li>)}
          </ul>
        </section>
      </div>
    </>
  );
}
