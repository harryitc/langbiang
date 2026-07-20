// Trang quản trị: Kho ảnh tập trung (album). Tạo/sửa/xoá album, upload, xoá,
// di chuyển ảnh. Mọi trường ảnh trong CMS chọn ảnh từ kho này.
import { Card } from "antd";
import MediaBrowser from "@/components/admin/MediaBrowser";

export default function Page() {
  return (
    <Card
      title="Kho ảnh"
      styles={{ body: { paddingTop: 12 } }}
    >
      <p className="mb-3 text-sm opacity-60">
        Tất cả ảnh của website nằm ở đây, sắp xếp theo album. Ảnh tải lên sẽ vào
        kho trước; ở các phần nội dung, bấm &ldquo;Chọn từ kho ảnh&rdquo; để lấy
        ra dùng. Xoá ảnh upload sẽ xoá luôn file trên lưu trữ.
      </p>
      <MediaBrowser mode="manage" />
    </Card>
  );
}
