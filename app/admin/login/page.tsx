"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Header";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { router.replace("/admin"); router.refresh(); } else { setErr("Sai mật khẩu, vui lòng thử lại."); setBusy(false); }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-900 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="text-center text-xl font-bold">Đăng nhập quản trị</h1>
        <div>
          <label htmlFor="pw" className="label">Mật khẩu</label>
          <div className="relative"><Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input id="pw" type="password" autoFocus required className="input !pl-10" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></div>
          {err && <p role="alert" className="mt-2 text-sm font-semibold text-rose-600">{err}</p>}
        </div>
        <button disabled={busy} className="btn-primary w-full">{busy ? "Đang kiểm tra…" : "Đăng nhập"}</button>
      </form>
    </main>
  );
}
