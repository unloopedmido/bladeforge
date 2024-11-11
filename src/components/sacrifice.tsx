import type { Sword } from "@prisma/client";
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
import { api } from "@/utils/api";
import { toast } from "sonner";
import { type Dispatch, type SetStateAction } from "react";
import { LoaderCircle, Skull, Sparkles, Star } from "lucide-react";
import { abbreviateNumber } from "@/lib/func";
import type { ClientUserType } from "@/data/common";
import { ActionButton } from "@/pages/forge";

const SacrificeModal = ({
  setSword,
  setUser,
  sword,
}: {
  setSword: Dispatch<SetStateAction<Sword | null>>;
  setUser: Dispatch<SetStateAction<ClientUserType | null>>;
  sword: Sword | null;
}) => {
  const { mutate: sacrificeSword, isPending: isSacrificing } =
    api.sword.sacrificeSword.useMutation({
      onSuccess: (data) => {
        setSword(null);
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            essence: data.essence,
            experience: data.experience,
          };
        });
        toast.success("Sword sacrificed successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleSacrificeSword = () => sword && sacrificeSword();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionButton
          icon={Skull}
          label="Sacrifice Sword"
          variant="outline"
          disabled={!sword}
          loading={isSacrificing}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2 text-2xl">
            <Skull className="h-6 w-6 text-destructive" />
            Sacrifice Sword
          </DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to sacrifice this sword? You&apos;ll receive
            the following rewards:
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <h2 className="mb-3 text-lg font-bold">Rewards</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center rounded-lg border p-4">
              <Sparkles className="mr-3 h-6 w-6 text-blue-500" />
              <div>
                <div className="font-semibold">Essence</div>
                <div className="text-sm text-muted-foreground">
                  + {sword?.essence}
                </div>
              </div>
            </div>

            <div className="flex items-center rounded-lg border p-4">
              <Star className="mr-3 h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold">Experience</div>
                <div className="text-sm text-muted-foreground">
                  +{abbreviateNumber(sword?.experience ?? "1")} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {sword && (
          <div className="my-4">
            <h2 className="mb-3 text-lg font-bold">Sword Details</h2>
            <div className="rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Material:</div>
                <div className="font-medium">{sword.material}</div>
                <div className="text-muted-foreground">Rarity:</div>
                <div className="font-medium">{sword.rarity}</div>
                <div className="text-muted-foreground">Quality:</div>
                <div className="font-medium">{sword.quality}</div>
                {sword.aura && (
                  <>
                    <div className="text-muted-foreground">Aura:</div>
                    <div className="font-medium">{sword.aura}</div>
                  </>
                )}
                {sword.effect && (
                  <>
                    <div className="text-muted-foreground">Effect:</div>
                    <div className="font-medium">{sword.effect}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSacrificeSword}
              disabled={isSacrificing}
            >
              {isSacrificing ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Sacrificing...
                </div>
              ) : (
                <>
                  <Skull className="mr-2 h-4 w-4" />
                  Confirm Sacrifice
                </>
              )}
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SacrificeModal;
