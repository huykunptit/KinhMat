export type Shape = "round" | "square" | "rect" | "cat" | "aviator" | "oval";

export interface Category {
  slug: string;
  name: string;
  desc: string;
  emoji: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  color: string; // màu gọng (hex)
  lens?: string; // màu tròng (hex), dùng cho kính râm
  shape: Shape;
  material: string;
  desc: string;
  image?: string; // URL ảnh thật (nếu có), nếu trống sẽ vẽ minh hoạ
  featured?: boolean;
}

export type OrderStatus = "moi" | "xac-nhan" | "dang-giao" | "hoan-thanh" | "huy";
export type Payment = "cod" | "chuyen-khoan" | "tai-cua-hang";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  payment: Payment;
  paid: boolean;
  channel: "online" | "tai-quay";
  note?: string;
  createdAt: string; // ISO
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string; // vd: độ cận, loại tròng hay dùng
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "thu" | "chi";
  category: string;
  amount: number;
  note: string;
  date: string; // ISO
  orderId?: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}
