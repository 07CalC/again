import Hero from "@/components/Hero";
import NowPlaying from "@/components/NowPlaying";
import Heatmap from "@/components/Heatmap";
import ProjectsSection from "@/components/sections/ProjectsSection";
import WritingsSection from "@/components/sections/WritingsSection";

export default function Home() {
  return (
    <main className="min-h-screen max-w-[1200px] mx-auto px-8 pb-24 pt-20 flex flex-col font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="lg:w-1/2 flex items-center justify-start">
          <Hero />
        </div>
        <div className="lg:w-1/2 flex items-center justify-end">
          <NowPlaying />
        </div>
      </div>

      <div className="mt-32">
        <WritingsSection limit={3} />
      </div>
      <div className="mt-32">
        <ProjectsSection limit={3} />
      </div>
      <div className="mt-32">
        <Heatmap />
      </div>
    </main>
  );
}
