import { db } from "@/db";
import Socials from "./Social";

export default async function Hero() {
  const thought =
    (await db.query.thoughts.findFirst({
      orderBy: (thoughts, { desc }) =>
        desc(thoughts.createdAt),
    })) || {
      content: "The less I know, the better.",
      createdAt: new Date().toISOString(),
    };
  return (
    <section className="flex flex-col gap-10 pt-20 pb-16">
      <div className="space-y-6">
        <h1
          className="
            text-5xl
            md:text-7xl
            font-serif
            font-normal
            tracking-tight
            text-gray-100
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
            text-gray-400
          "
        >
          <p className="text-zinc-300 text-lg">
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
          border border-white/10
          bg-black/20
          px-6
          py-5
          backdrop-blur-xl
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        "
      >
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_70%)]
          "
        />

        <div className="relative flex gap-4">
          <div
            className="
              text-blue-400
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
                text-zinc-200
              "
            >
              {thought.content}
            </p>

            <p
              className="
                text-xs
                font-mono
                text-zinc-400
              "
            >
              Random though from{" "}
              <span className="text-blue-400">
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
