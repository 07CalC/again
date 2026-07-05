import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NowPlaying from "@/components/NowPlaying";
import CurrentStatus from "@/components/CurrentStatus";
import FeaturedProjects from "@/components/FeaturedProjects";
import RecentWriting from "@/components/RecentWriting";
export default function Home() {
  return (
    <main className="min-h-screen max-w-[1200px] mx-auto px-8 pb-24 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
        <div className="lg:w-1/2 flex items-center justify-start">
          <Hero />
        </div>
        <div className="lg:w-1/2 flex items-center justify-end">
          <NowPlaying />
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-3">
          <CurrentStatus />
        </div>

        <div className="lg:col-span-6">
          <FeaturedProjects />
        </div>

        <div className="lg:col-span-3 flex lg:justify-end">
          <RecentWriting />
        </div>
      </div>

    </main>
  );
}
