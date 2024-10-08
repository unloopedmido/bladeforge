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

export default function Navbar() {
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
    <nav className="mb-10 container mx-auto flex items-center justify-between p-3">
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
      <Link href="/" className="text-xl font-bold flex items-center">
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
      {status === "authenticated" ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={session.user.image!} />
                <AvatarFallback>{session.user.name![0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
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
