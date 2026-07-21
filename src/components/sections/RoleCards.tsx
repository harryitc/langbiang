// Lưới thẻ VAI TRÒ ĐẠI SỨ — MỘT bố cục duy nhất dùng cho cả hai vai trò hiển
// thị lẫn chọn lựa:
//   - chỉ giới thiệu: khối "Đăng ký" ở trang chủ, trang chia sẻ /dang-ky/<id>;
//   - cho chọn: ô nhập kiểu "roles" bên trong form đăng ký.
//
// Cố ý gộp làm một để hai nơi không bao giờ trông khác nhau. Khác biệt duy nhất
// khi bật `selectable` là thẻ trở thành nhãn bấm được (có ô tích ẩn phía trong)
// và thẻ đang chọn được tô viền — bố cục, cỡ chữ, khoảng cách giữ nguyên.
//
// KHÔNG có "use client": file này theo phe của nơi gọi nó. Trang chủ gọi từ
// component máy chủ -> không tốn JS; form đăng ký gọi từ component trình duyệt
// -> tự thành phần trình duyệt và bấm chọn được.
import type { AmbassadorRole } from "@/lib/content/schema";

/** Lớp bổ sung cho chế độ tối — chỉ dùng khi NỀN phía sau cũng tối đi. */
const TOI = {
  the: "dark:border-leaf-bright/20",
  tieuDe: "dark:text-ink",
  mota: "dark:text-ink/70",
  chon: "dark:border-leaf-bright dark:bg-leaf-bright/10",
};

export default function RoleCards({
  roles,
  selectable = false,
  adaptive = false,
  value = [],
  onToggle,
  className = "",
}: {
  roles: AmbassadorRole[];
  /** Cho khách tích chọn thay vì chỉ đọc. */
  selectable?: boolean;
  /** Bật màu cho chế độ tối — chỉ khi nền phía sau cũng tối. */
  adaptive?: boolean;
  /** Tên các vai trò đang được chọn. */
  value?: string[];
  onToggle?: (title: string) => void;
  className?: string;
}) {
  if (roles.length === 0) return null;

  const t = (cls: string) => (adaptive ? " " + cls : "");

  return (
    // Một cột ở màn hẹp, hai cột từ sm trở lên. Mô tả vai trò khá dài nên không
    // chia ba/bốn cột: cột càng hẹp thì chữ càng vỡ vụn, mỗi dòng vài chữ.
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`.trim()}>
      {roles.map((role, i) => {
        const chon = value.includes(role.title);

        const noiDung = (
          <>
            <span className="text-2xl leading-none">{role.icon}</span>
            <p
              className={`mt-1.5 font-bold leading-snug text-balance${t(TOI.tieuDe)}`}
            >
              {role.title}
            </p>
            <p
              className={`mt-0.5 text-sm leading-relaxed text-forest/70 text-pretty${t(TOI.mota)}`}
            >
              {role.desc}
            </p>
          </>
        );

        // Nền kính + bo góc dùng chung cho cả hai chế độ.
        const nen = `glass rounded-2xl p-4 text-forest${t(TOI.the)}`;

        if (!selectable) {
          return (
            <div key={i} className={nen}>
              {noiDung}
            </div>
          );
        }

        return (
          <label
            key={i}
            className={`${nen} relative cursor-pointer border-2 transition ${
              chon
                ? `border-leaf-deep bg-white/70 shadow-soft${t(TOI.chon)}`
                : `border-transparent hover:border-leaf/40${t(TOI.the)}`
            }`}
          >
            {/* Ô tích thật, ẩn khỏi mắt nhưng bàn phím và trình đọc màn hình
                vẫn dùng được. CỐ Ý không đặt `name`: thứ được gửi đi là ô ẩn
                gộp sẵn ở RegisterFormCard, không phải từng ô tích rời. */}
            <input
              type="checkbox"
              className="peer sr-only"
              value={role.title}
              checked={chon}
              onChange={() => onToggle?.(role.title)}
            />

            {/* Dấu tích góc phải — chỉ hiện khi đang chọn. */}
            <span
              aria-hidden="true"
              className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white transition ${
                chon ? "bg-leaf-deep opacity-100" : "opacity-0"
              }`}
            >
              ✓
            </span>

            {/* Viền sáng khi di chuột bằng bàn phím (Tab). */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-leaf/50 peer-focus-visible:ring-2" />

            <span className="block pr-6">{noiDung}</span>
          </label>
        );
      })}
    </div>
  );
}
