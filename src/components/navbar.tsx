import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { Crown, Menu, Swords } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  const { data, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  const { status, data: session } = useSession();

  const links = [
    { title: "Home", href: "/" },
    { title: "Forge", href: "/forge", auth: true },
    { title: "Blades", href: "/blades", auth: true },
    { title: "Chances", href: "/chances", auth: true },
    { title: "Leaderboards", href: "/leaderboards" },
  ];

  const isAuthenticated = status === "authenticated";

  return (
    <nav className="container mx-auto mb-10 flex items-center justify-between p-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label="Open Menu"
            size="icon"
            variant="outline"
            className="lg:hidden"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-2 text-purple-400">
                <Swords className="fill-purple-500" />
                BladeForge
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-2">
            {links.map(
              (link) =>
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="w-full rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.title}
                  </Link>
                ),
            )}
            {isAuthenticated && (
              <Link
                href={`/profiles/${user?.id}`}
                className="w-full rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                Profile
              </Link>
            )}
            {isAuthenticated && !user?.vip && (
              <Link
                href="/vip"
                className="w-full rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
              >
                VIP
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center text-xl font-bold text-purple-400">
        <Swords className="mr-2 fill-purple-500" />
        BladeForge
      </Link>
      <NavigationMenu className="hidden lg:block">
        <NavigationMenuList>
          {links.map(
            (link) =>
              (!link.auth || isAuthenticated) && (
                <NavigationMenuItem key={link.title}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {link.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ),
          )}
          {isAuthenticated && (
            <NavigationMenuItem>
              <Link href={`/profiles/${user?.id}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
          {isAuthenticated && !user?.vip && (
            <Link href="/vip" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                VIP
              </NavigationMenuLink>
            </Link>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      {isAuthenticated && session.user.name && !isLoading ? (
        <div className="flex items-center gap-x-2">
          {user?.vip && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="hidden cursor-pointer items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-3 py-1 text-xs font-semibold text-white lg:flex">
                  <Crown className="h-3 w-3" />
                  <span>VIP</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">VIP Benefits</h4>
                  <ul className="text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      30% Luck Boost
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      Halved Speeds
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      20 Extra Slots
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span>
                      Special Badge
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
              <DropdownMenuLabel>@{session.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/profiles/${user?.id}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/vip`}>Membership</Link>
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
