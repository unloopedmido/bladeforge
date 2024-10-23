import React, { useState } from "react";
import Layout from "@/components/layout";
import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sword, 
  Coins, 
  Zap, 
  Shield, 
  Clover, 
  Crown,
  Search,
} from "lucide-react";
import { getForgingTitle } from "@/data/common";
import {
  abbreviateNumber,
  getLevelFromExperience,
  getExperienceForNextLevel,
} from "@/lib/func";
import SwordDisplay from "@/components/sword";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Profile() {
  const { query } = useRouter();
  const { data: user, isLoading } = api.user.getUser.useQuery(
    (query.id as string) ?? "",
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  );

  const { data: allUsers } = api.user.getAllUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <Layout isLoading />;
  }

  const currentExperience = Number(user?.experience ?? 0);
  const currentLevel = getLevelFromExperience(currentExperience);
  const experienceRequired = getExperienceForNextLevel(currentLevel);
  const experiencePercentage = ((currentExperience % experienceRequired) / experienceRequired) * 100;
  const experienceForCurrentLevel = currentExperience % experienceRequired;

  const filteredUsers = allUsers?.filter((otherUser) =>
    otherUser.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="rounded-lg border bg-card p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24 border-2 border-purple-500/20">
                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
                <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-3xl font-bold">{user?.name}</h1>
                  {user?.vip && (
                    <span className="rounded bg-gradient-to-r from-purple-400 to-purple-600 px-2 py-0.5 text-xs font-bold text-black">
                      VIP
                    </span>
                  )}
                  {user?.booster && (
                    <span className="rounded bg-gradient-to-r from-purple-400 to-purple-600 px-2 py-0.5 text-xs font-bold text-black">
                      BOOSTER
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{user?.id}</p>
                <p className="mt-2 text-lg font-semibold text-purple-500">
                  {getForgingTitle(currentLevel)}
                </p>
              </div>
              
              {/* Level Display */}
              <div className="flex flex-col items-center rounded-lg border bg-background/50 p-4 text-center">
                <Crown className="mb-1 h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">Level {currentLevel}</span>
                <span className="text-sm text-muted-foreground">
                  {abbreviateNumber(String(experienceForCurrentLevel))} / {abbreviateNumber(String(experienceRequired))} XP
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <Progress value={experiencePercentage} className="h-2" />
              <p className="mt-1 text-center text-sm text-muted-foreground">
                {experiencePercentage.toFixed(1)}% to Level {currentLevel + 1}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Coins
                    </CardTitle>
                    <Coins className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {abbreviateNumber(user?.money ?? "0")}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.money?.toLocaleString()} coins</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Experience
                    </CardTitle>
                    <Zap className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {abbreviateNumber(user?.experience?.toString() ?? "0")}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{Number(user?.experience).toLocaleString()} total XP</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Swords Created
                    </CardTitle>
                    <Sword className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {user?.swordsGenerated.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user?.swordsGenerated.toLocaleString()} swords forged</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Luck Factor
                    </CardTitle>
                    <Clover className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Number(user?.luck)}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Luck Factor: {Number(user?.luck)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Strongest Sword Section */}
        {user?.swords && user.swords.length > 0 && (
          <Card className="mb-8 hidden sm:block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                Strongest Sword
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SwordDisplay
                sword={user.swords.sort((a, b) => Number(b.value) - Number(a.value))[0]!}
                username={user.name!}
              />
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Other Bladesmiths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {searchTerm && filteredUsers && filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-lg border bg-background p-2 shadow-lg">
                  {filteredUsers.map((otherUser) => (
                    <Link key={otherUser.id} href={`/profiles/${otherUser.id}`}>
                      <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={otherUser.image ?? undefined} />
                          <AvatarFallback>{otherUser.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{otherUser.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {getLevelFromExperience(Number(otherUser.experience))}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}