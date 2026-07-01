# 🌕 Trăng Sáng Langbiang — Landing Page

Landing page cho **dự án tình nguyện Trăng Sáng Langbiang** — mang Trung thu ấm áp
đến các em nhỏ vùng cao Langbiang, Đà Lạt, Lâm Đồng. Mùa 2 diễn ra **19–20/9/2026**.

## 🛠 Công nghệ

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design system tông xanh thiên nhiên
- **GSAP + ScrollTrigger** — animation intro & reveal khi cuộn
- **Three.js** — nền hero 3D (trăng, đom đóm, lá bay, parallax theo chuột)
- **Lenis** — smooth scroll
- **SEO**: metadata Open Graph/Twitter, JSON-LD (schema.org Event), `robots.txt`, `sitemap.xml`

## 🚀 Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm run start    # chạy bản production
```

## 📁 Cấu trúc

```
src/
├── app/
│   ├── layout.tsx      # SEO metadata, fonts, JSON-LD
│   ├── page.tsx        # ghép các section
│   ├── globals.css     # design system + animation
│   ├── robots.ts       # robots.txt
│   └── sitemap.ts      # sitemap.xml
├── components/
│   ├── HeroCanvas.tsx  # nền Three.js
│   ├── Hero.tsx        # section hero + countdown
│   ├── Header.tsx      # nav + mobile menu
│   ├── Reveal.tsx      # wrapper animation GSAP
│   ├── Countdown.tsx   # đếm ngược sự kiện
│   ├── Decor.tsx       # họa tiết lá, hoa cúc, cỏ
│   ├── Placeholder.tsx # khung ảnh placeholder
│   └── sections/       # About, Journey, Activities, Timeline, Gallery, Register, Faq, Footer
└── lib/site.ts         # toàn bộ nội dung/dữ liệu (dễ chỉnh sửa)
```

## ✏️ Tuỳ chỉnh nội dung

Mọi text, số liệu, lịch trình, FAQ nằm trong **`src/lib/site.ts`** — chỉ cần sửa file này.

## 🖼 Thay ảnh thật

Các khung `<Placeholder>` đang là placeholder. Khi có ảnh:
1. Thêm ảnh vào `public/images/`
2. Thay `<Placeholder .../>` bằng `<Image src="/images/..." .../>` của `next/image`.

## 🎨 Bảng màu

| Vai trò | Màu |
|---|---|
| Trời | `#a8e0f0` → `#6cc5e0` |
| Lá / cỏ | `#7cc34a` · `#5cb85c` · `#2e7d32` |
| Rừng (chữ) | `#1b5e20` |
| Nắng (điểm nhấn) | `#f5a623` · `#f57f17` |
