"use client";

// Nền tảng Ant Design cho khu quản trị: SSR registry + ConfigProvider (compact,
// brand xanh #2e7d32) + patch React 19 + App context (message/notification).
import "@ant-design/v5-patch-for-react-19";
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider, theme } from "antd";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          // Không dùng compactAlgorithm: nó co cả cỡ chữ (seed 16 -> render 14px)
          // và bóp khoảng cách, gây chật chội khi nhập liệu nhiều.
          token: {
            colorPrimary: "#2e7d32",
            // Cỡ chữ mặc định toàn khu quản trị (antd mặc định 14px).
            // Mọi thành phần kế thừa từ đây nên không cần chỉnh riêng lẻ.
            fontSize: 16,
            // #2e7d32 là xanh đậm nên antd tự suy ra nền nhạt bị xám đục
            // (#b3bdb1) — chỉ định thẳng sắc xanh nhạt cho đúng tông thương hiệu.
            colorPrimaryBg: "#e6f4ea",
            colorPrimaryBgHover: "#d5eadc",
          },
          components: {
            Menu: {
              // Menu nhỏ hơn nền chung (16px) một bậc cho gọn sidebar.
              fontSize: 14,
              // Mục đang chọn: nền xanh nhạt + chữ xanh đậm cho dễ đọc.
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
