import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Menu, Swords } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  const links = [
    { title: "Home", href: "/" },
    { title: "Forge", href: "/forge" },
    { title: "Blades", href: "/blades" },
    { title: "Chances", href: "/chances" },
    { title: "Profile", href: "/profile" },
    { title: "Leaderboards", href: "/leaderboards" },
  ];

  const { status, data: session } = useSession();

  return (
    <nav className="container mx-auto mb-10 flex items-center justify-between p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open Menu"
            size="icon"
            variant="outline"
            className="lg:hidden"
          >
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map((link) => (
            <DropdownMenuItem key={link.title} asChild>
              <Link href={link.href}>{link.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/" className="flex items-center text-xl font-bold">
        <Swords className="mr-2 fill-white" />
        BladeForge
      </Link>
      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.title}>
              <Link href={link.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {link.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {status === "authenticated" && session.user.name && !isLoading ? (
        <div className="flex items-center gap-x-2">
          {user?.vip && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <p className="hidden lg:block rounded-full bg-gradient-to-br from-yellow-300 to-yellow-800 px-3 py-1 text-xs font-bold text-black">
                  VIP
                </p>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-gradient-to-br from-yellow-600 to-yellow-900">
                <div className="space-y-1">
                  <ul className="space-y-1.5 text-sm text-foreground/80">
                    <li>
                      <strong className="font-semibold text-white">
                        25% Luck Boost:
                      </strong>{" "}
                      Increase your chances of forging rare and powerful swords.
                    </li>
                    <li>
                      <strong className="font-semibold text-white">
                        50% Faster Ascension Speed:
                      </strong>{" "}
                      Climb the ranks faster and show off your skills.
                    </li>
                    <li>
                      <strong className="font-semibold text-white">
                        20 Extra Sword Storage Slots:
                      </strong>{" "}
                      Keep more of your best creations!
                    </li>
                    <li>
                      <strong className="font-semibold text-white">
                        Special VIP Nametag:
                      </strong>{" "}
                      Stand out on the leaderboard and your profile with a
                      unique badge.
                    </li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={session.user.image!} />
                <AvatarFallback>{session.user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>@{session.user.name}</DropdownMenuLabel>{" "}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link className="text-red-500" href="/api/auth/signout">
                  Sign Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button onClick={() => signIn("discord")}>Sign In</Button>
      )}
    </nav>
  );
}
