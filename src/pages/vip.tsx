import React from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Zap,
  Box,
  Crown,
  Rocket,
  Star,
  Clock,
  Lock,
} from "lucide-react";
import { api } from "@/utils/api";
import { Badge } from "@/components/ui/badge";

const VIPFeature = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) => (
  <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/50 p-3 items-center">
    <Icon className="h-5 w-5 text-purple-500" />
    <div>
      <p className="font-semibold">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
);

export default function Membership() {
  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (isLoading) return <Layout isLoading />;

  return (
    <Layout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {data && !data.vip ? (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                Exclusive Benefits
              </Badge>
              <h1 className="mb-3 text-4xl font-bold">Unlock VIP Membership</h1>
              <p className="text-lg text-muted-foreground">
                Join our community of Bladesmiths and experience
                BladeForge like never before
              </p>
            </div>

            {/* Main Card */}
            <Card className="border-purple-500/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl">VIP Benefits</span>
                  <Badge variant="default" className="bg-purple-500">
                    Only $4/mo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <VIPFeature
                    icon={Zap}
                    title="30% Luck Boost"
                    description="Increase your chances of rare finds"
                  />
                  <VIPFeature
                    icon={Clock}
                    title="2x Faster Generation"
                    description="Create swords twice as fast"
                  />
                  <VIPFeature
                    icon={Rocket}
                    title="2x Faster Ascension"
                    description="Progress through ranks quicker"
                  />
                  <VIPFeature
                    icon={Box}
                    title="30 Inventory Slots"
                    description="Triple the standard inventory space"
                  />
                  <VIPFeature
                    icon={Crown}
                    title="Early Access"
                    description="Be the first to try new features"
                  />
                  <VIPFeature
                    icon={Star}
                    title="Exclusive Content"
                    description="Access special items and events"
                  />
                </div>

                {/* Call to Action */}
                <div className="mt-8 space-y-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Membership is managed securely through Patreon. Your support
                    helps keep BladeForge free for everyone!
                  </p>
                  <a
                    href="https://www.patreon.com/coredinc/membership"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="w-full gap-2 bg-purple-500 font-semibold hover:bg-purple-600"
                    >
                      <Lock className="h-4 w-4" />
                      Become a VIP Member
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // VIP Member View
          <Card className="border-purple-500/20 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="mx-auto mb-4 w-fit">
                <Crown className="mr-1 h-3 w-3" />
                VIP Member
              </Badge>
              <CardTitle className="text-3xl">
                Thank You for Your Support!
              </CardTitle>
              <p className="text-muted-foreground">
                You&apos;re enjoying all the exclusive VIP benefits
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <VIPFeature icon={Zap} title="30% Luck Boost" />
                <VIPFeature icon={Clock} title="2x Faster Generation" />
                <VIPFeature icon={Rocket} title="2x Faster Ascension" />
                <VIPFeature icon={Box} title="30 Inventory Slots" />
                <VIPFeature icon={Crown} title="Early Access" />
                <VIPFeature icon={Star} title="Exclusive Content" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
