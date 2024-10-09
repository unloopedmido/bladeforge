import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Rarities from "@/data/rarities"; // Has colors
import Qualities from "@/data/qualities"; // Doesn't have colors
import Materials from "@/data/materials"; // Has colors
import {
  abbreviateNumber,
  getLevelFromExperience,
  rgbToAlpha,
} from "@/lib/func";
import { LinearGradient as LG } from "react-text-gradients";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { luckFromLevel } from "@/data/common";

export default function Chances() {
  const { status } = useSession();
  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: status === "authenticated",
  });
  const [RNG, toggleRNG] = useState(true);

  if (isLoading) {
    return (
      <div className="mx-auto mt-32 flex max-w-md flex-col gap-5 px-5 text-center xl:mt-80">
        <h1 className="text-4xl font-bold">Loading</h1>
        <p className="font-light text-foreground/70">Please wait...</p>
      </div>
    );
  }

  const renderCardContent = (
    name: string,
    chance: number,
    valueMultiplier: number,
    damageMultiplier: number,
    color: string | string[],
  ) => {
    const userLuck = Number(data?.user?.luck ?? 1);
    const userMultiplier = data?.user?.vip ? 1.5 : 1;
    const chanceValue = RNG
      ? Math.round(
          chance /
            (userLuck * userMultiplier) /
            luckFromLevel(
              getLevelFromExperience(Number(data?.user?.experience)),
            ),
        )
      : Math.round(chance);

    return (
      <Card key={name} className="flex flex-col items-center">
        <CardHeader>
          <CardTitle>
            <LG
              gradient={["to left", rgbToAlpha(color, 1).join(", ")]}
              className="text-2xl font-extrabold"
            >
              {name}
            </LG>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-x-4">
          {/* Chance */}
          <div className="flex flex-col items-center">
            <p className="font-medium">1/{abbreviateNumber(chanceValue)}</p>
            <p className="text-xs text-muted-foreground">Chance</p>
          </div>

          {/* Value Multiplier */}
          <div className="flex flex-col items-center">
            <p className="font-medium">{abbreviateNumber(valueMultiplier)}x</p>
            <p className="text-xs text-muted-foreground">Value</p>
          </div>

          {/* Damage Multiplier (Optional) */}
          {damageMultiplier && (
            <div className="flex flex-col items-center">
              <p className="font-medium">
                {abbreviateNumber(damageMultiplier)}x
              </p>
              <p className="text-xs text-muted-foreground">Damage</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4">
      {!isLoading ? (
        <>
          <h1 className="text-center text-4xl font-bold">Chances</h1>
          {data && (
            <div className="mb-10 flex justify-center">
              <Button
                variant="secondary"
                className="mt-5"
                onClick={() => toggleRNG(!RNG)}
              >
                {RNG ? "Disable" : "Enable"} RNG
              </Button>
            </div>
          )}

          {/* Tabs for Rarities, Qualities, Materials */}
          <Tabs className="mb-5" defaultValue="rarity">
            <TabsList>
              <TabsTrigger value="rarity">Rarities</TabsTrigger>
              <TabsTrigger value="quality">Qualities</TabsTrigger>
              <TabsTrigger value="material">Materials</TabsTrigger>
            </TabsList>

            {/* Rarities */}
            <TabsContent value="rarity">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Rarities.map((r) =>
                  renderCardContent(
                    r.name,
                    r.chance,
                    r.valueMultiplier,
                    r.damageMultiplier,
                    r.color,
                  ),
                )}
              </div>
            </TabsContent>

            {/* Qualities */}
            <TabsContent value="quality">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Qualities.map((q) =>
                  renderCardContent(
                    q.name,
                    q.chance,
                    q.valueMultiplier,
                    q.damageMultiplier,
                    "rgb(255,255,255)",
                  ),
                )}
              </div>
            </TabsContent>

            {/* Materials */}
            <TabsContent value="material">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Materials.map((m) =>
                  renderCardContent(
                    m.name,
                    m.chance,
                    m.valueMultiplier,
                    1, // Materials may not have a damageMultiplier
                    m.color,
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <h1 className="text-center text-4xl font-extrabold">Loading...</h1>
      )}
    </div>
  );
}
