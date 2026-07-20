// Trang quản trị: Ảnh trang chủ (logo, ảnh Hero, ảnh mục Giới thiệu).
import { getDraftContent } from "@/lib/content/store";
import HomeImagesEditor from "@/components/admin/editors/HomeImagesEditor";

export default async function Page() {
  const { main } = await getDraftContent();
  return (
    <HomeImagesEditor
      initial={{
        site: main.site,
        heroPhotos: main.heroPhotos,
        aboutImage: main.aboutImage,
        about: main.about,
      }}
    />
  );
}
