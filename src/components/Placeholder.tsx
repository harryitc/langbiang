type PlaceholderProps = {
  label?: string;
  className?: string;
  ratio?: string; // e.g. "aspect-[4/3]"
  icon?: string;
};

/**
 * Ảnh placeholder — thay bằng <Image> thật sau này.
 * Hiển thị khung gradient thiên nhiên + hiệu ứng shimmer nhẹ.
 */
export default function Placeholder({
  label = "Hình ảnh sắp cập nhật",
  className = "",
  ratio = "aspect-[4/3]",
  icon = "🌿",
}: PlaceholderProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl ${ratio} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-soft via-[#cdeecb] to-grass" />
      <div className="skeleton absolute inset-0 opacity-60" />
      {/* subtle hills */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 90 Q100 40 200 80 T400 70 V120 H0 Z"
          fill="rgba(124,195,74,0.55)"
        />
        <path
          d="M0 100 Q120 70 240 95 T400 90 V120 H0 Z"
          fill="rgba(46,125,50,0.45)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-forest/70">
        <span className="text-4xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        <span className="px-4 text-center text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/50" />
    </div>
  );
}
