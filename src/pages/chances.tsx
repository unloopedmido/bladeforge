import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Rarities from "@/data/rarities"; // Has colors
import Qualities from "@/data/qualities"; // Doesnt have colors
import Materials from "@/data/materials"; // Has colors
import { abbreviateNumber, rgbToAlpha } from "@/lib/func";
import { LinearGradient as LG } from "react-text-gradients";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function Chances() {
  const { status } = useSession();
  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: status === "authenticated",
  });
  const [RNG, toggleRNG] = useState(true);

  return (
    <div className="container mx-auto">
      {!isLoading ? (
        <>
          <h1 className="text-center text-4xl font-bold">Chances</h1>
          {data && !isLoading && (
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
          <Tabs className="mb-5" defaultValue="rarity">
            <TabsList>
              <TabsTrigger value="rarity">Rarities</TabsTrigger>
              <TabsTrigger value="quality">Qualities</TabsTrigger>
              <TabsTrigger value="material">Materials</TabsTrigger>
            </TabsList>
            <TabsContent value="rarity">
              <Table>
                <TableCaption>
                  Enable RNG to view your personalized chances
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Chance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Damage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Rarities.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell>
                        <LG
                          className="font-extrabold"
                          gradient={[
                            "to left",
                            rgbToAlpha(r.color, 1).join(", "),
                          ]}
                        >
                          {r.name}
                        </LG>
                      </TableCell>

                      <TableCell>
                        1/
                        {RNG
                          ? abbreviateNumber(
                              Math.round(
                                r.chance /
                                  (Number(data?.user?.luck ?? 1) *
                                    (data?.user?.vip ? 1.5 : 1)),
                              ),
                            )
                          : abbreviateNumber(Math.round(r.chance))}
                      </TableCell>
                      <TableCell>{r.valueMultiplier}x</TableCell>
                      <TableCell>{r.damageMultiplier}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="quality">
              <Table>
                <TableCaption>
                  Enable RNG to view your personalized chances
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Chance</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Damage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Qualities.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell>{r.name}</TableCell>

                      <TableCell>
                        1/
                        {RNG
                          ? abbreviateNumber(
                              Math.round(
                                r.chance /
                                  (Number(data?.user?.luck ?? 1) *
                                    (data?.user?.vip ? 1.5 : 1)),
                              ),
                            )
                          : abbreviateNumber(Math.round(r.chance))}
                      </TableCell>
                      <TableCell>{r.valueMultiplier}x</TableCell>
                      <TableCell>{r.damageMultiplier}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="material">
              <Table>
                <TableCaption>
                  Enable RNG to view your personalized chances
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Chance</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Materials.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell>
                        <LG
                          className="font-extrabold"
                          gradient={[
                            "to left",
                            rgbToAlpha(r.color, 1).join(", "),
                          ]}
                        >
                          {r.name}
                        </LG>
                      </TableCell>

                      <TableCell>
                        1/
                        {RNG
                          ? abbreviateNumber(
                              Math.round(
                                r.chance /
                                  (Number(data?.user?.luck ?? 1) *
                                    (data?.user?.vip ? 1.5 : 1)),
                              ),
                            )
                          : abbreviateNumber(Math.round(r.chance))}
                      </TableCell>
                      <TableCell>{r.valueMultiplier}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <h1 className="text-center text-4xl font-extrabold">Loading...</h1>
      )}
    </div>
  );
}
