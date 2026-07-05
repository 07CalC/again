import { getAsyncDB } from "@/db";
import Socials from "./Social";

export const dynamic = "force-dynamic";

export default async function Hero() {
  const db = await getAsyncDB();
  const thought =
    await db.query.thoughts.findFirst({
      orderBy: (thoughts, { desc }) =>
        desc(thoughts.createdAt),
    }) || {
      content: "The less I know, the better.",
      createdAt: new Date().toISOString(),
    };
  return (
    <section className="flex flex-col gap-8 sm:gap-10 pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="space-y-4 sm:space-y-6">
        <h1
          className="
            text-4xl
            sm:text-5xl
            md:text-7xl
            font-serif
            font-normal
            tracking-tight
            text-gray-900
            dark:text-gray-100
          "
        >
          Vinayak Maheshwari.
        </h1>

        <div
          className="
            max-w-2xl
            space-y-5
            font-mono
            text-sm
            leading-7
          "
        >
          <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">
            Who am i witout my silliness? A calc.
          </p>


        </div>
      </div>

      {/* Thought Card */}
      <div
        className="
          relative
          w-fit
          max-w-2xl
          overflow-hidden
          rounded-3xl
          border border-gray-200/60 dark:border-white/10
          bg-white/50 dark:bg-black/20
          px-6
          py-5
          backdrop-blur-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        "
      >
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_70%)]
          "
        />

        <div className="relative flex gap-4">
          <div
            className="
              text-blue-500 dark:text-blue-400
              font-serif
              text-5xl
              leading-none
              -mt-1
            "
          >
            &ldquo;
          </div>

          <div className="space-y-2">
            <p
              className="
                text-sm
                font-medium
                text-gray-700 dark:text-zinc-200
              "
            >
              {thought.content}
            </p>

            <p
              className="
                text-xs
                font-mono
                text-gray-500 dark:text-zinc-400
              "
            >
              Random thought from{" "}
              <span className="text-blue-500 dark:text-blue-400">
                {new Date(
                  thought.createdAt!
                ).toLocaleDateString(
                  "en-IN",
                  {
                    dateStyle: "full",
                  }
                )}
              </span>
            </p>
          </div>
        </div>
      </div>

      <Socials />
    </section>
  );
}
