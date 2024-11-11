import Link from "next/link";
import { Swords } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <Link 
    href={href} 
    className="text-muted-foreground hover:text-purple-400 transition-colors"
  >
    {children}
  </Link>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto py-6 px-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-purple-400">
              <Swords className="fill-purple-500 h-5 w-5" />
              <span className="font-semibold">BladeForge</span>
            </Link>
            <Separator orientation="vertical" className="h-4 mx-2 hidden md:block" />
            <span className="text-sm text-muted-foreground">
              © {currentYear} Cored Developments
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
            <FooterLink href="https://discord.gg/cored">Discord</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}