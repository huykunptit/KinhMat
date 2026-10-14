export const vnd = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "₫";

export const vndShort = (n: number) => {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + " tỷ";
  if (a >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + " tr";
  if (a >= 1e3) return Math.round(n / 1e3) + "k";
  return String(n);
};

export const dateVN = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export const dateTimeVN = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const STATUS_LABEL = {
  moi: "Mới",
  "xac-nhan": "Đã xác nhận",
  "dang-giao": "Đang giao",
  "hoan-thanh": "Hoàn thành",
  huy: "Đã huỷ",
} as const;

export const STATUS_STYLE: Record<string, string> = {
  moi: "bg-amber-100 text-amber-800",
  "xac-nhan": "bg-sky-100 text-sky-800",
  "dang-giao": "bg-indigo-100 text-indigo-800",
  "hoan-thanh": "bg-emerald-100 text-emerald-800",
  huy: "bg-rose-100 text-rose-800",
};

export const PAYMENT_LABEL = {
  cod: "Thanh toán khi nhận (COD)",
  "chuyen-khoan": "Chuyển khoản",
  "tai-cua-hang": "Thanh toán tại cửa hàng",
} as const;
