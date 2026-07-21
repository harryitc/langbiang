// Trang quản trị: Nhà tài trợ.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import SponsorsEditor from "@/components/admin/editors/SponsorsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return (
    <SponsorsEditor
      initialTiers={content.main.sponsorTiers}
      initialHeader={
        content.main.sponsorsHeader ?? {
          eyebrow: "Đơn vị đồng hành",
          title: "Cảm ơn những",
          titleHighlight: "tấm lòng vàng",
          desc: "Sự đồng hành của các đơn vị dưới đây giúp ánh trăng của chúng mình toả sáng hơn.",
        }
      }
    />
  );
}
