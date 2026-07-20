"use client";

// Ánh xạ slug menu -> icon Ant Design.
// Tách khỏi src/lib/admin-nav.ts để file đó giữ nguyên dạng dữ liệu thuần
// (không JSX), còn phần hiển thị nằm trọn ở tầng giao diện.
import type { ReactNode } from "react";
import {
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  HeartOutlined,
  HistoryOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  ScheduleOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const ADMIN_ICONS: Record<string, ReactNode> = {
  "thuong-hieu": <TagsOutlined />,
  slideshow: <PlaySquareOutlined />,
  "anh-trang-chu": <PictureOutlined />,
  "hoat-dong": <AppstoreOutlined />,
  "lich-trinh": <ScheduleOutlined />,
  "ly-do": <HeartOutlined />,
  faq: <QuestionCircleOutlined />,
  "gay-quy": <ShoppingOutlined />,
  "tai-tro": <ShopOutlined />,
  "ban-to-chuc": <TeamOutlined />,
  "chi-tieu": <FileTextOutlined />,
  "kho-anh": <FolderOpenOutlined />,
  "su-kien": <CalendarOutlined />,
  "nam-da-qua": <HistoryOutlined />,
  "tin-tuc": <ReadOutlined />,
};

/** Icon của một mục menu; thiếu thì trả undefined để antd tự bỏ qua. */
export function adminIcon(slug: string): ReactNode {
  return ADMIN_ICONS[slug];
}
