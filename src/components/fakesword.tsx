import { cn } from "@/lib/utils";
import { Fredoka } from "next/font/google";

const CoolFont = Fredoka({
  subsets: ["latin"],
});

export default function FakeSword() {
  return (
    <div className="flex h-[300px] w-[300px] items-center justify-center bg-foreground/20 text-center p-3" style={{
        border: "5px solid #d8b4fe"
    }}>
      <h1
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          zIndex: 2, // Ensure text is above the gradient
          position: "relative", // Establish a new stacking context for text
        }}
        className={cn("text-xl font-bold text-purple-300", CoolFont.className)}
      >
        Generate or equip a sword to get started!
      </h1>
    </div>
  );
}
