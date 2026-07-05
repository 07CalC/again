import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-md text-center flex flex-col items-center gap-8">
        <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] p-8 md:p-10 backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 font-serif font-normal tracking-tight">
              either you are lost
            </p>
            <p className="text-2xl sm:text-3xl text-gray-500 dark:text-gray-400 font-mono">
              or i am too lazy to implement this section
            </p>
          </div>

          <div className="my-6 text-2xl font-serif text-gray-300 dark:text-gray-600">
            ~
          </div>

          <Link
            href="/"
            className="text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
