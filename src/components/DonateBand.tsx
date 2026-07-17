import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Gian hàng quyên góp — dải CTA nổi bật, "nháy nháy" thu hút (anh Vũ yêu cầu).
 * Responsive: 1 cột trên mobile, 2 cột từ md.
 */
export default function DonateBand() {
  return (
    <section id="donate" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#ee4d2d] via-[#f4602f] to-[#ff7337] p-7 text-white shadow-soft sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />

            <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:items-center md:justify-between md:text-left">
              <div className="max-w-xl">
                <span className="animate-blink inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                  <span className="block h-2 w-2 rounded-full bg-white" />
                  Gian hàng quyên góp
                </span>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
                  Mua sắm cũng là sẻ chia 🛒
                </h2>
                <p className="mt-2 text-sm text-white/90 sm:text-base">
                  Mỗi sản phẩm bạn mua tại gian hàng Shopee của dự án là một phần
                  quà Trung thu gửi đến các em nhỏ Langbiang.
                </p>
              </div>

              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:min-w-[220px]">
                <a
                  href={site.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-pulse-glow flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-[#ee4d2d] transition hover:scale-[1.03]"
                >
                  Ghé gian hàng Shopee
                </a>
                <Link
                  href="/gay-quy"
                  className="rounded-full border-2 border-white/60 px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Cách khác để đóng góp
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
