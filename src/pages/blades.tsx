import Layout from "@/components/layout";
import Sword from "@/components/sword";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";
import { toast } from "sonner";

export default function Blades() {
  const {
    data: swords,
    isLoading,
    refetch,
  } = api.sword.swords.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { mutate: equipSword } = api.sword.equipSword.useMutation({
    onSuccess: (data) => {
      if(data.success) {
        void refetch();
      toast.success("Sword equipped successfully");
      } else {
        toast.error(data.message);
      }
    },
  });

  const { mutate: sellSword } = api.sword.sellSword.useMutation({
    onSuccess: () => {
      void refetch()
      toast.success("Sword sold successfully");
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto">
          <h1 className="text-center text-4xl font-bold">Loading...</h1>
        </div>
      </Layout>
    );
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
              <AlertDialog key={sword.id}>
                <AlertDialogTrigger className="text-start">
                  <Sword sword={sword} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Manage Blade</AlertDialogTitle>
                    <AlertDialogDescription>
                      Here you can either sell or equip the currently selected
                      blade
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleEquipSword(sword.id)}
                    >
                      Equip
                    </AlertDialogAction>
                    <AlertDialogAction
                      onClick={() => handleSellSword(sword.id)}
                    >
                      Sell
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ))
          ) : (
            <h2 className="mt-4 text-center font-sm text-foreground/70">You do not have any swords stored</h2>
          )}
        </div>
      </div>
    </Layout>
  );
}
