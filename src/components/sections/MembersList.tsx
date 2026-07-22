"use client";

import { useState } from "react";
import Image from "next/image";
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

      {/* Họ tên và nội dung ở giữa */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-bold text-forest dark:text-ink sm:text-base" title={m.name}>
          {m.name}
        </h4>
        {m.bio && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-forest/75 dark:text-ink/70 sm:text-sm" title={m.bio}>
            {m.bio}
          </p>
        )}
      </div>

      {/* Nút liên kết Facebook bên phải cuối cùng */}
      {m.facebook && (
        <a
          href={m.facebook}
          target="_blank"
          rel="noopener noreferrer"
          title={`Facebook của ${m.name}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 flex-shrink-0 self-center items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-all duration-200 hover:bg-[#1877F2] hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-[#1877F2]"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function MembersList({ members }: { members: Member[] }) {
  const [expanded, setExpanded] = useState(false);

  const visibleMembers = expanded ? members : members.slice(0, INITIAL_COUNT);
  const hasMore = members.length > INITIAL_COUNT;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {visibleMembers.map((m, idx) => (
          <MemberCard key={m.name + idx} m={m} />
        ))}
      </div>

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
