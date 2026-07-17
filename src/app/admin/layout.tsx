import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdProvider from "@/components/admin/AntdProvider";

export const metadata: Metadata = {
  title: "Quản trị nội dung",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <AntdProvider>{children}</AntdProvider>
    </AntdRegistry>
  );
}
