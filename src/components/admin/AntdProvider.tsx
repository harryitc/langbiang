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
          algorithm: theme.compactAlgorithm,
          token: {
            colorPrimary: "#2e7d32",
            // #2e7d32 là xanh đậm nên antd tự suy ra nền nhạt bị xám đục
            // (#b3bdb1) — chỉ định thẳng sắc xanh nhạt cho đúng tông thương hiệu.
            colorPrimaryBg: "#e6f4ea",
            colorPrimaryBgHover: "#d5eadc",
          },
          components: {
            Menu: {
              // Chữ menu sidebar 13px — đặt qua token của antd thay vì style
              // inline để mọi trạng thái (chọn/hover/thu gọn) đều đồng bộ.
              fontSize: 13,
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
