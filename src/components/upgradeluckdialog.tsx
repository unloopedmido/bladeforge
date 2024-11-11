import {
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Clover, CoinsIcon, LoaderCircle } from "lucide-react";
import { abbreviateNumber } from "@/lib/func";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { type ClientUserType } from "@/data/common";
import { ActionButton } from "@/pages/forge";

// Constants
const DIFFICULTY_MULTIPLIER = 1.18;
const BASE_COST = 95;

interface UpgradeLuckDialogProps {
  user: ClientUserType | null;
  setUser: Dispatch<SetStateAction<ClientUserType | null>>;
}

export default function UpgradeLuckDialog({
  user,
  setUser,
}: UpgradeLuckDialogProps) {
  const [luckIncrement, setLuckIncrement] = useState<number>(1);

  // Derived state
  const currentLuck = Number(user?.luck ?? 0);
  const currentMoney = Number(user?.money ?? 0);

  // Utility functions
  const calculateUpgradeCost = useCallback(
    (currentLuck: number, increment: number) => {
      let totalCost = 0;
      for (let i = 0; i < increment; i++) {
        const incrementCost = Math.round(
          BASE_COST * Math.pow(DIFFICULTY_MULTIPLIER, currentLuck + i),
        );
        totalCost += incrementCost;
      }
      return totalCost;
    },
    [],
  );

  const calculateMaxAffordableLuck = useCallback(() => {
    let maxLuck = 0;

    for (let i = 1; ; i++) {
      const nextCost = calculateUpgradeCost(currentLuck, i);
      if (nextCost > currentMoney) break;
      maxLuck = i;
    }

    return maxLuck;
  }, [currentLuck, currentMoney, calculateUpgradeCost]);

  // API mutation
  const { mutate: upgradeLuck, isPending } = api.user.upgradeLuck.useMutation({
    onSuccess: (data) => {
      toast.success("Luck upgraded successfully");
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          luck: data.user.luck,
          money: data.user.money,
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Event handlers
  const handleMaxLuck = useCallback(() => {
    const maxLuck = calculateMaxAffordableLuck();
    setLuckIncrement(maxLuck);
  }, [calculateMaxAffordableLuck]);

  const handleUpgradeLuck = useCallback(() => {
    upgradeLuck(luckIncrement);
  }, [luckIncrement, upgradeLuck]);

  // Computed values
  const moneyRequired = calculateUpgradeCost(currentLuck, luckIncrement);
  const maxAffordableLuck = calculateMaxAffordableLuck();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionButton
          disabled={isPending}
          icon={Clover}
          label="Purchase Luck"
          variant="outline"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2 text-2xl">
            <Clover className="h-6 w-6 text-green-500" />
            Upgrade Luck
          </DialogTitle>
          <DialogDescription className="text-base">
            Increase your luck to improve chances for better sword properties!
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <h2 className="mb-3 text-lg font-bold">Upgrade Amount</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter luck amount"
                  value={luckIncrement}
                  max={100}
                  min={1}
                  onChange={(e) =>
                    setLuckIncrement(Math.min(Number(e.target.value), 100))
                  }
                  className="text-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleMaxLuck}
                disabled={maxAffordableLuck === 0}
                className="whitespace-nowrap"
              >
                Max ({maxAffordableLuck})
              </Button>
            </div>

            {moneyRequired > 0 && (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center">
                  <CoinsIcon className="mr-2 h-5 w-5 text-yellow-500" />
                  <span className="text-muted-foreground">Cost</span>
                </div>
                <div className="text-lg font-semibold">
                  ${abbreviateNumber(String(moneyRequired))}
                </div>
              </div>
            )}

            {luckIncrement > 0 && (
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Clover className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">New Luck</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{currentLuck}</span>
                  <ArrowRight className="h-4 w-4" />
                  <span className="text-lg font-semibold">
                    {currentLuck + luckIncrement}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            className="w-full"
            onClick={handleUpgradeLuck}
            disabled={
              currentMoney < moneyRequired || isPending || luckIncrement === 0
            }
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Upgrading...
              </div>
            ) : (
              <>
                <Clover className="mr-2 h-4 w-4" />
                Upgrade Luck
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
