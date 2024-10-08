import ShineBorder from "./ui/shine-border";
import Rarities from "@/data/rarities";
import { type Sword as SwordType } from "@prisma/client";
import { abbreviateNumber, rgbToAlpha } from "@/lib/func";
import { LinearGradient } from "react-text-gradients";
import { Fredoka } from "next/font/google";
import { cn } from "@/lib/utils";
import Materials from "@/data/materials";
import { DollarSign, SwordIcon } from "lucide-react";

const CoolFont = Fredoka({
  subsets: ["latin"],
});

interface SwordProps {
  sword: SwordType;
}

function Content({ sword }: SwordProps) {
  return (
    <div className="relative h-[300px] w-[300px] p-3" style={sword.shiny ? {
      boxShadow: "0 0 10px 5px rgba(255, 255, 0, 0.3)",
    } : {}}>
      {/* Background image div */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url('https://www.medievalware.com/wp-content/uploads/2021/07/larp-bastard-sword-2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.5, // Set image opacity here,
          WebkitBackgroundSize: "80%",
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          zIndex: 1, // Image above the gradient
        }}
      />
      {/* Gradient overlay div */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          background: `linear-gradient(45deg, ${rgbToAlpha(Rarities.find((r) => r.name === sword.rarity)?.color!, 0.5).join(", ")})`,
          zIndex: 0, // Gradient below the image
        }}
      />
      {/* Text content */}
      <h1
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          zIndex: 2, // Ensure text is above the gradient
          position: "relative", // Establish a new stacking context for text
        }}
        className={cn("text-2xl font-bold text-purple-300", CoolFont.className)}
      >
        Your Sword
      </h1>
      <LinearGradient
        className={cn("text-4xl font-extrabold", CoolFont.className)}
        gradient={[
          "to right",
          rgbToAlpha(
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            Rarities.find((r) => r.name === sword.rarity)?.color!,
            1,
          ).join(", "),
        ]}
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          zIndex: 2, // Ensure text is above the gradient
          position: "relative", // Establish a new stacking context for text
        }}
      >
        {sword.rarity}
      </LinearGradient>
      <h1
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          zIndex: 2, // Ensure text is above the gradient
          position: "relative", // Establish a new stacking context for text
        }}
        className={cn("text-2xl font-bold", CoolFont.className)}
      >
        {sword.quality}
      </h1>
      <div className="mt-16 flex flex-col text-end">
        <LinearGradient
          className={cn("text-4xl font-extrabold", CoolFont.className)}
          gradient={[
            "to right",
            rgbToAlpha(
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              Materials.find((r) => r.name === sword.material)?.color!,
              1,
            ).join(", "),
          ]}
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
            zIndex: 2, // Ensure text is above the gradient
            position: "relative", // Establish a new stacking context for text
          }}
        >
          {sword.material}
        </LinearGradient>
        <h1
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
            zIndex: 2, // Ensure text is above the gradient
            position: "relative", // Establish a new stacking context for text
          }}
          className={cn(
            "flex items-center justify-end text-2xl font-bold text-green-500",
            CoolFont.className,
          )}
        >
          <DollarSign />
          {abbreviateNumber(Number(sword.value))}
        </h1>
        <h1
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
            zIndex: 2, // Ensure text is above the gradient
            position: "relative", // Establish a new stacking context for text
          }}
          className={cn(
            "flex items-center justify-end text-2xl font-bold text-red-500",
            CoolFont.className,
          )}
        >
          <SwordIcon />
          {abbreviateNumber(Number(sword.damage))}
        </h1>
      </div>
    </div>
  );
}

export default function Sword({ sword }: SwordProps) {
  return (
    <>
      {(Rarities.find((r) => r.name === sword.rarity)?.chance ?? 0) >= 336 ? (
        <ShineBorder
          borderWidth={5}
          duration={14}
          color={rgbToAlpha(
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            Rarities.find((r) => r.name === sword.rarity)?.color!,
            1,
          )}
        >
          <Content sword={sword} />
        </ShineBorder>
      ) : (
        <Content sword={sword} />
      )}
    </>
  );
}
