"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export default function BookingForm() {
  const { saveCustomer, customers } = useStore();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", date: "", need: "Đo mắt, cắt kính cận" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const note = `Đặt lịch: ${f.date || "sớm nhất"} — ${f.need}`;
    const ex = customers.find((c) => c.phone === f.phone);
    saveCustomer(ex ? { ...ex, note: [ex.note, note].filter(Boolean).join(" | ") } : { id: "", name: f.name, phone: f.phone, note, createdAt: new Date().toISOString() });
    setDone(true);
  };

  if (done) return (
    <div className="rounded-2xl bg-white p-8 text-center text-slate-800">
      <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
      <h3 className="mt-3 text-xl font-bold">Đã nhận lịch hẹn!</h3>
      <p className="mt-1">Cửa hàng sẽ gọi xác nhận cho bạn sớm nhất.</p>
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 text-slate-800 shadow-soft">
      <div><label className="label" htmlFor="bn">Họ và tên</label><input id="bn" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></div>
      <div><label className="label" htmlFor="bp">Số điện thoại</label><input id="bp" required inputMode="tel" pattern="0[0-9]{9}" title="Số điện thoại 10 số, bắt đầu bằng 0" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="bd">Ngày muốn đến</label><input id="bd" type="date" className="input" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
        <div><label className="label" htmlFor="bt">Nhu cầu</label>
          <select id="bt" className="input" value={f.need} onChange={(e) => setF({ ...f, need: e.target.value })}>
            {["Đo mắt, cắt kính cận", "Kính viễn / loạn", "Kính hai tròng – đa tròng", "Kính râm", "Kính cho bé", "Lens / kính áp tròng"].map((o) => <option key={o}>{o}</option>)}
          </select></div>
      </div>
      <button className="btn-gold w-full text-base">Đặt lịch đo mắt miễn phí</button>
    </form>
  );
}
