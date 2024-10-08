import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { abbreviateNumber, getLevelFromExperience } from "@/lib/func";
import { api } from "@/utils/api";
import type { User as UserType } from "@prisma/client";
import { CalendarIcon, SwordIcon, CoinsIcon, CloverIcon } from "lucide-react";
import { useEffect } from "react";

export default function Leaderboards() {
  const { data, isLoading } = api.user.getUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  function userStatus(user: UserType) {
    const lastAscend = user.lastAscend?.getTime();
    const lastGeneration = user.lastGeneration?.getTime();
    const lastUpgrade = user.lastLuckUpgrade;

    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;
    const twoHours = 2 * 60 * 60 * 1000;

    if (lastAscend && now - lastAscend < fiveMinutes) {
      return <p className="text-green-500">Active</p>;
    } else if (lastGeneration && now - lastGeneration < fiveMinutes) {
      return <p className="text-green-500">Active</p>;
    } else if (lastUpgrade && now - lastUpgrade.getTime() < fiveMinutes) {
      return <p className="text-green-500">Active</p>;
    } else if (lastAscend && now - lastAscend < twoHours) {
      return <p className="text-yellow-500">Idle</p>;
    } else if (lastGeneration && now - lastGeneration < twoHours) {
      return <p className="text-yellow-500">Idle</p>;
    } else if (lastUpgrade && now - lastUpgrade.getTime() < twoHours) {
      return <p className="text-yellow-500">Idle</p>;
    } else {
      return <p className="text-red-500">Offline</p>;
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  // Logs all users
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <p className="text-center text-2xl font-semibold">Loading...</p>
      ) : (
        <Table>
          <TableCaption>Top 25 Users (sorted by luck)</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Money</TableHead>
              <TableHead>Luck</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>#{index + 1}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger className="cursor-pointer font-medium underline">
                      {user.name}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{user.name}</h4>
                          <div className="flex items-center gap-1 text-sm">
                            {user.vip && 
                              <span className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 px-1 text-xs font-bold text-black">
                                VIP
                              </span>
                            }
                            <span className={user.vip ? "text-yellow-500" : ""}>
                              Level {getLevelFromExperience(Number(user.experience))}
                            </span>
                          </div>
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center text-sm">
                              <CoinsIcon className="mr-2 h-4 w-4 opacity-70" />
                              <span>{abbreviateNumber(Number(user.money))} coins</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <SwordIcon className="mr-2 h-4 w-4 opacity-70" />
                              <span>{user.swords.length || 0} sword(s) stored</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CloverIcon className="mr-2 h-4 w-4 opacity-70" />
                              <span>{abbreviateNumber(Number(user.luck))} luck</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>{getLevelFromExperience(Number(user.experience))}</TableCell>
                <TableCell>{abbreviateNumber(Number(user.money))}</TableCell>
                <TableCell>{abbreviateNumber(Number(user.luck))}</TableCell>
                <TableCell>{userStatus(user)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}