"use client";

import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider, App, theme } from "antd";
import type { ReactNode } from "react";

/**
 * Cấu hình chung cho toàn bộ giao diện admin: theme gọn (compact), cỡ nhỏ,
 * tông xanh lá đồng bộ với thương hiệu Trăng Sáng Langbiang.
 */
export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          colorPrimary: "#2e7d32",
          borderRadius: 8,
          fontSize: 13,
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
