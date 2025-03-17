"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface NavbarProps {
  isConnected: boolean;
  currentAccount: string | null;
  onConnect: () => void;
}

const ADMIN_ADDRESS =
  "0x687D70b3E77889689951208F2DB2B2B4927DBf05".toLowerCase();

export function Navbar({
  isConnected,
  currentAccount,
  onConnect,
}: NavbarProps) {
  const isAdmin = currentAccount?.toLowerCase() === ADMIN_ADDRESS;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            AssetTrack
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-foreground/80 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/assets/new"
                  className="text-sm font-medium hover:text-foreground/80 transition-colors"
                >
                  Add Asset
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium hover:text-foreground/80 transition-colors"
                  >
                    Admin
                  </Link>
                )}

            {/* Connect Wallet Button */}
            <Button
              variant={isConnected ? "outline" : "default"}
              onClick={onConnect}
              className="h-9"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnected ? (
                <span>
                  {currentAccount?.slice(0, 6)}...{currentAccount?.slice(-4)}
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
