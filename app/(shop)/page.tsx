import Link from "next/link";
import { BadgeCheck, Eye, Glasses as GlassesIcon, MapPin, Phone, ShieldCheck, Truck, Clock, Star } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/seed";
import FeaturedProducts from "@/components/FeaturedProducts";
import BookingForm from "@/components/BookingForm";

const SERVICES = [
  { t: "Cận thị · Viễn thị · Loạn thị", d: "Đo khám bằng máy hiện đại, cắt kính chính xác" },
  { t: "Kính hai tròng · ba tròng", d: "Nhìn xa gần rõ nét cho người trung niên" },
  { t: "Đo mắt miễn phí", d: "Không mua cũng được tư vấn tận tình" },
  { t: "Lắp kính nhanh", d: "Nhiều mắt kính lấy ngay trong ngày" },
];
const REVIEWS = [
  { n: "Chị Hương, Cầu Diễn", t: "Nhân viên đo mắt kỹ, tư vấn nhiệt tình. Đeo kính mới rất thoải mái, không chóng mặt." },
  { n: "Anh Tuấn, Xuân Phương", t: "Cắt kính hai tròng cho bố, giá hợp lý, lấy kính nhanh. Sẽ quay lại." },
  { n: "Cô Lan, Mỹ Đình", t: "Cửa hàng sạch sẽ, nhiều mẫu gọng đẹp, bảo hành chu đáo." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-800 text-white">
        <div className="container-x grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 text-sm font-semibold text-gold-400"><Eye size={16} /> Đo khám mắt miễn phí</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">Mắt sáng rõ,<br /><span className="text-gold-400">phong cách chuẩn.</span></h1>
            <p className="mt-5 max-w-xl text-lg text-brand-100">{SITE.tagline}. Hàng trăm mẫu gọng, tròng kính chính hãng, giá rõ ràng, bảo hành dài hạn tại Cầu Diễn.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/san-pham" className="btn-gold text-base">Xem sản phẩm</Link>
              <Link href="/#dat-lich" className="btn border border-white/40 text-base text-white hover:bg-white/10">Đặt lịch đo mắt</Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
              <li className="flex items-center gap-1.5"><BadgeCheck size={18} className="text-gold-400" /> Hàng chính hãng</li>
              <li className="flex items-center gap-1.5"><ShieldCheck size={18} className="text-gold-400" /> Bảo hành dài hạn</li>
              <li className="flex items-center gap-1.5"><Clock size={18} className="text-gold-400" /> {SITE.hours}</li>
            </ul>
          </div>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mat-tien.jpg" alt={`Mặt tiền ${SITE.name} tại Cầu Diễn`} className="aspect-[4/3] w-full rounded-3xl border-4 border-gold-500/60 object-cover shadow-2xl" />
            <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-800 shadow-soft">
              <MapPin className="text-brand-600" /><span className="text-sm font-semibold">185 Cầu Diễn, Hà Nội</span>
            </div>
          </div>
        </div>
      </section>

      {/* DỊCH VỤ */}
      <section className="container-x -mt-1 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.t} className="card flex gap-3 p-5">
              <GlassesIcon className="mt-0.5 shrink-0 text-gold-600" />
              <div><h3 className="font-bold">{s.t}</h3><p className="mt-1 text-sm text-slate-600">{s.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* DANH MỤC */}
      <section className="container-x py-10" id="danh-muc">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <p className="mt-2 text-slate-600">Chọn nhóm sản phẩm bạn đang cần.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} className="card group p-5 transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-soft">
              <div className="text-4xl">{c.emoji}</div>
              <h3 className="mt-3 font-bold group-hover:text-brand-600">{c.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* NỔI BẬT */}
      <section className="container-x py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><h2 className="section-title">Sản phẩm nổi bật</h2><p className="mt-2 text-slate-600">Được khách hàng chọn nhiều nhất.</p></div>
          <Link href="/san-pham" className="btn-ghost shrink-0">Xem tất cả</Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* VÌ SAO CHỌN */}
      <section className="bg-white py-14">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-brand-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/trong-cua-hang.jpg" alt="Không gian bên trong cửa hàng" className="mx-auto h-[420px] w-full object-cover" />
          </div>
          <div>
            <h2 className="section-title">Vì sao chọn {SITE.name}?</h2>
            <ul className="mt-6 space-y-5">
              {[
                [Eye, "Đo mắt chuẩn, miễn phí", "Kỹ thuật viên có kinh nghiệm, máy đo hiện đại."],
                [ShieldCheck, "Chính hãng – bảo hành rõ ràng", "Tròng và gọng có nguồn gốc, bảo hành & thay tròng ưu đãi."],
                [Truck, "Giao hàng toàn quốc", `Miễn phí ship đơn từ ${new Intl.NumberFormat("vi-VN").format(SITE.freeShipFrom)}₫.`],
              ].map(([Icon, t, d]) => {
                const I = Icon as typeof Eye;
                return <li key={t as string} className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-600"><I /></span><div><h3 className="font-bold">{t as string}</h3><p className="text-slate-600">{d as string}</p></div></li>;
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ĐÁNH GIÁ */}
      <section className="container-x py-14">
        <h2 className="section-title text-center">Khách hàng nói gì</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="card p-6">
              <div className="flex gap-0.5 text-gold-500">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
              <blockquote className="mt-3 text-slate-700">“{r.t}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold">{r.n}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ĐẶT LỊCH */}
      <section id="dat-lich" className="scroll-mt-24 bg-brand-800 py-14">
        <div className="container-x grid items-center gap-10 md:grid-cols-2">
          <div className="text-white">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Đặt lịch đo mắt <span className="text-gold-400">miễn phí</span></h2>
            <p className="mt-4 text-lg text-brand-100">Để lại số điện thoại, cửa hàng gọi xác nhận ngay. Hoặc gọi trực tiếp:</p>
            <a href={`tel:${SITE.tel}`} className="btn-gold mt-5 text-lg"><Phone /> {SITE.phone}</a>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* LIÊN HỆ */}
      <section id="lien-he" className="container-x scroll-mt-24 py-14">
        <h2 className="section-title">Ghé cửa hàng</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-5">
          <div className="card space-y-4 p-6 md:col-span-2">
            <p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-brand-600" /> <span><b>Địa chỉ</b><br />{SITE.address}</span></p>
            <p className="flex gap-3"><Phone className="mt-1 shrink-0 text-brand-600" /> <span><b>Điện thoại / Zalo</b><br /><a className="text-brand-700 underline" href={`tel:${SITE.tel}`}>{SITE.phone}</a></span></p>
            <p className="flex gap-3"><Clock className="mt-1 shrink-0 text-brand-600" /> <span><b>Giờ mở cửa</b><br />{SITE.hours}</span></p>
            <a className="btn-primary w-full" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`}>Chỉ đường Google Maps</a>
          </div>
          <iframe title="Bản đồ cửa hàng" loading="lazy" className="h-72 w-full rounded-2xl border border-slate-200 md:col-span-3 md:h-full md:min-h-[320px]" src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} />
        </div>
      </section>
    </>
  );
}
