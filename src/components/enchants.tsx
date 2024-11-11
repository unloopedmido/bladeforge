import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import type { Sword } from "@prisma/client";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { type ClientUserType, getEnchantData } from "@/data/common";
import { Loader, Redo, Sparkles } from "lucide-react";
import { rgba } from "@/lib/func";
import { ActionButton } from "@/pages/forge";

const EnchantDisplay = ({ enchantName }: { enchantName: string }) => {
  const enchant = getEnchantData(enchantName);

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case "Damage":
        return "⚔️";
      case "Luck":
        return "🍀";
      case "Value":
        return "💰";
      case "XP":
        return "⭐";
      default:
        return "";
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105">
      <div
        className="absolute inset-0 opacity-75 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${rgba(enchant.rarity.color, 0.2)}, ${rgba(enchant.rarity.color, 0.4)})`,
        }}
      />

      <div className="relative flex flex-col items-center p-4">
        <div
          className="mb-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: rgba(enchant.rarity.color, 0.2),
            color: rgba(enchant.rarity.color, 1),
          }}
        >
          {enchant.rarity.name}
        </div>

        <h3 className="mb-3 text-lg font-bold">{enchant.name}</h3>

        <div className="flex flex-col space-y-2 text-sm">
          {enchant.damageMultiplier > 0 && (
            <div className="flex items-center space-x-2 font-medium">
              <span>{getStatIcon("Damage")}</span>
              <span className="text-red-500">
                +{enchant.damageMultiplier}% Damage
              </span>
            </div>
          )}
          {enchant.luckMultiplier > 0 && (
            <div className="flex items-center space-x-2 font-medium">
              <span>{getStatIcon("Luck")}</span>
              <span className="text-green-500">
                +{enchant.luckMultiplier}% Luck
              </span>
            </div>
          )}
          {enchant.valueMultiplier > 0 && (
            <div className="flex items-center space-x-2 font-medium">
              <span>{getStatIcon("Value")}</span>
              <span className="text-yellow-500">
                +{enchant.valueMultiplier}% Value
              </span>
            </div>
          )}
          {enchant.experienceMultiplier > 0 && (
            <div className="flex items-center space-x-2 font-medium">
              <span>{getStatIcon("XP")}</span>
              <span className="text-purple-500">
                +{enchant.experienceMultiplier}% XP
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const RerollModal = ({
  setSword,
  setUser,
  sword,
  essenceLeft,
}: {
  setSword: Dispatch<SetStateAction<Sword | null>>;
  setUser: Dispatch<SetStateAction<ClientUserType | null>>;
  sword: Sword | null;
  essenceLeft: number;
}) => {
  const { mutate: rerollEnchants, isPending: isRerollingEnchants } =
    api.sword.rerollEnchants.useMutation({
      onSuccess: (data) => {
        setSword(data);
        setUser((prevUser: ClientUserType | null) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            essence: (prevUser.essence ?? 1) - 1,
            sacrificesResetAt: new Date(Date.now() + 60 * 60 * 1000),
          };
        });
        toast.success("✨ Enchants rerolled successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleRerollEnchants = () => sword && rerollEnchants();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionButton
          icon={Redo}
          label="Reroll Enchants"
          variant="outline"
          disabled={!sword}
          loading={isRerollingEnchants}
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-3 text-2xl">
            <Sparkles className="h-6 w-6" />
            Reroll Enchants
          </DialogTitle>
          <DialogDescription className="text-base">
            Transform your sword&apos;s enchantments with magical essence. You
            have{" "}
            <span className="font-bold text-purple-500">{essenceLeft}</span>{" "}
            essence remaining.
          </DialogDescription>
        </DialogHeader>

        <div className="my-6">
          <h2 className="mb-4 text-lg font-bold">Current Enchantments</h2>
          <div className="grid grid-cols-2 gap-4">
            {sword?.enchants.map((enchant, index) => (
              <EnchantDisplay key={index} enchantName={enchant} />
            ))}
          </div>
        </div>

        <DialogFooter>
          {isRerollingEnchants ? (
            <Button
              className="w-full"
              disabled={essenceLeft === 0 || isRerollingEnchants}
              loading
            >
              {
                [
                  "Channelling Magic...",
                  "Drawing Runes...",
                  "Casting Spells...",
                ][Math.floor(Math.random() * 3)]
              }
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={handleRerollEnchants}
              disabled={essenceLeft === 0 || isRerollingEnchants}
              icon={Sparkles}
            >
              <span>Reroll Enchantments</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RerollModal;
