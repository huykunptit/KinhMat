import Glasses from "./Glasses";
import type { Product } from "@/lib/types";

export default function ProductImage({ p, className = "" }: { p: Product; className?: string }) {
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={p.name} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-brand-50 p-6 ${className}`}>
      <Glasses shape={p.shape} color={p.color} lens={p.lens} className="w-full max-w-[260px] drop-shadow-md" />
    </div>
  );
}
