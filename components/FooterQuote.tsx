export default function FooterQuote() {
  return (
    <div className="border border-white/5 bg-[#0a0a0a]/50 rounded-xl p-6 mt-16 flex items-start gap-4 max-w-2xl">
      <div className="text-blue-500 font-serif text-3xl leading-none mt-1">
        &ldquo;
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-300 text-sm font-medium font-mono">
          Building things slowly is still building.
        </p>
        <p className="text-xs text-gray-500 font-mono">
          - a thought from <span className="text-blue-400">Jul 5, 2026</span>
        </p>
      </div>
    </div>
  );
}
