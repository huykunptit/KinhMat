import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/seed";
import { Logo } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-900 text-brand-100">
      <div className="container-x grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm">{SITE.tagline}. Đo khám mắt miễn phí, tư vấn tận tâm, lắp kính nhanh trong ngày.</p>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">Danh mục</h3>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => <li key={c.slug}><Link className="hover:text-gold-400" href={`/san-pham?danh-muc=${c.slug}`}>{c.name}</Link></li>)}
          </ul>
        </div>
        <div id="lien-he-footer" className="space-y-3">
          <h3 className="mb-3 text-lg font-bold text-white">Liên hệ</h3>
          <p className="flex gap-2"><MapPin className="mt-1 shrink-0 text-gold-400" size={18} /> {SITE.address}</p>
          <p className="flex gap-2"><Phone className="mt-1 shrink-0 text-gold-400" size={18} /> <a href={`tel:${SITE.tel}`} className="font-semibold text-white">{SITE.phone}</a></p>
          <p className="flex gap-2"><Clock className="mt-1 shrink-0 text-gold-400" size={18} /> {SITE.hours}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm">© {new Date().getFullYear()} {SITE.name}. <Link href="/admin" className="underline-offset-2 hover:underline">Quản trị</Link></div>
    </footer>
  );
}
