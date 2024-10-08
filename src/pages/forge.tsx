import Layout from "@/components/layout";
import { api } from "@/utils/api";
import { type Sword as SwordType, type User as UserType } from "@prisma/client";
import { useEffect, useState } from "react";
import UserStats from "@/components/userstats";
import SwordDisplay from "@/components/sword";
import ActionButtons from "@/components/buttons";
import FakeSword from "@/components/fakesword";

export default function Forge() {
  const {
    data: currentSword,
    isLoading,
    isRefetching,
  } = api.sword.getCurrentSword.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { data: userData, isLoading: isUserLoading } = api.user.user.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  );

  const [sword, setSword] = useState<SwordType | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (currentSword) setSword(currentSword.sword);
    if (userData) setUser(userData.user);
  }, [currentSword, userData]);

  if (isLoading || isRefetching || isUserLoading) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold">Current Sword</h1>
        <UserStats user={user} />
        {sword ? <SwordDisplay username={user?.name ?? ""} sword={sword} /> : <FakeSword />}
        <ActionButtons
          sword={sword}
          setSword={setSword}
          user={user}
          setUser={setUser}
        />
      </div>
    </Layout>
  );
}
