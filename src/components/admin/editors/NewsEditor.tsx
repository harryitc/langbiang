"use client";

// Trình biên tập "Bài tin tức" — nhánh nội dung: news
import { useMemo } from "react";
import { Alert, Button, Col, Input, Row, Space, Tag, Typography } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
  RichText,
} from "../editorKit";
import { ItemListEditor } from "../itemList";
import type { NewsPost } from "@/lib/content/schema";

const { Text } = Typography;

/** Chuyển tiêu đề tiếng Việt thành slug (bỏ dấu, chỉ còn a-z 0-9 và dấu gạch). */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Bài mới trống. */
function emptyPost(): NewsPost {
  return {
    id: "",
    img: "",
    tag: "",
    title: "",
    excerpt: "",
    bodyHtml: "",
    link: "",
    date: "",
  };
}

export default function NewsEditor({ initial }: { initial: NewsPost[] }) {
  const { value, update, status } = useSectionAutosave<NewsPost[]>(
    "news",
    initial
  );

  // Tập các định danh bị trùng (FR2-R7: định danh phải duy nhất).
  const duplicatedIds = useMemo(() => {
    const seen = new Map<string, number>();
    for (const post of value) {
      const id = post.id.trim();
      if (!id) continue;
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }
    return new Set(
      Array.from(seen.entries())
        .filter(([, count]) => count > 1)
        .map(([id]) => id)
    );
  }, [value]);

  // Số bài còn thiếu trường bắt buộc (FR2-R3).
  const invalidCount = useMemo(
    () =>
      value.filter(
        (p) =>
          !p.id.trim() ||
          !p.title.trim() ||
          !p.tag.trim() ||
          !p.excerpt.trim() ||
          !p.img.trim() ||
          !p.link.trim()
      ).length,
    [value]
  );

  return (
    <EditorCard
      title={
        <Space>
          <span>Bài tin tức</span>
          <Tag>{value.length} bài</Tag>
        </Space>
      }
      extra={<SaveStatusTag status={status} />}
    >
      <Space direction="vertical" size={12} className="w-full">
        <Text type="secondary" className="text-xs">
          Danh sách xếp từ mới nhất tới cũ nhất. Định danh (slug) chính là đường
          dẫn bài viết: <code>/tin-tuc/&#123;định-danh&#125;</code> — phải duy
          nhất. Để trống nội dung chi tiết thì bài sẽ hiển thị theo tóm tắt.
        </Text>

        {duplicatedIds.size > 0 ? (
          <Alert
            type="error"
            showIcon
            message="Định danh bị trùng"
            description={`Các định danh sau đang bị trùng, vui lòng đổi lại: ${Array.from(
              duplicatedIds
            ).join(", ")}`}
          />
        ) : null}

        {invalidCount > 0 ? (
          <Alert
            type="warning"
            showIcon
            message={`Có ${invalidCount} bài còn thiếu trường bắt buộc.`}
            description="Cần điền đủ: định danh, nhãn, tiêu đề, tóm tắt, ảnh và liên kết bài gốc."
          />
        ) : null}

        <ItemListEditor<NewsPost>
          value={value}
          onChange={update}
          newItem={emptyPost}
          addLabel="Thêm bài tin tức"
          drawerTitle="Bài tin tức"
          getRow={(post) => ({
            title: post.title,
            subtitle: post.excerpt || post.id,
            thumb: post.img || undefined,
            tags: post.tag.trim() ? [{ text: post.tag, color: "blue" }] : undefined,
            invalid:
              !post.id.trim() ||
              !post.title.trim() ||
              !post.tag.trim() ||
              !post.excerpt.trim() ||
              !post.img.trim() ||
              !post.link.trim() ||
              duplicatedIds.has(post.id.trim()),
          })}
          renderForm={(post, setPost) => {
            const dup = post.id.trim() !== "" && duplicatedIds.has(post.id.trim());
            return (
              <div className="w-full">
                <Row gutter={16}>
                  {/* Cột trái: thông tin cơ bản */}
                  <Col xs={24} md={16}>
                    <Row gutter={12}>
                      <Col xs={24} sm={8}>
                        <Field label="Nhãn (tag)" hint="VD: Tổng kết, Hoạt động">
                          <Input
                            placeholder="Hoạt động"
                            value={post.tag}
                            status={post.tag.trim() ? undefined : "error"}
                            onChange={(e) =>
                              setPost({ ...post, tag: e.target.value })
                            }
                          />
                        </Field>
                      </Col>
                      <Col xs={24} sm={16}>
                        <Field label="Tiêu đề">
                          <Input
                            placeholder="Tiêu đề bài tin tức"
                            value={post.title}
                            status={post.title.trim() ? undefined : "error"}
                            onChange={(e) =>
                              setPost({ ...post, title: e.target.value })
                            }
                          />
                        </Field>
                      </Col>
                    </Row>

                    <Field
                      label="Định danh (slug)"
                      hint={
                        dup
                          ? "Định danh này đã được dùng ở bài khác — vui lòng đổi."
                          : "Chỉ dùng chữ thường, số và dấu gạch ngang."
                      }
                    >
                      <Space.Compact className="w-full">
                        <Input
                          placeholder="tong-ket-mua-trang"
                          value={post.id}
                          status={
                            !post.id.trim() || dup ? "error" : undefined
                          }
                          onChange={(e) =>
                            setPost({ ...post, id: e.target.value })
                          }
                        />
                        <Button
                          onClick={() =>
                            setPost({ ...post, id: slugify(post.title) })
                          }
                          disabled={!post.title.trim()}
                        >
                          Tạo từ tiêu đề
                        </Button>
                      </Space.Compact>
                    </Field>

                    <Field label="Tóm tắt" hint="Hiển thị ở thẻ tin và dùng cho SEO.">
                      <Input.TextArea
                        rows={3}
                        placeholder="Tóm tắt ngắn gọn nội dung bài."
                        value={post.excerpt}
                        status={post.excerpt.trim() ? undefined : "error"}
                        onChange={(e) =>
                          setPost({ ...post, excerpt: e.target.value })
                        }
                      />
                    </Field>

                    <Row gutter={12}>
                      <Col xs={24} sm={16}>
                        <Field label="Liên kết bài gốc" hint="Link bài trên Fanpage.">
                          <Input
                            placeholder="https://www.facebook.com/share/p/…"
                            value={post.link}
                            status={post.link.trim() ? undefined : "error"}
                            onChange={(e) =>
                              setPost({ ...post, link: e.target.value })
                            }
                          />
                        </Field>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Field label="Ngày đăng (tuỳ chọn)" hint="Định dạng YYYY-MM-DD.">
                          <Input
                            placeholder="2025-09-20"
                            value={post.date ?? ""}
                            onChange={(e) =>
                              setPost({ ...post, date: e.target.value })
                            }
                          />
                        </Field>
                      </Col>
                    </Row>
                  </Col>

                  {/* Cột phải: ảnh đại diện */}
                  <Col xs={24} md={8}>
                    <Field label="Ảnh đại diện">
                      <ImageField
                        folder="tintuc"
                        value={post.img}
                        onChange={(url) => setPost({ ...post, img: url })}
                      />
                    </Field>
                  </Col>
                </Row>

                <Field
                  label="Nội dung chi tiết"
                  hint="Để trống nếu chỉ muốn hiển thị tóm tắt."
                >
                  <RichText
                    folder="tintuc"
                    value={post.bodyHtml ?? ""}
                    onChange={(html) => setPost({ ...post, bodyHtml: html })}
                  />
                </Field>
              </div>
            );
          }}
        />
      </Space>
    </EditorCard>
  );
}
