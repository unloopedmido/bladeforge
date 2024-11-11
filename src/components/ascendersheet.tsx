import type { Sword as SwordType } from "@prisma/client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { abbreviateNumber } from "@/lib/func";
import { ArrowUp, Hammer, Shield, Sparkles } from "lucide-react";
import type { ClientUserType } from "@/data/common";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ActionButton } from "@/pages/forge";

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
  >(null);

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
      ascend(selectedProperty);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
      <ActionButton
          icon={ArrowUp}
          label="Ascend Sword"
          variant="outline"
          disabled={!sword}
          loading={isPending}
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ascend Sword</SheetTitle>
          <SheetDescription>
            Choose a property to upgrade and enhance your sword&apos;s value and power.
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-sm font-medium">Select Property</Label>
            <RadioGroup
              value={selectedProperty ?? ""}
              onValueChange={(value: string) => 
                setSelectedProperty(value as "rarity" | "quality" | "material" | null)
              }
            >
              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <RadioGroupItem value="rarity" id="rarity" />
                <Label htmlFor="rarity" className="flex flex-1 items-center gap-3">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">Rarity</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {sword?.rarity}
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <RadioGroupItem value="quality" id="quality" />
                <Label htmlFor="quality" className="flex flex-1 items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Quality</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {sword?.quality}
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 rounded-lg border p-4">
                <RadioGroupItem value="material" id="material" />
                <Label htmlFor="material" className="flex flex-1 items-center gap-3">
                  <Hammer className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Material</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {sword?.material}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <SheetFooter>
          {isPending && (
            <Button disabled loading>Ascending...</Button>
          )}
          {cooldown > 0 && (
            <Button disabled loading>
              Cooldown: {(cooldown / 1000).toFixed(1)}s
            </Button>
          )}
          {!isPending && cooldown <= 0 && (
            <Button
              onClick={handleAscend}
              disabled={!selectedProperty}
              icon={ArrowUp}
            >
              {selectedProperty ? `Ascend ${selectedProperty}` : "Select Property"}
            </Button>
          )}
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}