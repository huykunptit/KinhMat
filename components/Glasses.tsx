import type { Shape } from "@/lib/types";

/** Minh hoạ gọng kính bằng SVG — dùng khi sản phẩm chưa có ảnh thật. */
export default function Glasses({ shape, color, lens, className = "" }: { shape: Shape; color: string; lens?: string; className?: string }) {
  const fill = lens ?? "rgba(190,225,235,.35)";
  const sw = 5, L = 78, R = 222, cy = 80;
  const lensPath = (cx: number): string => {
    switch (shape) {
      case "round": return `M${cx - 42},${cy} a42,42 0 1,0 84,0 a42,42 0 1,0 -84,0`;
      case "square": return `M${cx - 42},${cy - 34} h84 v62 a12,12 0 0 1 -12,12 h-60 a12,12 0 0 1 -12,-12 z`;
      case "rect": return `M${cx - 44},${cy - 26} h88 v48 a14,14 0 0 1 -14,14 h-60 a14,14 0 0 1 -14,-14 z`;
      case "cat": return `M${cx - 44},${cy - 22} q4,-18 30,-14 l54,10 q4,40 -20,52 q-30,10 -52,-4 q-12,-12 -12,-44 z`;
      case "aviator": return `M${cx - 46},${cy - 30} h92 q4,50 -22,66 q-26,10 -48,-6 q-20,-14 -22,-60 z`;
      case "oval": return `M${cx - 44},${cy} a44,32 0 1,0 88,0 a44,32 0 1,0 -88,0`;
    }
  };
  return (
    <svg viewBox="0 0 300 160" className={className} role="img" aria-label="Minh hoạ kính" xmlns="http://www.w3.org/2000/svg">
      <path d="M8,66 L34,76" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d="M292,66 L266,76" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <path d={`M${L + 42},${cy - 10} q30,-18 60,0`} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d={lensPath(L)} fill={fill} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d={lensPath(R)} fill={fill} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M${L - 24},${cy - 24} l14,-8`} stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
      <path d={`M${R - 24},${cy - 24} l14,-8`} stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
