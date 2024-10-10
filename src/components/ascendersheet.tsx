import type { Sword as SwordType, User as UserType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { abbreviateNumber } from "@/lib/func";

interface AscenderSheetProps {
  sword: SwordType | null;
  setSword: (sword: SwordType | null) => void;
  user: UserType | null;
  disabled: boolean;
}

export default function AscenderSheet({
  sword,
  setSword,
  user,
  disabled,
}: AscenderSheetProps) {
  const [cooldown, setCooldown] = useState<number>(0);
  const [selectedProperty, setSelectedProperty] = useState<
    "rarity" | "quality" | "material" | null
  >(null); // New state for selected property

  const { mutate: ascend, isPending } = api.sword.ascend.useMutation({
    onSuccess: (data) => {
      const { property, luck } = data;

      toast.success(
        `Successfully ascended to ${property.name} with chance 1/${abbreviateNumber(luck)}`,
      );
      setSword(data.sword);
      setCooldown(user?.vip ? 1000 : 1500);
    },
    onError: (error) => {
      toast.error(error.message);
      setCooldown(user?.vip ? 1000 : 1500);
    },
  });

  // Handle cooldown
  useEffect(() => {
    while (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown(cooldown - 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleAscend = () => {
    if (selectedProperty) {
      ascend(selectedProperty); // Trigger ascend with the selected property
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!sword || disabled} variant="secondary">
          Ascend Sword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sword Ascender</DialogTitle>
          <DialogDescription>
            Upgrade your sword&apos;s properties below to increase its value and
            damage!
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <h1 className="font-semibold">Rarity</h1>
              <p className="text-foreground/60">
                Current: <strong>{sword?.rarity}</strong>
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="font-semibold">Quality</h1>
              <p className="text-foreground/60">
                Current: <strong>{sword?.quality}</strong>
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="font-semibold">Material</h1>
              <p className="text-foreground/60">
                Current: <strong>{sword?.material}</strong>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-7">
            <Button
              variant={selectedProperty === "rarity" ? "secondary" : "default"}
              onClick={() => setSelectedProperty("rarity")}
              className={`w-full`}
            >
              Upgrade Rarity
            </Button>
            <Button
              variant={selectedProperty === "quality" ? "secondary" : "default"}
              onClick={() => setSelectedProperty("quality")}
              className={`w-full`}
            >
              Upgrade Quality
            </Button>
            <Button
              variant={
                selectedProperty === "material" ? "secondary" : "default"
              }
              onClick={() => setSelectedProperty("material")}
              className={`w-full`}
            >
              Upgrade Material
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => handleAscend()}
            disabled={cooldown > 0 || isPending || !selectedProperty}
            className="w-full capitalize"
          >
            {cooldown > 0
              ? `Cooldown: ${cooldown / 1000}s`
              : isPending
                ? "Ascending..."
                : `Ascend ${selectedProperty}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
