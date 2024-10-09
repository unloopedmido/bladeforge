import Layout from "@/components/layout";
import Sword from "@/components/sword";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function Blades() {
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
      onSuccess: (data) => {
        if (data.success) {
          void refetch();
          toast.success("Sword equipped successfully");
        } else {
          toast.error(data.message);
        }
      },
    });

  const { mutate: sellSword, isPending: isSelling } =
    api.sword.sellSword.useMutation({
      onSuccess: () => {
        void refetch();
        toast.success("Sword sold successfully");
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
        <div className="mt-10 grid cursor-pointer grid-cols-1 justify-items-center gap-y-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {swords?.swords?.length ? (
            swords.swords.map((sword) => (
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
