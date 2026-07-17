"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Layout, Menu, Button, Popconfirm, Switch, Space, Typography, App } from "antd";
import {
  DashboardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
  AppstoreOutlined,
  ScheduleOutlined,
  HeartOutlined,
  BarChartOutlined,
  PictureOutlined,
  TrophyOutlined,
  TeamOutlined,
  CrownOutlined,
  ShopOutlined,
  GiftOutlined,
  AuditOutlined,
  MessageOutlined,
  CloudUploadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { ADMIN_NAV, ADMIN_NAV_FLAT } from "@/lib/admin-nav";
import { logoutAction, publishAction, setPreviewAction } from "@/lib/content/actions";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const ICONS: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  global: <GlobalOutlined />,
  calendar: <CalendarOutlined />,
  read: <ReadOutlined />,
  question: <QuestionCircleOutlined />,
  appstore: <AppstoreOutlined />,
  schedule: <ScheduleOutlined />,
  heart: <HeartOutlined />,
  bar: <BarChartOutlined />,
  picture: <PictureOutlined />,
  trophy: <TrophyOutlined />,
  team: <TeamOutlined />,
  crown: <CrownOutlined />,
  shop: <ShopOutlined />,
  gift: <GiftOutlined />,
  audit: <AuditOutlined />,
  message: <MessageOutlined />,
};

export default function AdminShell({
  children,
  previewOn = true,
}: {
  children: ReactNode;
  previewOn?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState(previewOn);
  const pathname = usePathname();
  const router = useRouter();
  const { message } = App.useApp();

  const selected =
    ADMIN_NAV_FLAT.find((i) => i.href === pathname)?.key ??
    (pathname?.startsWith("/admin/") ? pathname.slice(7) : "dashboard");
  const title = ADMIN_NAV_FLAT.find((i) => i.href === pathname)?.label ?? "Bảng điều khiển";

  const items = ADMIN_NAV.map((g) => ({
    key: g.label,
    label: g.label,
    type: "group" as const,
    children: g.items.map((it) => ({
      key: it.key,
      icon: ICONS[it.icon ?? ""],
      label: <Link href={it.href}>{it.label}</Link>,
    })),
  }));

  const doPublish = async () => {
    setPublishing(true);
    const res = await publishAction();
    setPublishing(false);
    if (res.ok) message.success("Đã xuất bản ra website!");
    else message.error("Xuất bản thất bại.");
  };

  const togglePreview = async (on: boolean) => {
    setPreview(on);
    await setPreviewAction(on);
    router.refresh();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        width={224}
        style={{ borderRight: "1px solid #eef0f2", position: "sticky", top: 0, height: "100vh", overflow: "auto" }}
      >
        <div style={{ padding: "14px 16px", fontWeight: 700, whiteSpace: "nowrap" }}>
          🌙 {collapsed ? "" : "Langbiang CMS"}
        </div>
        <Menu mode="inline" selectedKeys={[selected]} items={items} style={{ borderInlineEnd: 0 }} />
      </Sider>

      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "#fff",
            borderBottom: "1px solid #eef0f2",
            paddingInline: 16,
            height: 52,
            lineHeight: "52px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text strong style={{ fontSize: 15 }}>{title}</Text>
          <Space style={{ marginLeft: "auto" }} size="small">
            <Space size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Xem nháp</Text>
              <Switch size="small" checked={preview} onChange={togglePreview} />
            </Space>
            <Button size="small" href="/" target="_blank">Mở website ↗</Button>
            <Popconfirm
              title="Xuất bản toàn bộ bản nháp ra website?"
              okText="Xuất bản"
              cancelText="Huỷ"
              onConfirm={doPublish}
            >
              <Button size="small" type="primary" icon={<CloudUploadOutlined />} loading={publishing}>
                Xuất bản
              </Button>
            </Popconfirm>
            <form action={logoutAction}>
              <Button size="small" type="text" htmlType="submit" icon={<LogoutOutlined />} title="Đăng xuất" />
            </form>
          </Space>
        </Header>

        <Content style={{ padding: 16, background: "#f6f7f9" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
