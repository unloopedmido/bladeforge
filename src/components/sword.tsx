import ShineBorder from "./ui/shine-border";
import Rarities from "@/data/rarities";
import { type Sword as SwordType } from "@prisma/client";
import { abbreviateNumber, rgbToAlpha } from "@/lib/func";
import { LinearGradient } from "react-text-gradients";
import { Fredoka } from "next/font/google";
import { cn } from "@/lib/utils";
import Materials from "@/data/materials";
import { CoinsIcon, SwordIcon } from "lucide-react";
import { getEnchantData, getSwordAura } from "@/data/common";
import Effects from "@/data/effects";

const CoolFont = Fredoka({
  subsets: ["latin"],
});

interface SwordProps {
  sword: SwordType;
  username: string;
}

function Content({ sword, username }: SwordProps) {
  return (
    <div
      className="relative flex h-[300px] w-[300px] flex-col p-3 sm:h-[350px] sm:w-[350px]"
      style={
        sword.effect
          ? {
              boxShadow: `0 0 10px 5px ${Effects.find((e) => e.name === sword.effect)?.color}`, // Keep the shadow effect
            }
          : {}
      }
    >
      {/* Background image div */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url('${getSwordAura(sword.aura!)}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.4, // Set image opacity here,
          WebkitBackgroundSize: "100%",
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
      <h1
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
          zIndex: 2, // Ensure text is above the gradient
          position: "relative", // Establish a new stacking context for text
        }}
        className={cn(
          "mx-auto flex text-2xl font-bold text-purple-500",
          CoolFont.className,
        )}
      >
        {username}&apos;s Sword
      </h1>
      <LinearGradient
        className={cn(
          "text-center text-4xl font-extrabold",
          CoolFont.className,
        )}
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
        className={cn(
          "mx-auto flex gap-x-2 text-2xl font-bold",
          CoolFont.className,
        )}
      >
        {sword.effect && (
          <p
            style={{
              textShadow: `2px 2px 4px ${sword.effect}`,
              zIndex: 2, // Ensure text is above the gradient
              position: "relative", // Establish a new stacking context for text
              color: Effects.find((e) => e.name === sword.effect)?.color,
            }}
            className={cn("text-2xl font-bold", CoolFont.className)}
          >
            {sword.effect}
          </p>
        )}
        {sword.quality}
      </h1>

      <div className="flex h-full items-end justify-between">
        <div className="flex flex-col text-start">
          {sword.enchants.map((enchant) => (
            <LinearGradient
              key={enchant}
              className={cn("text-2xl font-extrabold", CoolFont.className)}
              gradient={[
                "to right",
                rgbToAlpha(getEnchantData(enchant).color, 1).join(", "),
              ]}
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                zIndex: 2, // Ensure text is above the gradient
                position: "relative", // Establish a new stacking context for text
              }}
            >
              {enchant}
            </LinearGradient>
          ))}
        </div>

        <div className={"flex flex-col text-end"}>
          <LinearGradient
            className={cn("text-2xl font-extrabold", CoolFont.className)}
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
              "flex items-center justify-end gap-x-1 text-2xl font-bold text-yellow-500",
              CoolFont.className,
            )}
          >
            <CoinsIcon />
            {abbreviateNumber(sword.value)}
          </h1>
          <h1
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
              zIndex: 2, // Ensure text is above the gradient
              position: "relative", // Establish a new stacking context for text
            }}
            className={cn(
              "flex items-center justify-end gap-x-1 text-2xl font-bold text-red-500",
              CoolFont.className,
            )}
          >
            <SwordIcon />
            {abbreviateNumber(sword.damage)}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function Sword({ sword, username }: SwordProps) {
  return (
    <>
      {(Rarities.find((r) => r.name === sword.rarity)?.chance ?? 0) >= 336 ? (
        <ShineBorder
          className="h-[300px] w-[300px] sm:h-[350px] sm:w-[350px]"
          borderWidth={5}
          duration={14}
          color={rgbToAlpha(
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            Rarities.find((r) => r.name === sword.rarity)?.color!,
            1,
          )}
        >
          <Content username={username} sword={sword} />
        </ShineBorder>
      ) : (
        <Content username={username} sword={sword} />
      )}
    </>
  );
}
