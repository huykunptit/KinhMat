import { Suspense } from "react";
import type { Metadata } from "next";
import ProductList from "@/components/ProductList";

export const metadata: Metadata = { title: "Sản phẩm" };

export default function Page() {
  return <Suspense fallback={<div className="container-x py-20 text-center">Đang tải…</div>}><ProductList /></Suspense>;
}
