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
          token: { colorPrimary: "#2e7d32" },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
