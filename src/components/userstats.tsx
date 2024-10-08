import { abbreviateNumber } from "@/lib/func";
import { type User as UserType } from "@prisma/client";
import { Clover, CoinsIcon } from "lucide-react";

interface UserStatsProps {
  user: UserType | null;
}

export default function UserStats({ user }: UserStatsProps) {
  return (
    <div className="mt-6 mb-6 flex w-full max-w-xs items-center justify-around rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-x-2 text-yellow-500">
        <CoinsIcon />
        <span>{abbreviateNumber(Number(user?.money))}</span>
      </div>
      <div className="flex items-center gap-x-2 text-green-500">
        <Clover />
        <span>{abbreviateNumber(Number(user?.luck))}</span>
      </div>
    </div>
  );
}