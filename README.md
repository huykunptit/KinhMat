# Mắt Kính Thành Vinh — Website bán kính + Trang quản trị

Next.js 14 (App Router) · Tailwind CSS · Recharts · Font Be Vietnam Pro (đủ dấu tiếng Việt, tự host qua npm — không phụ thuộc Google Fonts).

## Chạy thử
```bash
npm install
npm run dev        # http://localhost:3000
```
- **Website bán hàng:** `/`, `/san-pham`, `/san-pham/[slug]`, `/gio-hang`
- **Quản trị:** `/admin` — mật khẩu mặc định `admin123` (đổi bằng biến môi trường, xem dưới)
  - Tổng quan (dashboard) · Đơn hàng (+ tạo đơn tại quầy) · Sản phẩm & kho · Khách hàng · Thu chi · Báo cáo (xuất CSV, in)

## Deploy lên Vercel
1. Đẩy code lên GitHub → Vercel → **Add New Project** → chọn repo (không cần cấu hình thêm).
2. Vào **Settings → Environment Variables** thêm:
   - `ADMIN_PASSWORD` — mật khẩu đăng nhập quản trị
   - `ADMIN_SECRET` — chuỗi bí mật bất kỳ để ký phiên
3. Deploy.

## Sửa thông tin cửa hàng
- Tên, địa chỉ, SĐT, giờ mở cửa, phí ship: `lib/site.ts`
- Danh mục & sản phẩm mẫu: `lib/seed.ts` (hoặc sửa trực tiếp trong trang Quản trị)
- Ảnh cửa hàng: `public/images/` (thay file cùng tên bằng ảnh chất lượng cao hơn)
- Ảnh sản phẩm: dán link ảnh vào ô “Link ảnh sản phẩm” khi sửa sản phẩm; nếu trống sẽ hiển thị hình kính minh hoạ.

## Lưu ý quan trọng về dữ liệu
Bản này lưu dữ liệu (sản phẩm, đơn, khách, thu chi) trong **localStorage của trình duyệt** để chạy ngay không cần database.
Nghĩa là đơn khách đặt trên máy khách **chưa hiện sang máy chủ cửa hàng**. Để dùng thật, thay các hàm trong `lib/store.tsx`
bằng API + database (Supabase / Vercel Postgres / Neon). Việc này không cần sửa giao diện.
