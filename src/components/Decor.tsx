/* Họa tiết trang trí thiên nhiên: cành lá, cỏ, hoa cúc */

export function LeafBranch({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 320 220"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <g fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round">
        <path d="M10 10 C 80 40, 150 30, 240 80" opacity="0.6" />
        <path d="M10 10 C 60 70, 120 90, 200 150" opacity="0.5" />
      </g>
      {leafSet.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={l.rx}
          ry={l.ry}
          fill={l.c}
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
          opacity={l.o}
        />
      ))}
    </svg>
  );
}

const leafSet = [
  { x: 40, y: 22, rx: 20, ry: 9, r: 25, c: "#5cb85c", o: 0.95 },
  { x: 78, y: 40, rx: 22, ry: 10, r: 35, c: "#7cc34a", o: 0.9 },
  { x: 120, y: 34, rx: 18, ry: 8, r: 20, c: "#4caf50", o: 0.95 },
  { x: 165, y: 58, rx: 24, ry: 11, r: 40, c: "#5cb85c", o: 0.9 },
  { x: 210, y: 82, rx: 20, ry: 9, r: 30, c: "#7cc34a", o: 0.92 },
  { x: 60, y: 78, rx: 18, ry: 8, r: 55, c: "#4caf50", o: 0.85 },
  { x: 110, y: 100, rx: 22, ry: 10, r: 60, c: "#5cb85c", o: 0.9 },
  { x: 160, y: 128, rx: 20, ry: 9, r: 65, c: "#7cc34a", o: 0.88 },
  { x: 200, y: 150, rx: 17, ry: 8, r: 70, c: "#4caf50", o: 0.85 },
];

export function Daisy({ className = "", size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="8"
          rx="4.2"
          ry="9"
          fill="#ffffff"
          transform={`rotate(${i * 45} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5.5" fill="#f5a623" />
    </svg>
  );
}

export function GrassBorder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <path
        d="M0 140 V70 Q60 30 90 70 Q110 20 140 65 Q170 25 200 70 Q240 20 270 68 Q320 30 360 72 Q400 25 440 70 Q490 30 520 68 Q560 20 600 70 Q650 28 690 70 Q730 22 770 68 Q820 30 860 70 Q900 24 940 70 Q990 30 1030 68 Q1070 20 1110 70 Q1160 28 1200 70 Q1250 24 1290 70 Q1340 30 1380 68 Q1410 24 1440 70 V140 Z"
        fill="#5cb85c"
      />
      <path
        d="M0 140 V95 Q50 60 90 95 Q130 55 175 95 Q220 58 265 95 Q315 60 360 95 Q410 56 455 95 Q505 60 550 95 Q600 56 650 95 Q700 60 745 95 Q795 56 840 95 Q890 60 935 95 Q985 56 1030 95 Q1080 60 1125 95 Q1175 56 1220 95 Q1270 60 1315 95 Q1365 58 1410 95 Q1430 80 1440 95 V140 Z"
        fill="#3f9b3f"
      />
    </svg>
  );
}
