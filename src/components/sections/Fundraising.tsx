import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import FundraisingChannels from "./FundraisingChannels";

export default async function Fundraising({
  showHeading = true,
  bg = true,
}: {
  showHeading?: boolean;
  bg?: boolean;
}) {
  const { main } = await getContent();
  const fundraising = main.fundraising;

  return (
    <section
      id="fundraising"
      className={`relative overflow-hidden py-16 sm:py-24 ${
        bg ? "bg-[#eef8ea] dark:bg-night-2" : ""
      }`}
    >
      {/* đốm sáng nền */}
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25">
        <div className="absolute right-[8%] top-[15%] h-40 w-40 rounded-full bg-sun/40 blur-3xl" />
        <div className="absolute left-[10%] bottom-[10%] h-52 w-52 rounded-full bg-leaf/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-sun/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunset">
              Chung tay gây quỹ
            </span>
            <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              {fundraising.title}{" "}
              <span className="text-gradient-sun">Trăng Sáng</span>
            </h2>
            <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
              {fundraising.desc}
            </p>
          </Reveal>
        )}

        <Reveal>
          <FundraisingChannels channels={fundraising.channels} />
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-forest/60 dark:text-ink/60">
            Mọi đóng góp đều được ghi nhận và công khai minh bạch trên Fanpage của dự án.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
