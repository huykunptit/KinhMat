"use client";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { STATUS_LABEL, STATUS_STYLE } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>{sub && <p className="text-slate-600">{sub}</p>}</div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "brand" }: { label: string; value: string; hint?: string; tone?: "brand" | "green" | "red" | "gold" }) {
  const c = { brand: "text-brand-700", green: "text-emerald-700", red: "text-rose-700", gold: "text-gold-600" }[tone];
  return (
    <div className="card p-4 sm:p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${c}`}>{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function StatusBadge({ s }: { s: OrderStatus }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[s]}`}>{STATUS_LABEL[s]}</span>;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button className="btn-ghost !px-2.5" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="label">{label}</span>{children}</label>;
}

/** Bảng có thể cuộn ngang trên mobile */
export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="border-b bg-slate-50 text-sm text-slate-600"><tr>{head.map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}
