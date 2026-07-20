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
  FormOutlined,
  HeartOutlined,
  HistoryOutlined,
  InboxOutlined,
  MailOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  ScheduleOutlined,
  SendOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
} from "@ant-design/icons";

export const ADMIN_ICONS: Record<string, ReactNode> = {
  "thuong-hieu": <TagsOutlined />,
  slideshow: <PlaySquareOutlined />,
  "trang-chu": <PictureOutlined />,
  "dang-ky": <FormOutlined />,
  "dang-ky-nhan-duoc": <InboxOutlined />,
  "mau-email": <MailOutlined />,
  "gui-email": <SendOutlined />,
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
