"use client";

import Link from "next/link";
import { Card, Col, Row, Typography } from "antd";
import { ADMIN_NAV } from "@/lib/admin-nav";

export default function DashboardBody() {
  return (
    <>
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Chỉnh sửa lưu vào <b>bản nháp</b> và xem trước ngay. Bật công tắc{" "}
        <b>Xem nháp</b> để duyệt website ở chế độ nháp, rồi bấm <b>Xuất bản</b> để
        đưa lên. Website hoạt động bình thường dù không đụng tới code.
      </Typography.Paragraph>

      {ADMIN_NAV.filter((g) => g.label !== "Tổng quan").map((g) => (
        <div key={g.label} style={{ marginBottom: 18 }}>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            {g.label}
          </Typography.Text>
          <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
            {g.items.map((it) => (
              <Col key={it.key} xs={12} sm={8} lg={6}>
                <Link href={it.href}>
                  <Card size="small" hoverable style={{ height: "100%" }}>
                    <div style={{ fontWeight: 600 }}>{it.label}</div>
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
