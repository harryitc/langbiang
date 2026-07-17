"use client";

import { useEffect, useState } from "react";

type NewsActionsProps = {
  /** Slug bài viết — dùng làm khoá lưu trạng thái like trên thiết bị & gọi API. */
  id: string;
};

const LIKED_PREFIX = "tsl:news-liked:";

export default function NewsActions({ id }: NewsActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Khôi phục trạng thái đã-like trên thiết bị + lấy tổng lượt like từ server.
  useEffect(() => {
    try {
      setLiked(localStorage.getItem(LIKED_PREFIX + id) === "1");
    } catch {
      /* localStorage không khả dụng — bỏ qua */
    }
    let cancelled = false;
    fetch(`/api/likes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.likes === "number") {
          setLikes(data.likes);
        }
      })
      .catch(() => {
        /* offline hoặc API lỗi — giữ 0 */
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleLike = async () => {
    if (pending) return;
    const next = !liked;

    // Cập nhật lạc quan để phản hồi tức thì.
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    try {
      if (next) localStorage.setItem(LIKED_PREFIX + id, "1");
      else localStorage.removeItem(LIKED_PREFIX + id);
    } catch {
      /* bỏ qua */
    }

    setPending(true);
    try {
      const res = await fetch(`/api/likes/${id}`, {
        method: next ? "POST" : "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.likes === "number") setLikes(data.likes);
      } else {
        throw new Error("request_failed");
      }
    } catch {
      // Hoàn tác nếu gọi API thất bại.
      setLiked(!next);
      setLikes((n) => Math.max(0, n + (next ? -1 : 1)));
      try {
        if (next) localStorage.removeItem(LIKED_PREFIX + id);
        else localStorage.setItem(LIKED_PREFIX + id, "1");
      } catch {
        /* bỏ qua */
      }
    } finally {
      setPending(false);
    }
  };

  const copyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard bị chặn — bỏ qua */
    }
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
        {likes > 1 && (
          <span className="tabular-nums opacity-90">· {likes}</span>
        )}
      </button>

      <button
        type="button"
        onClick={copyLink}
        aria-label="Sao chép liên kết bài viết"
        className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 text-sm font-semibold text-forest ring-1 ring-leaf/15 transition hover:bg-white dark:bg-white/5 dark:text-ink dark:ring-leaf-bright/15 dark:hover:bg-white/10"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.42 1.42" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07l1.42-1.42" />
        </svg>
        {copied ? "Đã sao chép link!" : "Sao chép link"}
      </button>
    </div>
  );
}
