import Layout from "@/components/layout";
import Sword from "@/components/sword";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export default function Blades() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: swords,
    isLoading,
    refetch,
  } = api.sword.swords.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { mutate: equipSword, isPending: isEquipping } =
    api.sword.equipSword.useMutation({
      onSuccess: () => {
        void router.push("/forge");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: sellSword, isPending: isSelling } =
    api.sword.sellSword.useMutation({
      onSuccess: () => {
        void refetch();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  if (isLoading) {
    return <Layout isLoading />;
  }

  const handleEquipSword = (swordId: string) => equipSword(swordId);
  const handleSellSword = (swordId: string) => sellSword(swordId);

  return (
    <Layout>
      <div className="container mx-auto mb-10">
        <h1 className="text-center text-4xl font-bold">Blades</h1>
        <div className="mt-10 grid cursor-pointer grid-cols-1 justify-items-center gap-y-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {swords?.length ? (
            swords.map((sword) => (
              <div key={sword.id} className="flex flex-col items-center">
                <Sword username={session?.user.name ?? ""} sword={sword} />
                <div className="mt-2 flex w-full space-x-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={isEquipping || isSelling}
                    onClick={() => handleEquipSword(sword.id)}
                  >
                    {isEquipping ? "Equipping..." : "Equip"}
                  </Button>
                  <Button
                    className="w-full"
                    variant="destructive"
                    disabled={isEquipping || isSelling}
                    onClick={() => handleSellSword(sword.id)}
                  >
                    {isSelling ? "Selling..." : "Sell"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <h2 className="font-sm mt-4 text-center text-foreground/70">
              You do not have any swords stored
            </h2>
          )}
        </div>
      </div>
    </Layout>
  );
}
