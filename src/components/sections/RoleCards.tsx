// Vai trò ĐẠI SỨ — một danh sách dữ liệu, hai cách bày ra màn hình:
//
//   1. THẺ GIỚI THIỆU (mặc định) — lưới thẻ kính có emoji, tên và mô tả đầy đủ.
//      Dùng ở cột trái khối "Đăng ký" trang chủ và trang chia sẻ /dang-ky/<id>.
//   2. Ô TÍCH GỌN (`selectable`) — mỗi vai trò một dòng: ô tích nhỏ, emoji, tên.
//      Dùng bên trong form đăng ký. CỐ Ý không lặp lại mô tả: cột bên trái đã
//      nói rõ từng vai trò rồi, in lại lần nữa chỉ làm form dài và rối.
//
// Cả hai cùng đọc `RegisterSection.roles` nên danh sách vai trò không bao giờ
// lệch nhau — đó mới là thứ cần dùng chung, chứ không phải kiểu dáng.
//
// KHÔNG có "use client": file này theo phe của nơi gọi nó. Trang chủ gọi từ
// component máy chủ -> không tốn JS; form đăng ký gọi từ component trình duyệt
// -> tự thành phần trình duyệt và bấm chọn được.
import type { AmbassadorRole } from "@/lib/content/schema";

export default function RoleCards({
  roles,
  selectable = false,
  value = [],
  onToggle,
  className = "",
}: {
  roles: AmbassadorRole[];
  /** Hiện dạng ô tích gọn cho khách chọn, thay vì thẻ giới thiệu. */
  selectable?: boolean;
  /** Tên các vai trò đang được chọn. */
  value?: string[];
  onToggle?: (title: string) => void;
  className?: string;
}) {
  if (roles.length === 0) return null;

  // --- Dạng ô tích gọn, nằm trong form ---------------------------------------
  if (selectable) {
    return (
      // Một cột: tên vai trò khá dài, chia hai cột là chữ bị ngắt giữa chừng.
      <div className={`grid gap-2 ${className}`.trim()}>
        {roles.map((role, i) => (
          <label
            key={i}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-leaf/20 bg-white/60 px-3 py-2.5 transition hover:border-leaf/50 has-[:checked]:border-leaf-deep has-[:checked]:bg-leaf/10"
          >
            <input
              type="checkbox"
              // CỐ Ý không đặt `name`: thứ được gửi đi là ô ẩn gộp sẵn ở
              // RegisterFormCard, không phải từng ô tích rời.
              className="h-4 w-4 shrink-0 cursor-pointer accent-leaf-deep"
              checked={value.includes(role.title)}
              onChange={() => onToggle?.(role.title)}
            />
            <span aria-hidden="true" className="shrink-0 text-base leading-none">
              {role.icon}
            </span>
            <span className="text-sm font-semibold leading-snug text-forest">
              {role.title}
            </span>
          </label>
        ))}
      </div>
    );
  }

  // --- Dạng thẻ giới thiệu, nằm ngoài form ----------------------------------
  return (
    // Mô tả vai trò khá dài nên chỉ chia tối đa hai cột: cột càng hẹp thì chữ
    // càng vỡ vụn, mỗi dòng còn vài chữ.
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`.trim()}>
      {roles.map((role, i) => (
        <div key={i} className="glass rounded-2xl p-4 text-forest">
          <span className="text-2xl leading-none">{role.icon}</span>
          <p className="mt-1.5 font-bold leading-snug text-balance">
            {role.title}
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-forest/70 text-pretty">
            {role.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
