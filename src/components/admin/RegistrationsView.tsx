"use client";

// Bảng "Đăng ký nhận được" — liệt kê các lượt khách gửi form ở trang chủ,
// mới nhất trước, kèm nút tải về file CSV để mở bằng Excel / Google Sheet.
import { useMemo } from "react";
import { Alert, Button, Card, Empty, Table, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { Registration } from "@/lib/content/schema";

type Cot = { name: string; label: string };

export default function RegistrationsView({
  items,
  fields,
  recipientEmail,
}: {
  items: Registration[];
  fields: Cot[];
  recipientEmail: string;
}) {
  // Cột hiện theo thứ tự ô nhập đang cấu hình; những trường cũ (đã đổi/xoá
  // trong form) vẫn hiện ở sau để không mất dữ liệu đã nhận.
  const cot = useMemo<Cot[]>(() => {
    const daCo = new Set(fields.map((f) => f.name));
    const them: Cot[] = [];
    for (const it of items) {
      for (const [name, label] of Object.entries(it.labels ?? {})) {
        if (!daCo.has(name)) {
          daCo.add(name);
          them.push({ name, label: label || name });
        }
      }
    }
    return [...fields, ...them];
  }, [items, fields]);

  const taiCsv = () => {
    const header = ["Thời điểm gửi", ...cot.map((c) => c.label)];
    const rows = items.map((it) => [
      dinhDangGio(it.at),
      ...cot.map((c) => it.values?.[c.name] ?? ""),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map(oCsv).join(","))
      .join("\r\n");
    // ﻿ (BOM) để Excel đọc đúng tiếng Việt có dấu.
    const blob = new Blob(["﻿" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dang-ky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="Đăng ký nhận được"
      extra={
        <Button
          icon={<DownloadOutlined />}
          className="cursor-pointer"
          disabled={items.length === 0}
          onClick={taiCsv}
        >
          Tải về file CSV
        </Button>
      }
      styles={{ body: { paddingTop: 12 } }}
    >
      <p className="mb-3 text-sm opacity-60">
        Mỗi dòng là một lượt khách bấm gửi ở form{" "}
        <strong>Đăng ký đồng hành</strong> ngoài trang chủ, mới nhất nằm trên
        cùng. Trang này <strong>chỉ để xem</strong>. Hệ thống giữ lại 500 lượt
        gần nhất.
      </p>

      {recipientEmail ? (
        <Alert
          className="mb-3"
          type="info"
          showIcon
          title={`Mỗi lượt đăng ký cũng được gửi email báo tới ${recipientEmail}.`}
          description="Đổi địa chỉ này ở mục “Form đăng ký”. Dù email trục trặc, dữ liệu vẫn nằm nguyên ở đây."
        />
      ) : (
        <Alert
          className="mb-3"
          type="warning"
          showIcon
          title="Chưa đặt email nhận thông báo đăng ký."
          description="Vào mục “Form đăng ký” để điền, nếu không sẽ phải tự vào trang này xem mới biết có người đăng ký."
        />
      )}

      {items.length === 0 ? (
        <Empty description="Chưa có ai đăng ký." />
      ) : (
        <Table<Registration>
          size="small"
          rowKey={(r, i) => `${r.at}-${i}`}
          dataSource={items}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          columns={[
            {
              title: "Thời điểm gửi",
              dataIndex: "at",
              width: 180,
              fixed: "left",
              render: (at: string) => (
                <Tag variant="filled" color="green">
                  {dinhDangGio(at)}
                </Tag>
              ),
            },
            ...cot.map((c) => ({
              title: c.label,
              key: c.name,
              render: (_: unknown, r: Registration) => {
                const v = r.values?.[c.name];
                return v ? (
                  <span className="whitespace-pre-wrap">{v}</span>
                ) : (
                  <span className="opacity-40">—</span>
                );
              },
            })),
          ]}
        />
      )}
    </Card>
  );
}

/** Giờ Việt Nam, dễ đọc. */
function dinhDangGio(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

/** Bọc một ô cho đúng chuẩn CSV. */
function oCsv(v: string): string {
  return `"${String(v).replace(/"/g, '""')}"`;
}
