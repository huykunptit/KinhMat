"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Customer, Order, OrderStatus, Product, Transaction } from "./types";
import { PRODUCTS, buildSeed } from "./seed";

/**
 * Kho dữ liệu chạy phía trình duyệt (localStorage) để demo chạy ngay, không cần database.
 * Khi chạy thật hãy thay các hàm trong file này bằng gọi API/DB (Supabase, Vercel Postgres...).
 */
const KEY = "thanhvinh.v1";

interface Data {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  transactions: Transaction[];
  cart: CartLine[];
}

interface Ctx extends Data {
  ready: boolean;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (o: Omit<Order, "id" | "code" | "createdAt" | "status" | "paid" | "total">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  markPaid: (id: string, paid: boolean) => void;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  saveCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  saveTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  resetDemo: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);
const fresh = (): Data => ({ products: PRODUCTS, cart: [], ...buildSeed() });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ products: PRODUCTS, orders: [], customers: [], transactions: [], cart: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded: Data | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw);
    } catch {}
    setData(loaded ?? fresh());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, ready]);

  const update = useCallback((fn: (d: Data) => Data) => setData((d) => fn(d)), []);
  const restock = (products: Product[], order: Order, sign: 1 | -1) =>
    products.map((p) => {
      const it = order.items.find((i) => i.productId === p.id);
      return it ? { ...p, stock: Math.max(0, p.stock + sign * it.qty) } : p;
    });

  const value = useMemo<Ctx>(() => ({
    ...data,
    ready,
    addToCart: (productId, qty = 1) => update((d) => {
      const ex = d.cart.find((l) => l.productId === productId);
      const cart = ex ? d.cart.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l)) : [...d.cart, { productId, qty }];
      return { ...d, cart };
    }),
    setQty: (productId, qty) => update((d) => ({ ...d, cart: qty <= 0 ? d.cart.filter((l) => l.productId !== productId) : d.cart.map((l) => (l.productId === productId ? { ...l, qty } : l)) })),
    clearCart: () => update((d) => ({ ...d, cart: [] })),

    placeOrder: (o) => {
      const total = o.items.reduce((a, b) => a + b.price * b.qty, 0);
      const order: Order = {
        ...o, id: "o" + uid(), code: "DH" + (1000 + data.orders.length), total,
        status: o.channel === "tai-quay" ? "hoan-thanh" : "moi", paid: o.channel === "tai-quay", createdAt: new Date().toISOString(),
      };
      update((d) => {
        let customers = d.customers;
        if (!customers.some((c) => c.phone === o.phone)) {
          customers = [{ id: "c" + uid(), name: o.customerName, phone: o.phone, address: o.address, createdAt: order.createdAt }, ...customers];
        }
        const transactions = order.paid
          ? [{ id: "t" + uid(), type: "thu" as const, category: "Bán hàng", amount: total, note: `Đơn ${order.code}`, date: order.createdAt, orderId: order.id }, ...d.transactions]
          : d.transactions;
        return { ...d, orders: [order, ...d.orders], customers, products: restock(d.products, order, -1), transactions, cart: o.channel === "online" ? [] : d.cart };
      });
      return order;
    },
    updateOrderStatus: (id, status) => update((d) => {
      const order = d.orders.find((o) => o.id === id);
      if (!order) return d;
      let products = d.products;
      if (status === "huy" && order.status !== "huy") products = restock(products, order, 1);
      if (order.status === "huy" && status !== "huy") products = restock(products, order, -1);
      const transactions = status === "huy" ? d.transactions.filter((t) => t.orderId !== id) : d.transactions;
      const paid = status === "huy" ? false : order.paid;
      return { ...d, products, transactions, orders: d.orders.map((o) => (o.id === id ? { ...o, status, paid } : o)) };
    }),
    markPaid: (id, paid) => update((d) => {
      const order = d.orders.find((o) => o.id === id);
      if (!order) return d;
      let transactions = d.transactions.filter((t) => t.orderId !== id);
      if (paid) transactions = [{ id: "t" + uid(), type: "thu", category: "Bán hàng", amount: order.total, note: `Đơn ${order.code}`, date: new Date().toISOString(), orderId: id }, ...transactions];
      return { ...d, transactions, orders: d.orders.map((o) => (o.id === id ? { ...o, paid } : o)) };
    }),

    saveProduct: (p) => update((d) => ({ ...d, products: d.products.some((x) => x.id === p.id) ? d.products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: p.id || "p" + uid() }, ...d.products] })),
    deleteProduct: (id) => update((d) => ({ ...d, products: d.products.filter((p) => p.id !== id), cart: d.cart.filter((l) => l.productId !== id) })),
    saveCustomer: (c) => update((d) => ({ ...d, customers: d.customers.some((x) => x.id === c.id) ? d.customers.map((x) => (x.id === c.id ? c : x)) : [{ ...c, id: c.id || "c" + uid() }, ...d.customers] })),
    deleteCustomer: (id) => update((d) => ({ ...d, customers: d.customers.filter((c) => c.id !== id) })),
    saveTransaction: (t) => update((d) => ({ ...d, transactions: (d.transactions.some((x) => x.id === t.id) ? d.transactions.map((x) => (x.id === t.id ? t : x)) : [{ ...t, id: t.id || "t" + uid() }, ...d.transactions]).sort((a, b) => b.date.localeCompare(a.date)) })),
    deleteTransaction: (id) => update((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) })),
    resetDemo: () => setData(fresh()),
  }), [data, ready, update]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore phải nằm trong StoreProvider");
  return c;
}
