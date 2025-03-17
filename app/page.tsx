"use client";

import { useEffect, useState } from "react";
import { AssetTable } from "@/components/asset-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllAssets } from "@/lib/contracts";
import type { Asset } from "@/lib/contracts";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setIsConnected(accounts.length > 0);
        setCurrentAccount(accounts[0] || null);
        if (accounts.length > 0) {
          fetchAssets();
        }
      }
    };
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setIsConnected(accounts.length > 0);
        setCurrentAccount(accounts[0] || null);
        if (accounts.length > 0) {
          fetchAssets();
        }
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsConnected(true);
        setCurrentAccount(accounts[0]);
        fetchAssets();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const assetData = await getAllAssets();
      setAssets(assetData);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <main>
        {!isConnected ? (
          <div className="container mx-auto py-32 text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight mb-8">
              Welcome to Asset Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
              Please connect your wallet to view assets
            </p>
            <Button onClick={connectWallet} size="lg">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">
                Asset Dashboard
              </h1>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">Loading assets...</div>
                ) : (
                  <AssetTable assets={assets} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
