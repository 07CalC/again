interface Contribution {
  date: string;
  count: number;
  level: number;
}

const levelColors = [
  "bg-gray-200/40 dark:bg-white/[0.04]",
  "bg-gray-400/40 dark:bg-white/[0.15]",
  "bg-gray-500/50 dark:bg-white/[0.35]",
  "bg-gray-700/60 dark:bg-white/[0.55]",
  "bg-gray-900/70 dark:bg-white/[0.85]",
];

function getMonthLabels(weeks: Contribution[][]) {
  return weeks.map((week, i) => {
    const day = week[0];
    if (!day?.date) return "";

    const date = new Date(day.date);
    const month = date.toLocaleString("default", { month: "short" });

    const prev = weeks[i - 1]?.[0];
    if (prev && new Date(prev.date).getMonth() === date.getMonth()) return "";

    return month;
  });
}

export default async function Heatmap() {
  let weeks: Contribution[][] = [];

  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/07calc?y=last",
      { next: { revalidate: 3600 } }
    );
    const data: any = await res.json();
    const contributions: Contribution[] = data.contributions;

    for (let i = 0; i < contributions.length; i += 7) {
      weeks.push(contributions.slice(i, i + 7));
    }
  } catch {
    return null;
  }

  const monthLabels = getMonthLabels(weeks);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100">
          Contributions
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          Someone&apos;s been busy
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-5 md:p-6 backdrop-blur-xl">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-fit">
            <div className="flex gap-[4px] sm:gap-1 ml-[34px] sm:ml-9 mb-2 text-[11px] font-mono text-gray-500 dark:text-gray-500">
              {monthLabels.map((label, i) => (
                <div key={i} className="w-[clamp(14px,3vw,16px)] text-center">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-[4px] sm:gap-1">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-[4px] sm:gap-1">
                  {[...Array(7)].map((_, j) => {
                    const day = week[j];
                    return (
                      <div
                        key={j}
                        title={
                          day
                            ? `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${new Date(day.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`
                            : undefined
                        }
                        className={`rounded-[4px] sm:rounded-[3px] w-[clamp(14px,3vw,16px)] h-[clamp(14px,3vw,16px)] ${day ? levelColors[day.level] : "bg-transparent"}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
