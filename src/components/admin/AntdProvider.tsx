"use client";

// Nền tảng Ant Design cho khu quản trị: SSR registry + ConfigProvider
// (brand xanh #2e7d32) + patch React 19 + App context (message/notification).
import "@ant-design/v5-patch-for-react-19";
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          // Không tuỳ chỉnh cỡ chữ — để nguyên mặc định của Ant Design.
          token: {
            colorPrimary: "#2e7d32",
            // #2e7d32 là xanh đậm nên antd tự suy ra nền nhạt bị xám đục
            // (#b3bdb1) — chỉ định thẳng sắc xanh nhạt cho đúng tông thương hiệu.
            colorPrimaryBg: "#e6f4ea",
            colorPrimaryBgHover: "#d5eadc",
          },
          components: {
            // Mục menu đang chọn: nền xanh nhạt + chữ xanh đậm cho dễ đọc.
            Menu: {
              itemSelectedBg: "#e6f4ea",
              itemSelectedColor: "#1b5e20",
              itemHoverBg: "rgba(46,125,50,0.06)",
              itemBorderRadius: 8,
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
