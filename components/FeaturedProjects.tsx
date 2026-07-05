import Link from "next/link";

export default function FeaturedProjects() {
  const projects = [
    {
      initial: "M",
      title: "Mortar",
      description: "Unified communication API for developers.",
      status: "Building",
      statusColor: "text-blue-500 dark:text-blue-400"
    },
    {
      initial: "C",
      title: "CRUX",
      description: "Developer tools for the modern world.",
      status: "Shipped",
      statusColor: "text-emerald-600 dark:text-emerald-500"
    },
    {
      initial: "D",
      title: "Dorara",
      description: "Modern freelancing platform.",
      status: "Shipped",
      statusColor: "text-emerald-600 dark:text-emerald-500"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-blue-500 dark:text-blue-400 font-mono text-sm">/ featured projects</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projects.map((project, i) => (
          <div key={i} className="bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400 font-medium">
              {project.initial}
            </div>
            
            <div className="flex flex-col gap-2 flex-grow">
              <h3 className="text-gray-900 dark:text-gray-200 font-medium">{project.title}</h3>
              <p className="text-[13px] text-gray-600 dark:text-gray-500 leading-relaxed flex-grow">
                {project.description}
              </p>
            </div>
            
            <div className={`text-xs font-mono mt-2 ${project.statusColor}`}>
              {project.status}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-2">
        <Link href="/projects" className="text-sm font-mono text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
          view all projects &rarr;
        </Link>
      </div>
    </div>
  );
}
