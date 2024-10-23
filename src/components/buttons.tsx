import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { type Sword as SwordType, } from "@prisma/client";
import { toast } from "sonner";
import UpgradeLuckDialog from "./upgradeluckdialog";
import AscenderSheet from "./ascendersheet";
import { useEffect, useState } from "react";
import { Hammer, Handshake, Save } from "lucide-react";
import RerollModal from "./enchants";
import SacrificeModal from "./sacrifice";

import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "./ui/card";
import type { ClientUserType } from "@/data/common";

interface ActionButtonsProps {
  sword: SwordType | null;
  setSword: Dispatch<SetStateAction<SwordType | null>>;
  user: ClientUserType | null;
  setUser: Dispatch<SetStateAction<ClientUserType | null>>;
}

export default function ActionButtons({
  sword,
  setSword,
  user,
  setUser,
}: ActionButtonsProps) {
  const [cooldown, setCooldown] = useState<number>(0);
  const [sellCooldown, setSellCooldown] = useState<number>(0);

  const { mutate: sellSword, isPending: isSelling } =
    api.sword.sellSword.useMutation({
      onSuccess: (data) => {
        setSword(null);
        setSellCooldown(user?.vip ? 1000 : 2000);
        toast.success("Sword sold successfully");
        if (user)
          setUser({
            ...user,
            money: data.money,
            experience: data.experience,
          });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: generateSword, isPending: isGenerating } =
    api.sword.generateSword.useMutation({
      onSuccess: (data) => {
        setSword(data);
        setCooldown(user?.vip ? 1000 : 2000);
        toast.info("Sword generated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: unequipSword, isPending: isStoring } =
    api.sword.unequipSword.useMutation({
      onSuccess: (data) => {
        setSword(null);
        toast.info(`Sword stored successfully, ${data} slots remaining`);
      },
      onError: (error) => {
        toast.error(error.message);
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

  useEffect(() => {
    if (sellCooldown > 0) {
      const interval = setInterval(() => {
        setSellCooldown((prev) => prev - 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sellCooldown]);

  const handleSellSword = () => sword && sellSword(sword.id);
  const handleGenerateSword = () => !sword && generateSword();
  const handleUnequipSword = () => sword && unequipSword();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-2 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Button
            onClick={handleGenerateSword}
            disabled={
              !!sword || isGenerating || cooldown > 0 || isSelling || isStoring
            }
          >
            <Hammer className="mr-2 h-4 w-4" />
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
            disabled={
              !sword ||
              isSelling ||
              isStoring ||
              sellCooldown > 0 ||
              isGenerating
            }
          >
            <Handshake className="mr-2 h-4 w-4" />
            {isSelling ? "Selling..." : "Sell Sword"}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Button
            variant="secondary"
            onClick={handleUnequipSword}
            disabled={!sword || isStoring || isSelling || isGenerating}
          >
            <Save className="mr-2 h-4 w-4" />
            {isStoring ? "Storing..." : "Store Sword"}
          </Button>
          <AscenderSheet
            disabled={
              isSelling || isStoring || isGenerating || sellCooldown > 0
            }
            sword={sword}
            user={user}
            setSword={setSword}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <RerollModal
            setSword={setSword}
            setUser={setUser}
            sword={sword}
            essenceLeft={user?.essence ?? 0}
          />
          <SacrificeModal setSword={setSword} setUser={setUser} sword={sword} />
        </div>
        <UpgradeLuckDialog user={user} setUser={setUser} />
      </CardContent>
    </Card>
  );
}
