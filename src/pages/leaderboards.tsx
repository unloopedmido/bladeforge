import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { abbreviateNumber, getLevelFromExperience } from "@/lib/func";
import { api } from "@/utils/api";
import {
  CalendarIcon,
  SwordIcon,
  CoinsIcon,
  CloverIcon,
  Trophy,
  Medal,
  Crown,
} from "lucide-react";
import Layout from "@/components/layout";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RankIcon = ({ position }: { position: number }) => {
  if (position === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
  if (position === 2) return <Medal className="h-6 w-6 text-slate-300" />;
  if (position === 3) return <Medal className="h-6 w-6 text-orange-400" />;
  return <Trophy className="h-5 w-5 text-muted-foreground" />;
};

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

  if (isLoading) return <Layout isLoading />;

  const sortedUsers = data?.sort(
    (a, b) => parseInt(b.experience) - parseInt(a.experience),
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Leaderboards</h1>
          <p className="text-muted-foreground">
            Top Bladesmiths ranking by level
          </p>
        </div>

        <div className="space-y-4">
          {sortedUsers?.map((user, index) => (
            <div
              key={user.id}
              className={cn(
                "group relative overflow-hidden rounded-lg border bg-card/50 p-4 transition-all hover:bg-card",
                index < 3 ? "border-purple-500/20" : "border-border/50",
              )}
            >
              {index < 3 && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Rank section */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <RankIcon position={index + 1} />
                </div>

                {/* User info section */}
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-purple-500/20">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>
                          {user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/profiles/${user.id}`}
                            className="font-bold"
                          >
                            {user.name}
                          </Link>
                          {user.vip && (
                            <span className="rounded bg-gradient-to-r from-purple-400 to-purple-600 px-1.5 py-0.5 text-xs font-bold text-black">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Level{" "}
                          {getLevelFromExperience(Number(user.experience))}
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="w-80"
                    style={user.vip ? { border: "1px solid #ca8a04" } : {}}
                  >
                    <div className="flex justify-between space-x-4">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>
                          {user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h4
                          className={cn(
                            "flex items-center gap-x-2 font-semibold",
                            user.vip && "text-purple-500",
                          )}
                        >
                          {user.vip && (
                            <span className="rounded bg-gradient-to-r from-purple-400 to-purple-600 px-1 text-xs font-bold text-black">
                              VIP
                            </span>
                          )}
                          {user.name}
                        </h4>
                        <div className="space-y-2.5">
                          <div className="flex items-center text-sm">
                            <CoinsIcon className="mr-2 h-4 w-4 text-yellow-500" />
                            {abbreviateNumber(user.money)} coins
                          </div>
                          <div className="flex items-center text-sm">
                            <SwordIcon className="mr-2 h-4 w-4 text-red-500" />
                            {user.swordsGenerated || 0} swords
                          </div>
                          <div className="flex items-center text-sm">
                            <CloverIcon className="mr-2 h-4 w-4 text-green-500" />
                            {Number(user.luck)} luck
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* Stats section */}
                <div className="mt-2 flex items-center gap-4 sm:ml-auto sm:mt-0 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <CoinsIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {abbreviateNumber(user.money)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloverIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      {Number(user.luck)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
