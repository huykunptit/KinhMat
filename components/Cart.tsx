"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { vnd } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { Order, Payment } from "@/lib/types";
import ProductImage from "./ProductImage";

export default function Cart() {
  const { cart, products, setQty, placeOrder } = useStore();
  const [done, setDone] = useState<Order | null>(null);
  const [f, setF] = useState({ name: "", phone: "", address: "", note: "", payment: "cod" as Payment });

  const lines = cart.map((l) => ({ l, p: products.find((p) => p.id === l.productId)! })).filter((x) => x.p);
  const sub = lines.reduce((a, { l, p }) => a + (p.salePrice ?? p.price) * l.qty, 0);
  const ship = sub === 0 || sub >= SITE.freeShipFrom ? 0 : SITE.shippingFee;

  if (done) return (
    <div className="container-x py-20 text-center">
      <CheckCircle2 className="mx-auto text-emerald-600" size={64} />
      <h1 className="mt-4 text-3xl font-bold">Đặt hàng thành công!</h1>
      <p className="mt-2">Mã đơn <b>{done.code}</b>. Cửa hàng sẽ gọi xác nhận qua số {done.phone}.</p>
      {done.payment === "chuyen-khoan" && <p className="mx-auto mt-4 max-w-md rounded-xl bg-brand-50 p-4 text-left">Chuyển khoản: <b>{SITE.bank.name}</b> · STK <b>{SITE.bank.number}</b> · {SITE.bank.holder}<br />Nội dung: <b>{done.code}</b></p>}
      <Link href="/san-pham" className="btn-primary mt-6">Tiếp tục mua sắm</Link>
    </div>
  );

  if (lines.length === 0) return (
    <div className="container-x py-24 text-center"><h1 className="text-2xl font-bold">Giỏ hàng trống</h1><Link href="/san-pham" className="btn-primary mt-5">Xem sản phẩm</Link></div>
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const o = placeOrder({
      customerName: f.name, phone: f.phone, address: f.address, note: f.note, payment: f.payment, channel: "online",
      items: lines.map(({ l, p }) => ({ productId: p.id, name: p.name, price: p.salePrice ?? p.price, qty: l.qty })),
    });
    setDone({ ...o, total: o.total + ship });
  };

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-bold">Giỏ hàng</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <ul className="space-y-3">
          {lines.map(({ l, p }) => (
            <li key={p.id} className="card flex gap-4 p-3">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl"><ProductImage p={p} className="!p-2" /></div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2"><Link href={`/san-pham/${p.slug}`} className="font-semibold hover:text-brand-600">{p.name}</Link>
                  <button onClick={() => setQty(p.id, 0)} aria-label="Xoá" className="text-slate-400 hover:text-rose-600"><Trash2 size={18} /></button></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button className="flex h-9 w-9 items-center justify-center" onClick={() => setQty(p.id, l.qty - 1)} aria-label="Giảm"><Minus size={16} /></button>
                    <span className="w-8 text-center font-semibold">{l.qty}</span>
                    <button className="flex h-9 w-9 items-center justify-center" onClick={() => setQty(p.id, Math.min(p.stock, l.qty + 1))} aria-label="Tăng"><Plus size={16} /></button>
                  </div>
                  <b className="text-brand-700">{vnd((p.salePrice ?? p.price) * l.qty)}</b>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <h2 className="text-xl font-bold">Thông tin đặt hàng</h2>
          <div><label className="label" htmlFor="n">Họ và tên</label><input id="n" required className="input" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><label className="label" htmlFor="p">Số điện thoại</label><input id="p" required inputMode="tel" pattern="0[0-9]{9}" title="Số điện thoại 10 số" className="input" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
          <div><label className="label" htmlFor="a">Địa chỉ nhận hàng</label><input id="a" required className="input" autoComplete="street-address" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
          <div><label className="label" htmlFor="g">Ghi chú (độ cận, màu…)</label><textarea id="g" rows={2} className="input" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
          <fieldset><legend className="label">Thanh toán</legend>
            {([["cod", "Thanh toán khi nhận hàng (COD)"], ["chuyen-khoan", "Chuyển khoản ngân hàng"]] as const).map(([v, t]) => (
              <label key={v} className="flex min-h-[44px] cursor-pointer items-center gap-2"><input type="radio" name="pay" className="h-4 w-4 accent-brand-700" checked={f.payment === v} onChange={() => setF({ ...f, payment: v })} /> {t}</label>
            ))}
          </fieldset>
          <dl className="space-y-1 border-t pt-3 text-[15px]">
            <div className="flex justify-between"><dt>Tạm tính</dt><dd>{vnd(sub)}</dd></div>
            <div className="flex justify-between"><dt>Phí giao hàng</dt><dd>{ship ? vnd(ship) : "Miễn phí"}</dd></div>
            <div className="flex justify-between text-lg font-bold"><dt>Tổng cộng</dt><dd className="text-brand-700">{vnd(sub + ship)}</dd></div>
          </dl>
          <button className="btn-gold w-full text-base">Đặt hàng</button>
        </form>
      </div>
    </div>
  );
}
