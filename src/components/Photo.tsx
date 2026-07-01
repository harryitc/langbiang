type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  ratio?: string; // vd "aspect-[4/3]"
  priority?: boolean;
};

/**
 * Ảnh thật (đã tối ưu web) với khung bo góc, viền mềm và hiệu ứng zoom nhẹ khi hover.
 */
export default function Photo({
  src,
  alt,
  className = "",
  ratio = "aspect-[4/3]",
  priority = false,
}: PhotoProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-leaf/10 ${ratio} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/40 dark:ring-white/10" />
      {/* gradient nhẹ dưới đáy để chữ caption (nếu có) nổi bật */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
