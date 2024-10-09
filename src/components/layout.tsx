import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { Button } from "./ui/button";

export default function Layout({
  children,
  isLoading,
}: {
  children?: ReactNode;
  isLoading?: boolean;
}) {
  const router = useRouter();
  const { status, data: session } = useSession();

  // Loading state takes priority
  if (status === "loading") {
    return (
      <div className="mx-auto mt-32 flex max-w-md flex-col gap-5 px-5 text-center xl:mt-80">
        <h1 className="text-4xl font-bold">Loading</h1>
        <p className="font-light text-foreground/70">Please wait...</p>
      </div>
    );
  }

  // Check for unauthenticated or unauthorized states
  if (status === "unauthenticated") {
    return (
      <div className="mx-auto mt-32 flex max-w-md flex-col gap-5 px-5 text-center xl:mt-80">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="font-light text-foreground/70">
          Uh oh! You must be signed in to visit this webpage
        </p>
        <Button onClick={() => signIn("discord")}>Sign In</Button>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  // Check for authenticated state with no user name
  if (!session?.user.name && status === "authenticated") {
    return (
      <div className="mx-auto mt-32 flex max-w-md flex-col gap-5 px-5 text-center xl:mt-80">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="font-light text-foreground/70">
          Uh oh! You must be a booster or a tester to visit this webpage
        </p>
        <Button onClick={() => signOut()}>Sign Out</Button>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  // Check for loading state
  if (isLoading) {
    return (
      <div className="mx-auto mt-32 flex max-w-md flex-col gap-5 px-5 text-center xl:mt-80">
        <h1 className="text-4xl font-bold">Loading</h1>
        <p className="font-light text-foreground/70">Please wait...</p>
      </div>
    );
  }

  // If authenticated and user name exists, render children
  return <div className="container mx-auto mb-10 flex flex-col flex-1">{children}
  <h1 className="absolute bottom-1 left-1 text-muted-foreground"><strong>Version:</strong> 0.1.0</h1></div>;
}
