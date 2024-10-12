import {
  Table,
  TableBody,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { abbreviateNumber, getLevelFromExperience } from "@/lib/func";
import { api } from "@/utils/api";
import { CalendarIcon, SwordIcon, CoinsIcon, CloverIcon } from "lucide-react";
import Layout from "@/components/layout";

export default function Leaderboards() {
  const { data, isLoading } = api.user.getUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }

  if (isLoading) {
    return <Layout isLoading />;
  }

  return (
    <Layout>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Money</TableHead>
            <TableHead>Luck</TableHead>
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
                  <HoverCardContent
                    className="w-80"
                    style={user.vip ? { border: "1px solid #ca8a04" } : {}}
                  >
                    <div className="flex justify-between space-x-4">
                      <div className="flex items-center justify-center">
                        <Avatar className="h-28 w-28">
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {user.name?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-1">
                        <h4
                          className={
                            "flex items-center gap-x-2 text-sm font-semibold" +
                            (user.vip ? " text-yellow-500" : "")
                          }
                        >
                          {user.vip && (
                            <span className="rounded bg-gradient-to-r from-yellow-400 to-yellow-600 px-1 text-xs font-bold text-black">
                              VIP
                            </span>
                          )}
                          {user.name}
                        </h4>
                        <div className="flex items-center gap-1 text-sm">
                          Level{" "}
                          {getLevelFromExperience(Number(user.experience))}
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center text-sm">
                            <CoinsIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span>
                              {abbreviateNumber(Number(user.money))} coins
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <SwordIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span>
                              {user.swords.length || 0} sword(s) stored
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CloverIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span>{Number(user.luck)} luck</span>
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
              <TableCell>
                {getLevelFromExperience(Number(user.experience))}
              </TableCell>
              <TableCell>{abbreviateNumber(Number(user.money))}</TableCell>
              <TableCell>{Number(user.luck)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
