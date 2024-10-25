import { Fredoka } from "next/font/google";

const CoolFont = Fredoka({
  subsets: ["latin"],
});

export default function FakeSword() {
  return (
    <div className="group relative sm:h-[350px] sm:w-[350px] h-[300px] w-[300px] overflow-hidden rounded-xl border border-purple-500/20 bg-black/40 transition-all hover:bg-black/50">
      {/* Animated corner accents */}
      <div className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-purple-400/30" />
      <div className="absolute right-0 bottom-0 h-16 w-16 border-r-2 border-b-2 border-purple-400/30" />
      
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 h-32 w-full -translate-y-1/2 bg-purple-600/5 blur-3xl" />
      
      {/* Main content */}
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <div className={`${CoolFont.className} space-y-3 text-center`}>
          <p className="text-2xl font-bold text-purple-200">
            Your Luck Awaits!
          </p>
          <p className="text-sm text-purple-300/70">
            Ready to forge your sword?
          </p>
        </div>
        
        {/* Decorative sword icon using unicode */}
        <div className="mt-4 rotate-45 text-4xl text-purple-400/50 transition-all">
          ⚔️
        </div>
      </div>
      
      {/* Hover effect gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}