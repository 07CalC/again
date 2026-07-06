export default function HeatmapSkeleton() {
  return (
    <section className="flex flex-col gap-4 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 rounded bg-gray-300 dark:bg-white/10" />
        <div className="h-5 w-40 rounded bg-gray-300 dark:bg-white/10" />
      </div>
      <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-5 md:p-6 backdrop-blur-xl">
        <div className="flex gap-[4px] sm:gap-1">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[4px] sm:gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div
                  key={j}
                  className="rounded-[4px] sm:rounded-[3px] w-[clamp(14px,3vw,16px)] h-[clamp(14px,3vw,16px)] bg-gray-200/40 dark:bg-white/[0.04]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
