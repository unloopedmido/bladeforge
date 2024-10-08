import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { type Sword as SwordType, type User as UserType } from "@prisma/client";
import { toast } from "sonner";
import UpgradeLuckDialog from "./upgradeluckdialog";
import AscenderSheet from "./ascendersheet";
import { useEffect, useState } from "react";

interface ActionButtonsProps {
  sword: SwordType | null;
  setSword: (sword: SwordType | null) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export default function ActionButtons({
  sword,
  setSword,
  user,
  setUser,
}: ActionButtonsProps) {
  const [cooldown, setCooldown] = useState<number>(0);
  const { mutate: sellSword, isPending: isSelling } =
    api.sword.sellSword.useMutation({
      onSuccess: () => {
        setSword(null);
        toast.success("Sword sold successfully");
        if (user)
          setUser({
            ...user,
            money: BigInt(user.money) + BigInt(sword?.value ?? 0),
          });
      },
    });

  const { mutate: generateSword, isPending: isGenerating } =
    api.sword.generateSword.useMutation({
      onSuccess: (data) => {
        setSword(data.sword);
        setCooldown(user?.vip ? 2000 : 4000);
        toast.info(data.message);
      },
    });

  const { mutate: unequipSword, isPending: isStoring } =
    api.sword.unequipSword.useMutation({
      onSuccess: (data) => {
        if (data.message.includes("You can only have up to")) {
          return toast.error(data.message);
        } else {
          setSword(null);
          toast.info("Sword stored successfully");
        }
      },
    });

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => prev - 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleSellSword = () => sword && sellSword(sword.id);
  const handleGenerateSword = () => !sword && generateSword();
  const handleUnequipSword = () => sword && unequipSword();

  return (
    <div className="mt-8 flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Button
          onClick={handleGenerateSword}
          disabled={!!sword || isGenerating || cooldown > 0}
        >
          {isGenerating
            ? "Generating..."
            : sword
              ? "Generate Sword"
              : cooldown > 0
                ? `Cooldown: ${cooldown / 1000}s`
                : "Generate Sword"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleSellSword}
          disabled={!sword || isSelling || isStoring}
        >
          {isSelling ? "Selling..." : "Sell Sword"}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Button
          variant="secondary"
          onClick={handleUnequipSword}
          disabled={!sword || isStoring || isSelling}
        >
          {isStoring ? "Storing..." : "Store Sword"}
        </Button>
        <AscenderSheet disabled={isSelling || isStoring} sword={sword} user={user} setSword={setSword} />
      </div>
      <UpgradeLuckDialog user={user} setUser={setUser} />
    </div>
  );
}
