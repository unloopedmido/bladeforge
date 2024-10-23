import Layout from "@/components/layout";
import { api } from "@/utils/api";
import { type Sword as SwordType, type User as UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import UserStats from "@/components/userstats";
import SwordDisplay from "@/components/sword";
import ActionButtons from "@/components/buttons";
import FakeSword from "@/components/fakesword";
import { Clover, CoinsIcon, Star } from "lucide-react";
import { abbreviateNumber } from "@/lib/func";

export default function Forge() {
  const [sword, setSword] = useState<SwordType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const { data: userData, isLoading: isUserLoading } = api.user.user.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  );

  const { data: globalBoosts, isLoading: isGlobalBoostsLoading } =
    api.user.getGlobalBoosts.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    });

  useEffect(() => {
    setSword(userData?.swords.find((s) => s.id === userData.swordId) ?? null);
    setUser(userData ?? null);
  }, [userData]);

  if (isUserLoading || isGlobalBoostsLoading) {
    return <Layout isLoading />;
  }

  return (
    <Layout>
      <h1 className="text-center text-4xl font-bold">Current Sword</h1>
      <div className="mx-auto mb-5 mt-5 flex w-full max-w-xs items-center justify-around gap-x-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-yellow-100 p-2">
            <CoinsIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium">
              {abbreviateNumber(String(user?.money))}
            </p>
            <p className="text-xs text-muted-foreground">Gold</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-green-100 p-2">
            <Clover className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium">
              {abbreviateNumber(String(user?.luck))}
            </p>
            <p className="text-xs text-muted-foreground">Luck</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-purple-100 p-2">
            <Star className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="font-medium">{String(user?.essence)}</p>
            <p className="text-xs text-muted-foreground">Essence</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-10 flex flex-grow items-center justify-center gap-8">
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2">
          <div className="flex justify-center">
            {sword ? (
              <SwordDisplay username={user?.name ?? ""} sword={sword} />
            ) : (
              <FakeSword />
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <UserStats user={user} />
            <ActionButtons
              sword={sword}
              setSword={setSword}
              user={user}
              setUser={setUser}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
