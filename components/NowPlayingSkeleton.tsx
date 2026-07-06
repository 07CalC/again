export default function NowPlayingSkeleton() {
  return (
    <div className="block w-full max-w-[360px] lg:w-[360px] rounded-[32px] border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-black/20 p-6 sm:p-8 backdrop-blur-xl animate-pulse">
      <div className="relative mx-auto h-[200px] w-[200px] sm:h-[240px] sm:w-[240px] md:h-[280px] md:w-[280px] rounded-full bg-gray-200/60 dark:bg-white/10" />
      <div className="mt-6 sm:mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-white/20" />
          <div className="h-3 w-24 rounded bg-gray-300 dark:bg-white/20" />
        </div>
        <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-white/20" />
        <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-white/20" />
      </div>
    </div>
  );
}
