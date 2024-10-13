import React from "react";
import Layout from "@/components/layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

export default function Membership() {
  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isLoading) return <Layout isLoading />;

  return (
    <Layout>
      {data && !data.vip && (
        <div className="h-full flex-grow">
          <h1 className="text-center text-4xl font-bold">VIP Membership</h1>
          <div className="p-4">
            <h2 className="text-2xl font-semibold">Become a VIP Member</h2>
            <p className="mb-4 text-lg">
              Join our community of Bladesmiths and unlock exclusive features,
              rewards, and benefits by becoming a VIP member!
            </p>
            <p className="text-md mb-2">As a VIP member, you&apos;ll enjoy:</p>
            <ul className="mb-4 list-inside list-disc">
              <li>30% luck boost</li>
              <li>2x faster generation</li>
              <li>2x faster ascension</li>
              <li>30 inventory space instead of 10</li>
              <li>Exclusive access to special content</li>
              <li>Early access to new game features</li>
              <li>Unique in-game items and boosts (Coming Soon)</li>
            </ul>
            <p className="text-md mb-4">
              This membership will be managed securely by Patreon for just
              $4/month or €3.75/month. It will be our only way of making profit
              to keep running Cored for free for everyone!
            </p>
            <a
              href="https://www.patreon.com/coredinc/membership"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full font-bold",
              )}
            >
              Become a VIP Member on Patreon
            </a>
          </div>
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-center text-4xl font-bold">
          Thank you for being a VIP member!
        </h1>

        <p className="m-4 text-lg">
          We appreciate your support! As a VIP member, you already enjoy all the
          exclusive perks:
        </p>
        <ul className="mb-4 list-inside list-disc text-left">
          <li>30% luck boost</li>
          <li>2x faster generation</li>
          <li>2x faster ascension</li>
          <li>30 inventory space instead of 10</li>
          <li>Exclusive access to special content</li>
          <li>Early access to new game features</li>
          <li>Unique in-game items and boosts</li>
          <li>Participation in VIP-only events</li>
        </ul>
      </div>
    </Layout>
  );
}
