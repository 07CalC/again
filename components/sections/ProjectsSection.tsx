import Link from "next/link";
import { projects } from "@/lib/projects";
import { ArrowRight, ExternalLink, GitBranch } from "lucide-react";

export default function ProjectsSection({ limit }: { limit?: number }) {
  const items = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-gray-900 dark:text-gray-100">
          Projects
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          things i have built or am building
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((project) => (
          <div
            key={project.title}
            className="group rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:border-gray-300/80 dark:hover:border-white/20 hover:shadow-lg flex flex-col gap-3"
          >
            {project.image && (
              <div className="overflow-hidden rounded-xl -mx-1 -mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-32 object-cover rounded-xl transition-transform group-hover:scale-105"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-200 leading-snug">
                  {project.title}
                </h3>
                <span className={
                    "shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full " + (
                      project.status === "Maintained" ? "bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" :
                      project.status === "Abandoned" ? "bg-red-100/60 dark:bg-red-900/30 text-red-600 dark:text-red-300" :
                      "bg-blue-100/60 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                    )
                  }>
                  {project.status}
                </span>
              </div>

              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-auto pt-1">
              {project.demo && (
                <Link
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-mono text-blue-500 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink size={14} />
                  visit
                </Link>
              )}
              {project.github && (
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  <GitBranch size={14} />
                  source
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {limit && (
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors w-fit mt-2"
        >
          all projects <ArrowRight size={14} />
        </Link>
      )}
    </section>
  );
}
