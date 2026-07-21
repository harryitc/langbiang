"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Member } from "@/lib/content/schema";

const INITIAL_COUNT = 12;

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="group flex h-full items-start gap-3.5 rounded-2xl bg-white/80 p-3.5 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:gap-4 sm:p-4">
      {/* Ảnh bên trái nhỏ gọn */}
      <span className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass text-base font-bold text-white ring-2 ring-white/60 dark:ring-white/10 sm:h-14 sm:w-14 sm:text-lg">
        {m.photo ? (
          <Image
            src={m.photo}
            alt={m.name}
            fill
            unoptimized
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          initials(m.name)
        )}
      </span>

      {/* Họ tên và nội dung bên phải */}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold text-forest dark:text-ink sm:text-base">{m.name}</h4>
        {m.bio && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-forest/75 dark:text-ink/70 sm:text-sm" title={m.bio}>
            {m.bio}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MembersList({ members }: { members: Member[] }) {
  const [expanded, setExpanded] = useState(false);

  const visibleMembers = expanded ? members : members.slice(0, INITIAL_COUNT);
  const hasMore = members.length > INITIAL_COUNT;

  return (
    <div className="mt-12">
      <Reveal childrenStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {visibleMembers.map((m, idx) => (
          <MemberCard key={m.name + idx} m={m} />
        ))}
      </Reveal>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full bg-white/80 px-8 py-3 text-sm font-semibold text-leaf-deep shadow-sm ring-1 ring-leaf/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-leaf hover:text-white hover:shadow-soft dark:bg-white/5 dark:text-leaf-bright dark:ring-leaf-bright/20 dark:hover:bg-leaf-bright dark:hover:text-night"
          >
            {expanded
              ? "Thu gọn danh sách ▲"
              : `Xem thêm ${members.length - INITIAL_COUNT} thành viên khác ▼`}
          </button>
        </div>
      )}
    </div>
  );
}
