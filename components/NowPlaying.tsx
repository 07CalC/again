import { PlayCircle } from "lucide-react";

export default function NowPlaying() {
  return (
    <div className="bg-[#0f1115] border border-white/5 rounded-2xl p-6 w-72 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden group">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

      {/* Record Graphic */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Vinyl outer */}
        <div className="w-48 h-48 rounded-full bg-[#111] shadow-xl border border-white/10 flex items-center justify-center animate-[spin_4s_linear_infinite]">
          {/* Vinyl inner grooves */}
          <div className="w-40 h-40 rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center">
              {/* Record Label - Pink Floyd Triangle placeholder */}
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden">
                 <div className="w-8 h-8 border-[1px] border-white/40 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tonearm */}
        <div className="absolute -top-4 right-2 w-2 h-24 bg-zinc-400 rounded-full transform rotate-[30deg] origin-top flex flex-col items-center shadow-lg">
          <div className="w-6 h-6 rounded-full bg-zinc-300 absolute -top-2 shadow-inner border border-zinc-400"></div>
          <div className="w-3 h-8 bg-zinc-500 rounded-sm absolute bottom-0 transform rotate-[15deg] translate-x-1 border border-zinc-600"></div>
        </div>
      </div>

      <div className="w-full text-left space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-mono text-green-400 tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          NOW PLAYING
        </div>
        <h3 className="text-white font-medium">Time</h3>
        <p className="text-xs text-gray-500">Pink Floyd</p>
      </div>

      {/* Progress bar */}
      <div className="w-full mt-4">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="w-1/4 h-full bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-gray-500">
          <span>1:23</span>
          <span>6:53</span>
        </div>
      </div>

    </div>
  );
}
