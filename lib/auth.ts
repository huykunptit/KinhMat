// Xác thực quản trị đơn giản bằng mật khẩu trong biến môi trường (Vercel → Settings → Environment Variables).
export const COOKIE = "tv_admin";
export const getPassword = () => process.env.ADMIN_PASSWORD || "admin123";
const getSecret = () => process.env.ADMIN_SECRET || "thanhvinh-dev-secret";

export async function sessionToken(): Promise<string> {
  const data = new TextEncoder().encode(`${getSecret()}:${getPassword()}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
