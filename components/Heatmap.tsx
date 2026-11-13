interface Contribution {
  date: string;
  count: number;
  level: number;
}

const levelColors = [
  "bg-line",
  "opacity-25 bg-fg",
  "opacity-45 bg-fg",
  "opacity-65 bg-fg",
  "opacity-90 bg-fg",
];

function getMonthLabels(weeks: Contribution[][]) {
  return weeks.map((week, i) => {
    const day = week[0];
    if (!day?.date) return "";
    const date = new Date(day.date);
    const prev = weeks[i - 1]?.[0];
    if (prev && new Date(prev.date).getMonth() === date.getMonth()) return "";
    return date.toLocaleString("en-US", { month: "short" });
  });
}

export default async function Heatmap({
  className = "mt-16",
}: {
  className?: string;
}) {
  let weeks: Contribution[][] = [];

  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/07calc?y=last",
      { next: { revalidate: 3600 } }
    );
    const data: { contributions: Contribution[] } = await res.json();
    const contributions = data.contributions;

    for (let i = 0; i < contributions.length; i += 7) {
      weeks.push(contributions.slice(i, i + 7));
    }
  } catch {
    return null;
  }

  const monthLabels = getMonthLabels(weeks);
  const total = weeks.flat().reduce((sum, day) => sum + day.count, 0);

  return (
    <section aria-label="GitHub contributions" className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="voice-label">github · last 12 months</p>
        <p className="voice-meta text-faint">{total.toLocaleString()} contributions</p>
      </div>
      <div className="no-scrollbar mt-5 overflow-x-auto">
        <div className="min-w-fit">
          <div className="ml-[34px] mb-1.5 flex gap-[3px]">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="w-3 text-center font-mono text-[9px] text-faint"
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, j) => {
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
                      className={`h-3 w-3 rounded-[2px] ${
                        day ? levelColors[day.level] : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
