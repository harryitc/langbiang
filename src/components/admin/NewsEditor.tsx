"use client";

import { useEffect, useRef, useState } from "react";
import { saveNewsDraftAction } from "@/lib/content/actions";
import type { NewsPost } from "@/lib/site";

type Status = "idle" | "saving" | "saved" | "error";

const TAGS = ["Tổng kết", "Hoạt động", "Tài trợ", "Tuyển thành viên", "Kêu gọi", "Thông báo"];

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function NewsEditor({ initial }: { initial: NewsPost[] }) {
  const [posts, setPosts] = useState<NewsPost[]>(initial);
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [previewSrc, setPreviewSrc] = useState(
    `/tin-tuc/${initial[0]?.id ?? ""}?preview=1`
  );
  const skipFirst = useRef(true);
  const bump = useRef(0);

  // Autosave nháp (debounce) — chỉ reload preview sau khi lưu xong.
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(async () => {
      const res = await saveNewsDraftAction(posts);
      if (res.ok) {
        setStatus("saved");
        bump.current += 1;
        const cur = posts[selected];
        if (cur) setPreviewSrc(`/tin-tuc/${cur.id}?preview=1&v=${bump.current}`);
      } else {
        setStatus("error");
      }
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // Đổi bài đang chọn -> nạp preview bài đó.
  useEffect(() => {
    const cur = posts[selected];
    if (cur) setPreviewSrc(`/tin-tuc/${cur.id}?preview=1&v=sel${selected}-${bump.current}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const post = posts[selected];

  const patch = (p: Partial<NewsPost>) =>
    setPosts((arr) => arr.map((x, i) => (i === selected ? { ...x, ...p } : x)));

  const addPost = () => {
    const fresh: NewsPost = {
      id: `bai-viet-moi-${posts.length + 1}`,
      img: "/tintuc/n1.jpg",
      tag: "Hoạt động",
      title: "Bài viết mới",
      excerpt: "Tóm tắt ngắn hiển thị ở thẻ tin tức…",
      body: ["Nội dung bài viết…"],
      link: "",
    };
    setPosts((arr) => [fresh, ...arr]);
    setSelected(0);
  };

  const removePost = () => {
    if (!confirm("Xoá bài viết này?")) return;
    setPosts((arr) => arr.filter((_, i) => i !== selected));
    setSelected((s) => Math.max(0, s - 1));
  };

  const bodyText = (post?.body ?? []).join("\n\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* CỘT TRÁI: danh sách + form */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <StatusPill status={status} />
          <button
            onClick={addPost}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Thêm bài
          </button>
        </div>

        {/* Danh sách bài */}
        <div className="mb-5 flex flex-wrap gap-2">
          {posts.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`max-w-[220px] truncate rounded-full px-3 py-1.5 text-xs ${
                i === selected
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
              title={p.title}
            >
              {p.title || "(chưa có tiêu đề)"}
            </button>
          ))}
        </div>

        {post ? (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <Field label="Tiêu đề">
              <input
                className={inputCls}
                value={post.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Đường dẫn (slug)" hint="Địa chỉ: /tin-tuc/…">
                <div className="flex gap-2">
                  <input
                    className={inputCls}
                    value={post.id}
                    onChange={(e) => patch({ id: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => patch({ id: slugify(post.title) })}
                    className="whitespace-nowrap rounded-lg border border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700"
                  >
                    Từ tiêu đề
                  </button>
                </div>
              </Field>
              <Field label="Nhãn">
                <input
                  className={inputCls}
                  list="news-tags"
                  value={post.tag}
                  onChange={(e) => patch({ tag: e.target.value })}
                />
                <datalist id="news-tags">
                  {TAGS.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
            </div>

            <Field label="Ảnh bìa (đường dẫn trong /public)" hint="VD: /tintuc/n1.jpg">
              <input
                className={inputCls}
                value={post.img}
                onChange={(e) => patch({ img: e.target.value })}
              />
            </Field>

            <Field label="Tóm tắt (excerpt)" hint="Hiển thị ở thẻ & phần mô tả SEO">
              <textarea
                className={`${inputCls} h-20 resize-y`}
                value={post.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })}
              />
            </Field>

            <Field label="Nội dung" hint="Ngăn cách các đoạn bằng một dòng trống">
              <textarea
                className={`${inputCls} h-56 resize-y`}
                value={bodyText}
                onChange={(e) =>
                  patch({
                    body: e.target.value
                      .split(/\n\s*\n/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>

            <Field label="Link bài gốc (tuỳ chọn)" hint="Không bắt buộc — không hiển thị nút Facebook">
              <input
                className={inputCls}
                value={post.link}
                onChange={(e) => patch({ link: e.target.value })}
                placeholder="https://…"
              />
            </Field>

            <div className="pt-2">
              <button
                onClick={removePost}
                className="text-sm font-medium text-rose-600 hover:underline"
              >
                Xoá bài này
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Chưa có bài viết nào. Bấm “Thêm bài”.</p>
        )}
      </div>

      {/* CỘT PHẢI: xem trước trực tiếp */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Xem trước (bản nháp)</span>
          {post && (
            <a
              href={`/tin-tuc/${post.id}?preview=1`}
              target="_blank"
              className="hover:underline"
            >
              Mở tab mới ↗
            </a>
          )}
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800">
          <iframe
            key={previewSrc}
            src={previewSrc}
            title="Xem trước bài viết"
            className="h-[70vh] w-full"
          />
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-700 dark:bg-slate-800";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { text: string; cls: string }> = {
    idle: { text: "Sẵn sàng", cls: "bg-slate-100 text-slate-500 dark:bg-slate-800" },
    saving: { text: "Đang lưu nháp…", cls: "bg-amber-100 text-amber-700" },
    saved: { text: "✓ Đã lưu nháp", cls: "bg-emerald-100 text-emerald-700" },
    error: { text: "Lưu lỗi", cls: "bg-rose-100 text-rose-700" },
  };
  const s = map[status];
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>{s.text}</span>
  );
}
