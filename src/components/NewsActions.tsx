"use client";

import { useEffect, useState } from "react";

type NewsActionsProps = {
  /** Slug bài viết — dùng làm khoá lưu lượt thích trên trình duyệt. */
  id: string;
  title: string;
  /** Link Facebook bài gốc để chia sẻ. */
  fbLink: string;
};

const LIKE_PREFIX = "tsl:news-like:";

export default function NewsActions({ id, title, fbLink }: NewsActionsProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Khôi phục trạng thái đã thích từ localStorage
  useEffect(() => {
    try {
      setLiked(localStorage.getItem(LIKE_PREFIX + id) === "1");
    } catch {
      /* localStorage không khả dụng — bỏ qua */
    }
  }, [id]);

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      try {
        if (next) localStorage.setItem(LIKE_PREFIX + id, "1");
        else localStorage.removeItem(LIKE_PREFIX + id);
      } catch {
        /* bỏ qua */
      }
      return next;
    });
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    // Ưu tiên Web Share API (điện thoại), fallback sao chép link
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        /* người dùng huỷ — không làm gì */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard bị chặn — bỏ qua */
    }
  };

  const shareFacebook = () => {
    const url = typeof window !== "undefined" ? window.location.href : fbLink;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=520"
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? "Bỏ thích" : "Thích bài viết"}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
          liked
            ? "bg-rose-500 text-white shadow-soft hover:bg-rose-600"
            : "bg-white/70 text-forest ring-1 ring-leaf/15 hover:bg-white dark:bg-white/5 dark:text-ink dark:ring-leaf-bright/15 dark:hover:bg-white/10"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${liked ? "scale-110" : ""}`}
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
        {liked ? "Đã thích" : "Thích"}
      </button>

      <button
        type="button"
        onClick={share}
        aria-label="Chia sẻ bài viết"
        className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-forest ring-1 ring-leaf/15 transition hover:bg-white dark:bg-white/5 dark:text-ink dark:ring-leaf-bright/15 dark:hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {copied ? "Đã sao chép!" : "Chia sẻ"}
      </button>

      <button
        type="button"
        onClick={shareFacebook}
        aria-label="Chia sẻ lên Facebook"
        className="inline-flex items-center gap-2 rounded-full bg-[#1877f2] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f66d0]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
        </svg>
        Facebook
      </button>
    </div>
  );
}
