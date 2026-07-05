import Link from "next/link";

export default function RecentWriting() {
  const posts = [
    {
      title: "Why I switched to Cloudflare Workers",
      date: "Jul 2"
    },
    {
      title: "Building email infrastructure is harder than I thought",
      date: "Jun 24"
    },
    {
      title: "My Arch Linux setup after one year",
      date: "Jun 10"
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <h2 className="text-blue-400 font-mono text-sm mb-2">/ recent writing</h2>
      
      <div className="flex flex-col gap-6">
        {posts.map((post, i) => (
          <Link href="#" key={i} className="group flex justify-between items-start gap-4 cursor-pointer">
            <h3 className="text-sm text-gray-300 leading-snug group-hover:text-white transition-colors">
              {post.title}
            </h3>
            <span className="text-xs font-mono text-gray-500 whitespace-nowrap mt-0.5">
              {post.date}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4">
        <Link href="/writing" className="text-sm font-mono text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          view all writing &rarr;
        </Link>
      </div>
    </div>
  );
}
