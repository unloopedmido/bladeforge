import React from "react";
import {
  abbreviateNumber,
  getExperienceForNextLevel,
  getLevelFromExperience,
} from "@/lib/func";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ClientUserType, getForgingTitle } from "@/data/common";

interface UserStatsProps {
  user: ClientUserType | null;
}

export default function UserStats({ user }: UserStatsProps) {
  const currentExperience = Number(user?.experience);
  const experienceRequired = getExperienceForNextLevel(
    getLevelFromExperience(currentExperience),
  );
  const experiencePercentage =
    ((currentExperience % experienceRequired) / experienceRequired) * 100;

  const currentLevel = getLevelFromExperience(currentExperience);
  const nextLevel = currentLevel + 1;

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
              <p className="text-sm text-muted-foreground">
                {getForgingTitle(currentLevel)}
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {abbreviateNumber(String(currentExperience))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Experience: {currentExperience.toLocaleString()} /{" "}
                  {experienceRequired.toLocaleString()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span>Progress to Level {nextLevel}</span>
            <span>{abbreviateNumber(String(experiencePercentage))}%</span>
          </div>
          <Progress value={experiencePercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
