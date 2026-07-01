const words = [
  "Trung Thu Yêu Thương",
  "Trăng Sáng Langbiang",
  "Sẻ Chia Vùng Cao",
  "Thắp Sáng Nụ Cười",
  "Hành Trình Tình Nguyện",
];

export default function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-leaf/20 bg-leaf-deep py-5 text-white">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display px-6 text-2xl font-semibold sm:text-3xl">
              {w}
            </span>
            <span className="text-xl text-sun">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
