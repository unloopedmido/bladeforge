import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, data: session } = useSession();

  return (
    <div className="container mx-auto">
      {!session?.user.name && status === "authenticated" && (
        <div className="px-5 mx-auto mt-32 flex max-w-md flex-col gap-5 text-center xl:mt-80">
          <h1 className="text-4xl font-bold">Unauthorized</h1>
          <p className="font-light text-foreground/70">
            Uh oh! You must be a booster or a tester to visit this webpage
          </p>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      )}
      {status === "unauthenticated" && (
        <div className="px-5 mx-auto mt-32 flex max-w-md flex-col gap-5 text-center xl:mt-80">
          <h1 className="text-4xl font-bold">Unauthorized</h1>
          <p className="font-light text-foreground/70">
            Uh oh! You must be signed in to visit this webpage
          </p>
          <Button onClick={() => signIn("discord")}>Sign In</Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      )}
      {status === "loading" && (
        <div className="px-5 mx-auto mt-32 flex max-w-md flex-col gap-5 text-center xl:mt-80">
          <h1 className="text-4xl font-bold">Loading</h1>
          <p className="font-light text-foreground/70">Please wait...</p>
        </div>
      )}
      {status === "authenticated" && session.user.name && children}
    </div>
  );
}
