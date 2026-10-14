import type { Order, Transaction } from "./types";
import { ymd } from "./format";

export const inRange = (iso: string, from: Date, to: Date) => { const t = new Date(iso).getTime(); return t >= from.getTime() && t <= to.getTime(); };
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const validOrders = (orders: Order[]) => orders.filter((o) => o.status !== "huy");

export function sumTx(txs: Transaction[], type: "thu" | "chi") {
  return txs.filter((t) => t.type === type).reduce((a, b) => a + b.amount, 0);
}

/** Doanh thu / thu / chi theo từng ngày trong khoảng */
export function dailySeries(orders: Order[], txs: Transaction[], from: Date, to: Date) {
  const map = new Map<string, { ngay: string; doanhThu: number; thu: number; chi: number }>();
  for (let d = startOfDay(from); d <= to; d = addDays(d, 1)) {
    map.set(ymd(d), { ngay: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`, doanhThu: 0, thu: 0, chi: 0 });
  }
  for (const o of validOrders(orders)) { const r = map.get(ymd(new Date(o.createdAt))); if (r) r.doanhThu += o.total; }
  for (const t of txs) { const r = map.get(ymd(new Date(t.date))); if (r) r[t.type] += t.amount; }
  return Array.from(map.values());
}
