"use client";

// Nội dung bảng điều khiển. Là client component vì dùng cú pháp gộp của antd
// (Typography.Title/Paragraph) — kiểu này không dùng được trong server component:
// antd đi qua ranh giới RSC dưới dạng client reference, truy cập thuộc tính con
// sẽ ra undefined.
import Link from "next/link";
import { Card, Col, Row, Typography } from "antd";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { adminIcon } from "./adminIcons";

export default function DashboardHome({ currentYear }: { currentYear: number }) {
  return (
    <>
      <Typography.Paragraph type="secondary">
        Đang biên tập nội dung mùa <strong>{currentYear}</strong>. Mọi thay đổi
        được lưu nháp tự động; bấm <strong>Xuất bản</strong> ở thanh trên để
        hiển thị công khai.
      </Typography.Paragraph>

      {ADMIN_NAV.map((group) => (
        <div key={group.label} style={{ marginBottom: 24 }}>
          <Typography.Title level={5}>{group.label}</Typography.Title>
          <Row gutter={[12, 12]}>
            {group.items.map((item) => (
              <Col key={item.slug} xs={12} sm={8} md={6}>
                <Link href={`/admin/${item.slug}`}>
                  <Card hoverable size="small" style={{ height: "100%" }}>
                    <div style={{ fontSize: 20, color: "#2e7d32" }}>
                      {adminIcon(item.slug)}
                    </div>
                    <div style={{ fontWeight: 600, marginTop: 6 }}>
                      {item.label}
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
}
