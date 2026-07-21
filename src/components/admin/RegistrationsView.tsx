"use client";

// Bảng "Đăng ký nhận được" — liệt kê các lượt khách gửi MỘT form đăng ký,
// mới nhất trước, kèm nút tải về file CSV để mở bằng Excel / Google Sheet.
// Mỗi form có danh sách riêng; đổi form bằng ô chọn ở đầu trang.
//
// Tích chọn vài dòng rồi bấm "Gửi email…" để sang màn hình gửi thư cho đúng
// những người đó.
import type { Key } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Empty, Image, Select, Space, Table, Tag } from "antd";
import { DownloadOutlined, MailOutlined } from "@ant-design/icons";
import {
  parseRoles,
  type Registration,
  type RegisterFieldType,
} from "@/lib/content/schema";
import { KHOA_CHON_TAM } from "./GuiEmailView";

type Cot = { name: string; label: string; type?: RegisterFieldType };
type FormItem = { id: string; name: string };

export default function RegistrationsView({
  forms,
  currentFormId,
  currentFormName,
  items,
  fields,
  recipientEmail,
}: {
  forms: FormItem[];
  currentFormId: string;
  currentFormName: string;
  items: Registration[];
  fields: Cot[];
  recipientEmail: string;
}) {
  const router = useRouter();
  const [dangChuyen, startChuyen] = useTransition();
  const [xemAnh, setXemAnh] = useState<string | null>(null);
  // Các dòng đang tích: giữ cả khoá dòng (để bảng hiện dấu tích) lẫn mốc thời
  // gian (để báo cho màn hình gửi email biết là những lượt đăng ký nào).
  const [tichKeys, setTichKeys] = useState<Key[]>([]);
  const [tichMoc, setTichMoc] = useState<string[]>([]);

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
    a.download = `dang-ky-${currentFormId}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Sang màn hình gửi email với đúng những dòng đang tích.
   * Danh sách có thể rất dài nên gửi qua bộ nhớ phiên của trình duyệt thay vì
   * nhét vào địa chỉ trang. Đây chỉ là gợi ý — máy chủ vẫn tự tra lại địa chỉ
   * email từ dữ liệu gốc.
   */
  const guiEmailChoNguoiDaChon = () => {
    sessionStorage.setItem(
      KHOA_CHON_TAM,
      JSON.stringify({ formId: currentFormId, moc: tichMoc })
    );
    startChuyen(() =>
      router.push(`/admin/gui-email?form=${currentFormId}`)
    );
  };

  return (
    <Card
      title="Đăng ký nhận được"
      extra={
        <Space orientation="horizontal" size="small" wrap>
          <Button
            type="primary"
            icon={<MailOutlined />}
            className="cursor-pointer"
            disabled={tichMoc.length === 0}
            onClick={guiEmailChoNguoiDaChon}
          >
            {tichMoc.length === 0
              ? "Gửi email"
              : `Gửi email (${tichMoc.length})`}
          </Button>
          <Button
            icon={<DownloadOutlined />}
            className="cursor-pointer"
            disabled={items.length === 0}
            onClick={taiCsv}
          >
            Tải về file CSV
          </Button>
        </Space>
      }
      styles={{ body: { paddingTop: 12 } }}
    >
      <p className="mb-3 text-sm opacity-60">
        Mỗi dòng là một lượt khách bấm gửi ở form đăng ký, mới nhất nằm trên
        cùng. Mỗi form có danh sách riêng — chọn form bên dưới để xem. Không sửa
        hay xoá được ở đây; tích chọn vài dòng thì gửi email cho đúng những
        người đó được. Hệ thống giữ lại 500 lượt gần nhất cho mỗi form.
      </p>

      <Space orientation="horizontal" size="small" wrap className="mb-3">
        <span className="text-sm font-semibold">Xem đăng ký của form:</span>
        <Select<string>
          value={currentFormId}
          loading={dangChuyen}
          style={{ minWidth: 260 }}
          className="cursor-pointer"
          options={forms.map((f) => ({ value: f.id, label: f.name }))}
          onChange={(id) => {
            // Đổi form thì bỏ hết dấu tích cũ — chúng thuộc danh sách khác.
            setTichKeys([]);
            setTichMoc([]);
            startChuyen(() => router.push(`/admin/dang-ky-nhan-duoc?form=${id}`));
          }}
        />
      </Space>

      {recipientEmail ? (
        <Alert
          className="mb-3"
          type="info"
          showIcon
          title={`Mỗi lượt đăng ký form “${currentFormName}” cũng được gửi email báo tới ${recipientEmail}.`}
          description="Đổi địa chỉ này ở mục “Form đăng ký”, trong chính form đó. Dù email trục trặc, dữ liệu vẫn nằm nguyên ở đây."
        />
      ) : (
        <Alert
          className="mb-3"
          type="warning"
          showIcon
          title={`Form “${currentFormName}” chưa đặt email nhận thông báo đăng ký.`}
          description="Vào mục “Form đăng ký” để điền, nếu không sẽ phải tự vào trang này xem mới biết có người đăng ký."
        />
      )}

      {items.length === 0 ? (
        <Empty description={`Chưa có ai đăng ký form “${currentFormName}”.`} />
      ) : (
        <Table<Registration>
          size="small"
          rowKey={(r, i) => `${r.at}-${i}`}
          dataSource={items}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 20, showSizeChanger: true }}
          rowSelection={{
            selectedRowKeys: tichKeys,
            onChange: (keys, rows) => {
              setTichKeys(keys);
              setTichMoc(rows.map((r) => r.at));
            },
          }}
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
                if (!v) return <span className="opacity-40">—</span>;
                if (c.type === "photo") {
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v}
                      alt={c.label}
                      className="h-12 w-12 cursor-pointer rounded object-cover"
                      onClick={() => setXemAnh(v)}
                    />
                  );
                }
                // Ô vai trò chứa NHIỀU giá trị nối bằng dấu phẩy — tách ra
                // thành từng thẻ cho dễ đọc và dễ đếm.
                if (c.type === "roles") {
                  return (
                    <Space size={[4, 4]} wrap>
                      {parseRoles(v).map((vaiTro) => (
                        <Tag key={vaiTro} color="green">
                          {vaiTro}
                        </Tag>
                      ))}
                    </Space>
                  );
                }
                return <span className="whitespace-pre-wrap">{v}</span>;
              },
            })),
          ]}
        />
      )}

      {/* Xem ảnh cỡ lớn khi bấm vào ảnh trong bảng. */}
      <Image
        alt="Ảnh người đăng ký gửi kèm"
        style={{ display: "none" }}
        src={xemAnh ?? ""}
        preview={{
          open: xemAnh !== null,
          onOpenChange: (open) => {
            if (!open) setXemAnh(null);
          },
        }}
      />
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
