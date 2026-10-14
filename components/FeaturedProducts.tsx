"use client";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { products } = useStore();
  const list = products.filter((p) => p.featured).slice(0, 8);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {list.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
