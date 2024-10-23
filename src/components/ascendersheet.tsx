import type { Sword as SwordType } from "@prisma/client";
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
import { ArrowUp, Hammer, LoaderCircle, Shield, Sparkles } from "lucide-react";
import type { ClientUserType } from "@/data/common";

interface AscenderSheetProps {
  sword: SwordType | null;
  setSword: (sword: SwordType | null) => void;
  user: ClientUserType | null;
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
        `Successfully ascended to ${property.name} with chance 1/${abbreviateNumber(String(luck))}`,
      );
      setSword(data.sword);
      setCooldown(user?.vip ? 500 : 1000);
    },
    onError: (error) => {
      toast.error(error.message);
      setCooldown(user?.vip ? 500 : 1000);
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
          <ArrowUp className="mr-2 h-4 w-4" />
          Ascend Sword
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2 text-2xl">
            <ArrowUp className="h-6 w-6 text-primary" />
            Sword Ascension
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose a property to upgrade and enhance your sword&apos;s value and power!
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <h2 className="mb-3 text-lg font-bold">Current Properties</h2>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Rarity</div>
                  <div className="text-sm text-muted-foreground">{sword?.rarity}</div>
                </div>
              </div>
              <Button
                variant={selectedProperty === "rarity" ? "secondary" : "outline"}
                onClick={() => setSelectedProperty("rarity")}
                className="ml-auto"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Quality</div>
                  <div className="text-sm text-muted-foreground">{sword?.quality}</div>
                </div>
              </div>
              <Button
                variant={selectedProperty === "quality" ? "secondary" : "outline"}
                onClick={() => setSelectedProperty("quality")}
                className="ml-auto"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Hammer className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="font-medium">Material</div>
                  <div className="text-sm text-muted-foreground">{sword?.material}</div>
                </div>
              </div>
              <Button
                variant={selectedProperty === "material" ? "secondary" : "outline"}
                onClick={() => setSelectedProperty("material")}
                className="ml-auto"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => handleAscend()}
            disabled={cooldown > 0 || isPending || !selectedProperty}
          >
            {cooldown > 0 ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4" />
                Cooldown: {(cooldown / 1000).toFixed(1)}s
              </div>
            ) : isPending ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Ascending...
              </div>
            ) : (
              <>
                <ArrowUp className="mr-2 h-4 w-4" />
                {selectedProperty ? `Ascend ${selectedProperty}` : 'Select Property'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
