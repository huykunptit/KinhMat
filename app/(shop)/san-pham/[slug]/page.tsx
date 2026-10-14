import ProductDetail from "@/components/ProductDetail";
import { PRODUCTS } from "@/lib/seed";

export function generateStaticParams() { return PRODUCTS.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = PRODUCTS.find((x) => x.slug === params.slug);
  return { title: p?.name ?? "Sản phẩm", description: p?.desc };
}
export default function Page({ params }: { params: { slug: string } }) { return <ProductDetail slug={params.slug} />; }
