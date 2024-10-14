import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpCircle,
  ChevronsUp,
  Flame,
  Info,
  Sword,
  Trophy,
  Zap,
} from "lucide-react";
import { cloneElement, type ReactNode } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import WordPullUp from "@/components/ui/word-pull-up";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  return (
      <div className="px-3">
        <header className="container mx-auto mb-32 mt-44 text-center xl:mb-60">
          <h1 className="mb-4 text-4xl font-bold leading-[1.2] sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              BladeForge
            </span> - Your Idle Factory
          </h1>
          <WordPullUp
            className="mb-8 text-xl sm:text-2xl"
            words="Forge your destiny, one blade at a time"
          />
          <Button
            onClick={async () => {
              if (status === "authenticated") {
                await router.push("/forge");
              } else {
                await signIn("discord");
              }
            }}
            className="w-36"
          >
            <Flame className="mr-2 h-5 w-5" />
            Start Forging
          </Button>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "ml-4 w-36",
            )}
          >
            <Info className="mr-2 h-5 w-5" />
            Learn More
          </Link>
        </header>
        <section className="container mx-auto px-16 pb-5">
          <div className="relative">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {[
                  {
                    title: "Unique Blades",
                    description:
                      "Forge extraordinary swords with diverse qualities, rarities, materials, and auras. Each blade is a unique masterpiece of your craftsmanship.",
                    icon: <Sword />,
                  },
                  {
                    title: "Ascend & Upgrade",
                    description:
                      "Use the Ascender to enhance stats of your blades. Unlock new potential and transform your weapons into legendary blades.",
                    icon: <ArrowUpCircle />,
                  },
                  {
                    title: "Dominate the Leaderboards",
                    description:
                      "Compete with players to showcase your bladesmithing prowess. Climb the ranks and earn recognition as a master of the forge.",
                    icon: <Trophy />,
                  },
                  {
                    title: "Aura System",
                    description:
                      "Imbue your blades with mystical auras like Flame, Frost, and Storm. These rare enhancements boost your blade's power and worth.",
                    icon: <Zap />,
                  },
                  {
                    title: "Machine Upgrades",
                    description:
                      "Invest in machines to enhance your bladesmithing. Improve rarities, qualities, and materials to forge increasingly powerful swords.",
                    icon: <ChevronsUp />,
                  },
                ].map((feature, index) => (
                  <CarouselItem
                    key={index}
                    className="sm:basis-1/2 lg:basis-1/3"
                  >
                    <Feature
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <CarouselPrevious />
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </section>
      </div>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <Card className="flex h-full flex-col bg-foreground/10 transition-all hover:shadow-lg">
      <CardHeader className="flex flex-grow flex-col justify-between">
        <div>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              {cloneElement(icon as React.ReactElement, {
                className: "w-6 h-6 text-primary",
              })}
            </div>
          </div>
          <CardTitle className="text-center">{title}</CardTitle>
        </div>
        <CardDescription className="text-center text-sm">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
