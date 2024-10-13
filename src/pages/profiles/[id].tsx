import React, { useState } from "react";
import Layout from "@/components/layout";
import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sword, Coins, Zap, Shield, Clover } from "lucide-react";
import { getForgingTitle } from "@/data/common";
import { abbreviateNumber, getLevelFromExperience, getExperienceForNextLevel } from "@/lib/func";
import SwordDisplay from "@/components/sword";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Profile() {
  const { query } = useRouter();
  const { data: user, isLoading } = api.user.getUser.useQuery(query.id as string ?? "", {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

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

  const filteredUsers = allUsers?.filter((otherUser) =>
    otherUser.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <h1 className="text-center text-4xl font-bold mb-8">Bladesmith Profile</h1>
      <div className="w-full grid gap-8 grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.image ?? ""}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <p className="text-muted-foreground text-md">{user?.id}</p>
              <p className="text-md font-semibold text-primary">{getForgingTitle(currentLevel)}</p>
              <div className="mt-2">
                {user?.vip && (
                  <span className="mr-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">VIP</span>
                )}
                {user?.booster && (
                  <span className="rounded bg-purple-500 px-2 py-1 text-xs font-bold text-white">Booster</span>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* User Level and Experience Progress */}
        <Card className="col-span-2">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mt-4 text-2xl font-bold">Level {currentLevel}</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground cursor-pointer">
                        {abbreviateNumber(String(currentExperience))} Total XP
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Experience: {currentExperience.toLocaleString()} / {experienceRequired.toLocaleString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{abbreviateNumber(String(experiencePercentage))}%</span>
            </div>
            <Progress value={experiencePercentage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sword className="mr-2" />
              Swords Forged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">{user?.swords?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Coins className="mr-2" />
              Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">{abbreviateNumber(user?.money ?? "0")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2" />
              Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">{abbreviateNumber(user?.experience?.toString() ?? "0")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clover className="mr-2" />
              Luck
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">{abbreviateNumber(user?.luck?.toString() ?? "1")}</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 flex items-center flex-col">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" />
              Strongest Sword
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.swords && user.swords.length > 0 ? (
              <SwordDisplay
                sword={
                  user.swords.sort(
                    (a, b) => parseInt(b.value) - parseInt(a.value),
                  )[0]!
                }
                username={user.name!}
              />
            ) : (
              <p>No swords forged yet</p>
            )}
          </CardContent>
        </Card>

        {/* User Search Section */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Search for Other Users</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4">
              {filteredUsers?.length === 1 && filteredUsers?.map((otherUser) => (
                <Link key={otherUser.id} href={`/profiles/${otherUser.id}`}>
                  <div className="p-2 border-b hover:bg-foreground/20 cursor-pointer">
                    {otherUser.name}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
