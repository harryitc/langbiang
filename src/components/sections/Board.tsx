import { getContent } from "@/lib/content/store";
import MembersList from "./MembersList";

export default async function Members() {
  const { main } = await getContent();
  const { board } = main;
  if (!board?.members || board.members.length === 0) return null;

  return (
    <section id="members" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Đội ngũ
          </span>
          <h2 className="font-display text-3xl font-extrabold text-gradient-green sm:text-5xl">
            Ban tổ chức
          </h2>
        </div>

        <MembersList members={board.members} />
      </div>
    </section>
  );
}
