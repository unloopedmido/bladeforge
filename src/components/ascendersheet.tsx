import type { Sword as SwordType, User as UserType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";

interface AscenderSheetProps {
  sword: SwordType | null;
  setSword: (sword: SwordType | null) => void;
  user: UserType | null;
}

export default function AscenderSheet({
  sword,
  setSword,
  user,
}: AscenderSheetProps) {
  const [cooldown, setCooldown] = useState<number>(0);
  const { mutate: ascend } = api.sword.ascend.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setSword(data.sword);
      setCooldown(user?.vip ? 1000 : 2000);
    },
    onError: (error) => {
      toast.error(error.message);
      setCooldown(user?.vip ? 1000 : 2000);
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!sword} variant="secondary">
          Ascend Sword
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            🗡 Sword Ascender
          </DialogTitle>
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
              onClick={() => ascend("rarity")}
              disabled={cooldown > 0}
              className="w-full"
            >
              Upgrade Rarity
            </Button>
            <Button
              onClick={() => ascend("quality")}
              disabled={cooldown > 0}
              className="w-full"
            >
              Upgrade Quality
            </Button>
            <Button
              onClick={() => ascend("material")}
              disabled={cooldown > 0}
              className="w-full"
            >
              Upgrade Material
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
