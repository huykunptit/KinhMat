import type { Category, Product, Customer, Order, Transaction, OrderStatus, Payment } from "./types";
import { ymd } from "./format";

export const CATEGORIES: Category[] = [
  { slug: "gong-kinh", name: "Gọng kính cận", desc: "Gọng nhẹ, bền, hợp mọi khuôn mặt", emoji: "👓" },
  { slug: "kinh-ram", name: "Kính râm", desc: "Chống UV400, phân cực", emoji: "🕶️" },
  { slug: "trong-kinh", name: "Tròng kính", desc: "Chiết suất cao, chống chói", emoji: "🔍" },
  { slug: "da-trong", name: "Kính hai tròng · đa tròng", desc: "Nhìn xa gần rõ nét, tư vấn tận tình", emoji: "🔭" },
  { slug: "chong-anh-sang-xanh", name: "Chống ánh sáng xanh", desc: "Bảo vệ mắt khi dùng máy tính", emoji: "💻" },
  { slug: "kinh-ap-trong", name: "Kính áp tròng", desc: "Lens ngày, lens tháng, lens màu", emoji: "👁️" },
  { slug: "kinh-tre-em", name: "Kính trẻ em", desc: "Dẻo, an toàn, nhiều màu", emoji: "🧒" },
  { slug: "phu-kien", name: "Phụ kiện", desc: "Hộp, khăn lau, dung dịch, dây đeo", emoji: "🧴" },
];

const P = (p: Omit<Product, "id" | "slug"> & { slug: string }, i: number): Product => ({ id: "p" + (i + 1), ...p });

export const PRODUCTS: Product[] = [
  P({ slug: "gong-titan-nhe-tm01", name: "Gọng Titanium siêu nhẹ TM01", brand: "Thành Vinh", category: "gong-kinh", price: 1290000, salePrice: 990000, stock: 18, color: "#2b2b2b", shape: "rect", material: "Titanium", desc: "Gọng titanium chỉ nặng 8g, không gây dị ứng, đàn hồi tốt. Phù hợp đeo cả ngày.", featured: true }, 0),
  P({ slug: "gong-nhua-tron-vintage", name: "Gọng nhựa tròn Vintage", brand: "Retro", category: "gong-kinh", price: 650000, stock: 25, color: "#8a5a2b", shape: "round", material: "Nhựa Acetate", desc: "Phong cách cổ điển, màu đồi mồi, hợp khuôn mặt vuông và dài.", featured: true }, 1),
  P({ slug: "gong-kim-loai-vuong", name: "Gọng kim loại vuông thanh mảnh", brand: "Lumi", category: "gong-kinh", price: 890000, stock: 12, color: "#b0894f", shape: "square", material: "Hợp kim", desc: "Thiết kế thanh lịch, phù hợp dân văn phòng.", featured: false }, 2),
  P({ slug: "gong-mat-meo-nu", name: "Gọng mắt mèo nữ tính", brand: "Lumi", category: "gong-kinh", price: 790000, salePrice: 690000, stock: 9, color: "#a23a52", shape: "cat", material: "Nhựa TR90", desc: "Dáng mắt mèo thời trang, nhẹ và dẻo.", featured: true }, 3),
  P({ slug: "gong-oval-gong-mong", name: "Gọng oval gọng mỏng", brand: "Thành Vinh", category: "gong-kinh", price: 720000, stock: 0, color: "#6b7f8c", shape: "oval", material: "Hợp kim", desc: "Nhẹ, thanh thoát, tặng kèm hộp da.", featured: false }, 4),
  P({ slug: "ram-aviator-phan-cuc", name: "Kính râm Aviator phân cực", brand: "Sunway", category: "kinh-ram", price: 1190000, salePrice: 890000, stock: 20, color: "#c8963e", lens: "#2e3b2f", shape: "aviator", material: "Kim loại", desc: "Tròng phân cực chống chói, chống UV400. Lái xe, đi biển đều hợp.", featured: true }, 5),
  P({ slug: "ram-vuong-oversize", name: "Kính râm vuông oversize", brand: "Sunway", category: "kinh-ram", price: 950000, stock: 14, color: "#1a1a1a", lens: "#3a3a3a", shape: "square", material: "Nhựa Acetate", desc: "Dáng lớn che nắng tốt, phong cách tối giản.", featured: true }, 6),
  P({ slug: "ram-tron-gradient", name: "Kính râm tròn gradient", brand: "Retro", category: "kinh-ram", price: 780000, stock: 16, color: "#5a3a22", lens: "#6b4a34", shape: "round", material: "Nhựa TR90", desc: "Tròng chuyển màu thời trang, UV400.", featured: false }, 7),
  P({ slug: "ram-mat-meo-nu", name: "Kính râm mắt mèo", brand: "Lumi", category: "kinh-ram", price: 850000, stock: 7, color: "#d8b4a0", lens: "#4a3a3a", shape: "cat", material: "Nhựa Acetate", desc: "Nữ tính, hợp du lịch chụp ảnh.", featured: false }, 8),
  P({ slug: "trong-chiet-suat-1-67", name: "Tròng kính chiết suất 1.67 mỏng nhẹ", brand: "Essilor", category: "trong-kinh", price: 1800000, stock: 40, color: "#9bb7c4", shape: "round", material: "Nhựa cao cấp", desc: "Dành cho độ cận cao, mỏng hơn 30%. Chống trầy, chống chói. Giá/cặp.", featured: true }, 9),
  P({ slug: "trong-doi-mau", name: "Tròng đổi màu chống UV", brand: "Hoya", category: "trong-kinh", price: 1500000, stock: 30, color: "#9bb7c4", shape: "round", material: "Nhựa", desc: "Tự đổi màu khi ra nắng, trong suốt khi vào nhà. Giá/cặp.", featured: false }, 10),
  P({ slug: "trong-da-tuyen-tinh", name: "Tròng đa tròng (progressive) nhìn xa – gần", brand: "Essilor", category: "da-trong", price: 3200000, stock: 20, color: "#9bb7c4", shape: "round", material: "Nhựa cao cấp", desc: "Một cặp kính cho mọi khoảng cách, phù hợp người trên 40 tuổi. Có đo mắt và tư vấn trực tiếp. Giá/cặp.", featured: true }, 18),
  P({ slug: "trong-chong-anh-sang-xanh", name: "Tròng chống ánh sáng xanh", brand: "Chemi", category: "chong-anh-sang-xanh", price: 750000, stock: 50, color: "#8ad0e0", shape: "round", material: "Nhựa", desc: "Lọc ánh sáng xanh từ màn hình, giảm mỏi mắt. Giá/cặp.", featured: true }, 11),
  P({ slug: "gong-chong-xanh-khong-do", name: "Kính chống ánh sáng xanh không độ", brand: "Lumi", category: "chong-anh-sang-xanh", price: 390000, salePrice: 290000, stock: 35, color: "#3b4a6b", lens: "#cfe9f2", shape: "rect", material: "Nhựa TR90", desc: "Dành cho người làm việc máy tính nhiều giờ.", featured: false }, 12),
  P({ slug: "lens-ngay-30-mieng", name: "Kính áp tròng 1 ngày (hộp 30 miếng)", brand: "Acuvue", category: "kinh-ap-trong", price: 520000, stock: 60, color: "#9bb7c4", shape: "round", material: "Hydrogel", desc: "Thoải mái cả ngày, tiện lợi khi du lịch.", featured: false }, 13),
  P({ slug: "lens-thang-mau-nau", name: "Lens tháng màu nâu tự nhiên", brand: "Seed", category: "kinh-ap-trong", price: 320000, stock: 44, color: "#7a5230", shape: "round", material: "Silicone Hydrogel", desc: "Dùng 1 tháng, màu tự nhiên, không viền gắt.", featured: false }, 14),
  P({ slug: "kinh-tre-em-deo", name: "Gọng trẻ em dẻo siêu bền", brand: "KidZ", category: "kinh-tre-em", price: 450000, stock: 22, color: "#e0793c", shape: "round", material: "Silicone", desc: "Uốn cong không gãy, an toàn cho bé 3–10 tuổi.", featured: true }, 15),
  P({ slug: "hop-kinh-da", name: "Hộp đựng kính da PU", brand: "Thành Vinh", category: "phu-kien", price: 120000, stock: 80, color: "#6b4a34", shape: "rect", material: "Da PU", desc: "Hộp cứng bảo vệ kính khỏi va đập.", featured: false }, 16),
  P({ slug: "dung-dich-ve-sinh", name: "Dung dịch & khăn lau kính", brand: "Thành Vinh", category: "phu-kien", price: 55000, stock: 120, color: "#9bb7c4", shape: "rect", material: "—", desc: "Làm sạch, chống hơi nước, không để lại vệt.", featured: false }, 17),
];

// ---- dữ liệu mẫu cho trang quản trị (sinh một lần ở trình duyệt, lưu localStorage) ----
const FIRST = ["Nguyễn Văn An", "Trần Thị Bích", "Lê Hoàng Nam", "Phạm Minh Châu", "Võ Thanh Hà", "Đặng Quốc Huy", "Bùi Thu Trang", "Hoàng Gia Bảo", "Đỗ Ngọc Lan", "Ngô Đức Thịnh", "Vũ Khánh Linh", "Phan Tuấn Kiệt"];
const STREETS = ["Q.1, TP.HCM", "Q.3, TP.HCM", "Q. Bình Thạnh, TP.HCM", "Q. Cầu Giấy, Hà Nội", "TP. Thủ Đức, TP.HCM", "Q. Hải Châu, Đà Nẵng"];

export function buildSeed(now = new Date()) {
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

  const customers: Customer[] = FIRST.map((name, i) => ({
    id: "c" + (i + 1),
    name,
    phone: "09" + String(10000000 + Math.floor(rnd() * 89999999)),
    email: i % 3 === 0 ? `khach${i + 1}@email.com` : undefined,
    address: pick(STREETS),
    note: i % 2 === 0 ? `Độ cận: ${(1 + rnd() * 4).toFixed(2).replace(/0$/, "")} / ${(1 + rnd() * 4).toFixed(2).replace(/0$/, "")}` : "",
    createdAt: new Date(now.getTime() - (80 - i * 5) * 86400000).toISOString(),
  }));

  const orders: Order[] = [];
  const txs: Transaction[] = [];
  const statuses: OrderStatus[] = ["hoan-thanh", "hoan-thanh", "hoan-thanh", "hoan-thanh", "dang-giao", "xac-nhan", "moi", "huy"];
  const pays: Payment[] = ["cod", "chuyen-khoan", "tai-cua-hang"];

  for (let i = 0; i < 46; i++) {
    const daysAgo = Math.floor(rnd() * rnd() * 75);
    const created = new Date(now.getTime() - daysAgo * 86400000 - Math.floor(rnd() * 40000000));
    const c = pick(customers);
    const nItems = 1 + Math.floor(rnd() * 2);
    const items = Array.from({ length: nItems }, () => {
      const p = pick(PRODUCTS);
      return { productId: p.id, name: p.name, price: p.salePrice ?? p.price, qty: 1 };
    });
    const total = items.reduce((a, b) => a + b.price * b.qty, 0);
    const status = daysAgo > 3 ? (rnd() > 0.1 ? "hoan-thanh" : "huy") : pick(statuses);
    const channel = rnd() > 0.45 ? "tai-quay" : "online";
    const payment: Payment = channel === "tai-quay" ? "tai-cua-hang" : pick(pays.slice(0, 2));
    const paid = status === "hoan-thanh";
    const id = "o" + (i + 1);
    orders.push({
      id, code: "DH" + String(1000 + i), customerName: c.name, phone: c.phone, address: c.address ?? "",
      items, total, status, payment, paid, channel, createdAt: created.toISOString(),
    });
    if (paid) txs.push({ id: "t-" + id, type: "thu", category: "Bán hàng", amount: total, note: `Đơn ${"DH" + (1000 + i)}`, date: created.toISOString(), orderId: id });
  }

  const costs: [string, string, number][] = [
    ["Thuê mặt bằng", "Tiền thuê cửa hàng", 12000000],
    ["Nhập hàng", "Nhập gọng kính từ nhà cung cấp", 9500000],
    ["Nhập hàng", "Nhập tròng kính", 6800000],
    ["Lương nhân viên", "Lương nhân viên bán hàng", 14000000],
    ["Điện nước", "Điện, nước, internet", 2100000],
    ["Marketing", "Quảng cáo Facebook/Zalo", 3000000],
  ];
  for (let m = 0; m < 3; m++) {
    costs.forEach(([cat, note, amt], i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 3 + i * 3, 10);
      if (d <= now) txs.push({ id: `tc-${m}-${i}`, type: "chi", category: cat, amount: amt + Math.round((rnd() - 0.5) * amt * 0.1), note, date: d.toISOString() });
    });
  }
  txs.push({ id: "tt-x", type: "thu", category: "Dịch vụ", amount: 450000, note: "Phí đo mắt & lắp kính", date: new Date(now.getTime() - 86400000 * 2).toISOString() });
  void ymd;
  return { customers, orders: orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), transactions: txs.sort((a, b) => b.date.localeCompare(a.date)) };
}
