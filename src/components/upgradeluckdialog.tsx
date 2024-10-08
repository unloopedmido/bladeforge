import { useState, useCallback, useEffect } from "react";
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
import { Clover, CoinsIcon } from "lucide-react";
import { type User as UserType } from "@prisma/client";
import { abbreviateNumber } from "@/lib/func";
import { api } from "@/utils/api";
import { toast } from "sonner";

// Constants
const DIFFICULTY_MULTIPLIER = 1.18;
const BASE_COST = 95;

interface UpgradeLuckDialogProps {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export default function UpgradeLuckDialog({
  user,
  setUser,
}: UpgradeLuckDialogProps) {
  const [luckIncrement, setLuckIncrement] = useState<number>(1);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(
    null,
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      if (data.success) {
        toast.success("Luck upgraded successfully");
        setUser(data.user);
        setCooldownRemaining(null); // Reset cooldown after success
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      const remainingTimeMatch = /(\d+)/.exec(error.message); // Match the number in the message
      const remainingTime = remainingTimeMatch
        ? parseInt(remainingTimeMatch[0])
        : null;

      if (remainingTime) {
        toast.error(
          `Please wait ${remainingTime} seconds before upgrading again.`,
        );
        setCooldownRemaining(remainingTime); // Set cooldown time from message
      } else {
        toast.error("An error occurred while upgrading luck.");
      }
    },
  });

  // Handle cooldown countdown
  useEffect(() => {
    if (cooldownRemaining !== null) {
      setIsButtonDisabled(true); // Disable button when in cooldown
      const interval = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev && prev > 1) return prev - 1;
          clearInterval(interval);
          setIsButtonDisabled(false); // Re-enable button when cooldown is over
          return null;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cooldownRemaining]);

  // Event handlers
  const handleMaxLuck = useCallback(() => {
    const maxLuck = calculateMaxAffordableLuck();
    setLuckIncrement(maxLuck);
  }, [calculateMaxAffordableLuck]);

  const handleUpgradeLuck = useCallback(() => {
    if (!isButtonDisabled) {
      upgradeLuck(luckIncrement);
    }
  }, [luckIncrement, upgradeLuck, isButtonDisabled]);

  // Computed values
  const moneyRequired = calculateUpgradeCost(currentLuck, luckIncrement);
  const maxAffordableLuck = calculateMaxAffordableLuck();

  useEffect(() => {
    console.log('currentMoney:', currentMoney);
    console.log('moneyRequired:', moneyRequired);
    console.log('isButtonDisabled:', isButtonDisabled);
    console.log('isPending:', isPending);
    console.log('luckIncrement:', luckIncrement);
  }, [currentMoney, moneyRequired, isButtonDisabled, isPending, luckIncrement]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Upgrade Luck</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Luck</DialogTitle>
          <DialogDescription>
            Purchase more luck to improve your chances for better sword
            properties!
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-x-10">
          <StatusDisplay
            label="Current Luck"
            value={currentLuck}
            icon={<Clover />}
            colorClass="text-green-500"
          />
          <StatusDisplay
            label="Current Money"
            value={currentMoney}
            icon={<CoinsIcon />}
            colorClass="text-yellow-500"
          />
        </div>

        <Input
          type="number"
          placeholder="Luck Amount"
          value={luckIncrement}
          max={100}
          min={1}
          onChange={(e) =>
            setLuckIncrement(
              Math.min(Number(e.target.value), 100),
            )
          }
        />

        {moneyRequired > 0 && (
          <p className="text-sm text-gray-500">
            Cost: ${abbreviateNumber(moneyRequired)}
          </p>
        )}

        <DialogFooter>
          <Button
            onClick={handleUpgradeLuck}
            disabled={
              currentMoney < moneyRequired ||
              isButtonDisabled ||
              isPending ||
              luckIncrement === 0
            }
          >
            {isPending ? "Upgrading..." : "Upgrade Luck"}
          </Button>
          <Button onClick={handleMaxLuck} disabled={maxAffordableLuck === 0}>
            Max Luck
          </Button>
          <DialogTrigger>
            <Button variant="destructive">Cancel</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for status displays
function StatusDisplay({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-semibold">{label}</h1>
      <p
        className={`flex items-center gap-x-1 text-sm font-light ${colorClass}`}
      >
        {icon}
        <strong>{abbreviateNumber(value)}</strong>
      </p>
    </div>
  );
}
