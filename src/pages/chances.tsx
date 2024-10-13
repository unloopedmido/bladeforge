import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Rarities from "@/data/rarities"; // Has colors
import Qualities from "@/data/qualities"; // Doesn't have colors
import Materials from "@/data/materials"; // Has colors
import { abbreviateNumber, rgbToAlpha } from "@/lib/func";
import { LinearGradient as LG } from "react-text-gradients";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout";
import Enchants from "@/data/enchants";
import Auras from "@/data/auras";
import Effects from "@/data/effects";

export default function Chances() {
  const { status } = useSession();

  const { data: userTotalLuck, isLoading: isUserTotalLuckLoading } =
    api.user.userTotalLuck.useQuery(undefined, {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    });

  if (isUserTotalLuckLoading || status === "loading") {
    return <Layout isLoading />;
  }

  const renderCardContent = (
    name: string,
    chance: number,
    valueMultiplier: number,
    damageMultiplier: number,
    color: string | string[],
  ) => {
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
            <p className="font-medium">
              1/{abbreviateNumber(String(chance / (userTotalLuck ?? 1)))}
            </p>
            <p className="text-xs text-muted-foreground">Chance</p>
          </div>

          {/* Value Multiplier */}
          <div className="flex flex-col items-center">
            <p className="font-medium">
              {abbreviateNumber(String(valueMultiplier))}
            </p>
            <p className="text-xs text-muted-foreground">Value</p>
          </div>

          {/* Damage Multiplier (Optional) */}
          {damageMultiplier && (
            <div className="flex flex-col items-center">
              <p className="font-medium">
                {abbreviateNumber(String(damageMultiplier))}
              </p>
              <p className="text-xs text-muted-foreground">Damage</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <h1 className="text-center text-4xl font-bold">Chances</h1>

      {/* Tabs for Rarities, Qualities, Materials */}
      <Tabs className="mb-5" defaultValue="rarity">
        <TabsList>
          <TabsTrigger value="rarity">Rarities</TabsTrigger>
          <TabsTrigger value="quality">Qualities</TabsTrigger>
          <TabsTrigger value="material">Materials</TabsTrigger>
          <TabsTrigger value="enchants">Enchants</TabsTrigger>
          <TabsTrigger value="auras">Auras</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        {/* Rarities */}
        <TabsContent value="rarity">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Rarities.sort((a, b) => a.chance - b.chance).map((r) =>
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
            {Qualities.sort((a, b) => a.chance - b.chance).map((q) =>
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
            {Materials.sort((a, b) => a.chance - b.chance).map((m) =>
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

        <TabsContent value="enchants">
          {[1, 2, 3, 4, 5, 6].map((tier) => (
            <>
              <h1 className="mb-1 mt-1 text-center text-2xl font-bold">
                Tier {tier}
              </h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Enchants.filter((e) => e.tier === tier).map((e) => (
                  <Card key={e.name} className="flex flex-col items-center">
                    <CardHeader>
                      <CardTitle>
                        <LG
                          gradient={[
                            "to left",
                            rgbToAlpha(e.color, 1).join(", "),
                          ]}
                          className="text-2xl font-extrabold"
                        >
                          {e.name}
                        </LG>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-x-4">
                      <div className="flex flex-col items-center">
                        <p className="font-medium">{e.chance}%</p>
                        <p className="text-xs text-muted-foreground">Chance</p>
                      </div>

                      {e.valueMultiplier > 0 && (
                        <div className="flex flex-col items-center">
                          <p className="font-medium">
                            {abbreviateNumber(String(e.valueMultiplier))}x
                          </p>
                          <p className="text-xs text-muted-foreground">Value</p>
                        </div>
                      )}

                      {e.damageMultiplier > 0 && (
                        <div className="flex flex-col items-center">
                          <p className="font-medium">
                            {abbreviateNumber(String(e.damageMultiplier))}x
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Damage
                          </p>
                        </div>
                      )}

                      {e.experienceMultiplier > 0 && (
                        <div className="flex flex-col items-center">
                          <p className="font-medium">
                            {abbreviateNumber(String(e.experienceMultiplier))}x
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Experience
                          </p>
                        </div>
                      )}

                      {e.luckMultiplier > 0 && (
                        <div className="flex flex-col items-center">
                          <p className="font-medium">
                            {abbreviateNumber(String(e.luckMultiplier))}x
                          </p>
                          <p className="text-xs text-muted-foreground">Luck</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ))}
        </TabsContent>

        <TabsContent value="auras">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Auras.filter((a) => a.valueMultiplier > 1)
              .sort((a, b) => b.chance - a.chance)
              .map((e) => (
                <Card key={e.name} className="flex flex-col items-center">
                  <CardHeader>
                    <CardTitle>
                      <LG
                        gradient={[
                          "to left",
                          rgbToAlpha(e.color, 1).join(", "),
                        ]}
                        className="text-2xl font-extrabold"
                      >
                        {e.name}
                      </LG>{" "}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-x-4">
                    <div className="flex flex-col items-center">
                      <p className="font-medium">{e.chance}%</p>
                      <p className="text-xs text-muted-foreground">Chance</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="font-medium">
                        {abbreviateNumber(String(e.valueMultiplier))}
                      </p>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-medium">
                        {abbreviateNumber(String(e.damageMultiplier))}
                      </p>
                      <p className="text-xs text-muted-foreground">Damage</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="effects">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Effects.filter((e) => e.valueMultiplier > 1)
              .sort((a, b) => b.chance - a.chance)
              .map((e) => (
                <Card key={e.name} className="flex flex-col items-center">
                  <CardHeader>
                    <CardTitle>
                      <LG
                        gradient={[
                          "to left",
                          rgbToAlpha(e.color, 1).join(", "),
                        ]}
                        className="text-2xl font-extrabold"
                      >
                        {e.name}
                      </LG>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-x-4">
                    <div className="flex flex-col items-center">
                      <p className="font-medium">{e.chance}%</p>
                      <p className="text-xs text-muted-foreground">Chance</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="font-medium">
                        {abbreviateNumber(String(e.valueMultiplier))}
                      </p>
                      <p className="text-xs text-muted-foreground">Value</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-medium">
                        {abbreviateNumber(String(e.damageMultiplier))}
                      </p>
                      <p className="text-xs text-muted-foreground">Damage</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
