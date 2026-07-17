"use client";

import { useState } from "react";
import { Input, Select } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "./editorKit";
import type { NewsPost } from "@/lib/content/schema";

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
  const { status, savedCount } = useSectionAutosave("news", posts);

  return (
    <EditorLayout
      title="Tin tức / Bài viết"
      description="Thêm/sửa/xoá bài. Tự lưu nháp; xem trước danh sách bên phải, bấm vào bài để xem chi tiết."
      status={status}
      savedCount={savedCount}
      previewPath="/tin-tuc"
    >
      <ListEditor<NewsPost>
        value={posts}
        onChange={setPosts}
        addLabel="Thêm bài viết"
        itemTitle={(p) => p.title}
        newItem={() => ({
          id: `bai-viet-moi-${posts.length + 1}`,
          img: "/tintuc/n1.jpg",
          tag: "Hoạt động",
          title: "Bài viết mới",
          excerpt: "Tóm tắt ngắn…",
          body: ["Nội dung bài viết…"],
          link: "",
        })}
        renderItem={(p, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Tiêu đề"
              value={p.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
            <Input
              addonBefore="Slug"
              value={p.id}
              onChange={(e) => patch({ id: e.target.value })}
              addonAfter={
                <a onClick={() => patch({ id: slugify(p.title) })} style={{ cursor: "pointer" }}>
                  tạo
                </a>
              }
            />
            <div style={{ display: "flex", gap: 8 }}>
              <Select
                style={{ width: 200 }}
                value={p.tag}
                onChange={(v) => patch({ tag: v })}
                options={TAGS.map((t) => ({ value: t, label: t }))}
              />
              <Input
                addonBefore="Ảnh"
                value={p.img}
                onChange={(e) => patch({ img: e.target.value })}
                placeholder="/tintuc/n1.jpg"
              />
            </div>
            <Input.TextArea
              placeholder="Tóm tắt (excerpt)"
              autoSize={{ minRows: 2, maxRows: 3 }}
              value={p.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
            />
            <Input.TextArea
              placeholder="Nội dung — ngăn cách đoạn bằng một dòng trống"
              autoSize={{ minRows: 4, maxRows: 12 }}
              value={(p.body ?? []).join("\n\n")}
              onChange={(e) =>
                patch({
                  body: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <Input
              addonBefore="Link gốc"
              value={p.link}
              onChange={(e) => patch({ link: e.target.value })}
              placeholder="https://… (tuỳ chọn)"
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
