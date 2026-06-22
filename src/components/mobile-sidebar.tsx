"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/utils/utils";
import { useUser } from "@/contexts/user-context";
import { publicLinks, privateLinks } from "@/config/nav-links";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileSidebar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Helper to normalize paths
  const normalize = (path: string) => path.replace(/\/+$/, "");

  const navLinks = user ? privateLinks : publicLinks;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link
              href="/"
              className="block no-underline"
              aria-label="TwoTales home"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo-lockup.svg"
                alt="TwoTales"
                width={160}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-8">
          {navLinks.map((link) => {
            const isActive =
              normalize(pathname) === normalize(link.href) ||
              normalize(pathname).startsWith(normalize(link.href) + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-ink-700 hover:bg-secondary hover:text-accent",
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
