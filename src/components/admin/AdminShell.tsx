"use client";

// Khung quản trị: Sider menu theo admin-nav + thanh trên (Xuất bản / Đăng xuất).
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { App, Breadcrumb, Button, Layout, Menu, Popconfirm } from "antd";
import {
  CloudUploadOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ADMIN_NAV, ADMIN_NAV_ITEMS, findNavGroup } from "@/lib/admin-nav";
import { adminIcon } from "./adminIcons";
import { publishDraftAction } from "@/lib/content/actions";
import { logoutAction } from "@/lib/content/auth-actions";

const { Sider, Header, Content } = Layout;

export default function AdminShell({ children }: { children: ReactNode }) {
  const { message } = App.useApp();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Slug hiện tại từ /admin/<slug>
  const current = pathname?.replace(/^\/admin\/?/, "").split("/")[0] || "";
  const currentItem = ADMIN_NAV_ITEMS.find((it) => it.slug === current);
  const group = findNavGroup(current);

  const items: MenuProps["items"] = ADMIN_NAV.map((group) => ({
    key: group.label,
    type: "group",
    label: group.label,
    children: group.items.map((it) => ({
      key: it.slug,
      icon: adminIcon(it.slug),
      label: <Link href={`/admin/${it.slug}`}>{it.label}</Link>,
    })),
  }));

  const onPublish = async () => {
    setPublishing(true);
    try {
      const res = await publishDraftAction();
      if (res.ok) message.success("Đã xuất bản.");
      else message.error(res.error || "Xuất bản thất bại.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        theme="light"
        // Dưới 992px: menu tự thu về dạng nổi (không chiếm chỗ), để admin dùng
        // được trên điện thoại.
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{ borderRight: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div
          style={{
            padding: collapsed ? "16px 8px" : "16px 20px",
            fontWeight: 800,
            color: "#2e7d32",
            fontSize: 15,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {collapsed ? "TS" : "Trăng Sáng"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={current ? [current] : []}
          items={items}
          style={{ borderInlineEnd: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((c) => !c)}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Popconfirm
              title="Xuất bản thay đổi?"
              description="Nội dung nháp sẽ hiển thị công khai."
              okText="Xuất bản"
              cancelText="Huỷ"
              onConfirm={onPublish}
            >
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={publishing}
              >
                Xuất bản
              </Button>
            </Popconfirm>
            <form action={logoutAction}>
              <Button htmlType="submit" icon={<LogoutOutlined />}>
                Đăng xuất
              </Button>
            </form>
          </div>
        </Header>

        <Content style={{ padding: 24 }}>
          {/* Không bó khung 960px căn giữa: khu nhập liệu tận dụng hết chiều
              ngang màn hình, đỡ phải cuộn dọc nhiều. */}
          <div>
            {/* Breadcrumb thay cho tiêu đề H4 (vốn trùng y hệt tiêu đề thẻ bên
                dưới). Hiện thêm tên nhóm để biết mục này thuộc trang nào. */}
            <Breadcrumb
              style={{ marginBottom: 16 }}
              items={[
                { title: <Link href="/admin">Quản trị</Link> },
                ...(group ? [{ title: group.label }] : []),
                ...(currentItem ? [{ title: <strong>{currentItem.label}</strong> }] : []),
              ]}
            />
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
