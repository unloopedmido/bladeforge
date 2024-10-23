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
import type { Sword, User } from "@prisma/client";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getEnchantData } from "@/data/common";
import { LoaderCircle, Redo } from "lucide-react";
import { rgba } from "@/lib/func";

const EnchantDisplay = ({ enchantName }: { enchantName: string }) => {
  const enchant = getEnchantData(enchantName);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-4 shadow-2xl"
      style={{
        background: rgba(enchant.rarity.color, 0.3),
      }}
    >
      {/* Enchant Rarity */}
      <p
        className="text-sm font-bold uppercase tracking-wide"
        style={{
          color: rgba(enchant.rarity.color, 1),
        }}
      >
        {enchant.rarity.name}
      </p>

      {/* Enchant Name */}
      <p className="mb-2 text-lg font-semibold">{enchant.name}</p>

      {/* Enchant Properties */}
      <div className="flex flex-col space-y-1 text-center text-sm">
        {enchant.damageMultiplier > 0 && (
          <p className="font-medium">
            {enchant.damageMultiplier}x{" "}
            <span className="text-red-500">Damage</span>
          </p>
        )}
        {enchant.luckMultiplier > 0 && (
          <p className="font-medium">
            {enchant.luckMultiplier}x{" "}
            <span className="text-green-500">Luck</span>
          </p>
        )}
        {enchant.valueMultiplier > 0 && (
          <p className="font-medium">
            {enchant.valueMultiplier}x{" "}
            <span className="text-yellow-500">Value</span>
          </p>
        )}
        {enchant.experienceMultiplier > 0 && (
          <p className="font-medium">
            {enchant.experienceMultiplier}x{" "}
            <span className="text-purple-500">XP</span>
          </p>
        )}
      </div>
    </div>
  );
};

const RerollModal = ({
  setSword,
  setUser,
  sword,
  essenceLeft,
}: {
  setSword: Dispatch<SetStateAction<Sword | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  sword: Sword | null;
  essenceLeft: number;
}) => {
  const { mutate: rerollEnchants, isPending: isRerollingEnchants } =
    api.sword.rerollEnchants.useMutation({
      onSuccess: (data) => {
        setSword(data);
        setUser((prevUser: User | null) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            essence: (prevUser.essence ?? 1) - 1,
            sacrificesResetAt: new Date(Date.now() + 60 * 60 * 1000),
          };
        });
        toast.success("Enchants rerolled successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleRerollEnchants = () => sword && rerollEnchants();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={!sword || essenceLeft === 0 || sword.enchants.length === 0}>
          <Redo className="mr-2 h-4 w-4" />
          Reroll Enchants ({essenceLeft})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2 text-2xl">
            <Redo className="h-6 w-6 text-primary" /> Reroll Enchants
          </DialogTitle>
          <DialogDescription className="text-base">
            Reroll the enchants on your sword. You have{" "}
            <strong>{essenceLeft}</strong> essence left.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <h2 className="mb-3 text-lg font-bold">Current Enchants</h2>
          <div className="grid grid-cols-2 gap-3">
            {sword?.enchants.map((enchant, index) => (
              <EnchantDisplay key={index} enchantName={enchant} />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleRerollEnchants}
            disabled={essenceLeft === 0 || isRerollingEnchants}
          >
            {isRerollingEnchants ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Rerolling...
              </div>
            ) : (
              <>
                Reroll Enchants
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RerollModal;
