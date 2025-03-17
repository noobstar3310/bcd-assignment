"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/wallet-connect";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Add Asset", href: "/assets/new" },
  { name: "Admin", href: "/admin" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    // <nav className="flex items-center space-x-4 lg:space-x-6">
    //   <Link href="/" className="text-xl font-bold">
    //     AssetTrack
    //   </Link>
    //   <div className="ml-10 flex items-center space-x-4 lg:space-x-6">
    //     {navItems.map((item) => (
    //       <Link
    //         key={item.href}
    //         href={item.href}
    //         className={cn(
    //           "text-sm font-medium transition-colors hover:text-primary",
    //           pathname === item.href
    //             ? "text-foreground"
    //             : "text-muted-foreground"
    //         )}
    //       >
    //         {item.name}
    //       </Link>
    //     ))}
    //   </div>
    // </nav>
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4 lg:space-x-6">
        <Link href="/" className="text-xl font-bold">
          AssetTrack
        </Link>
        <div className="ml-10 flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <WalletConnect />
    </nav>
  );
}
