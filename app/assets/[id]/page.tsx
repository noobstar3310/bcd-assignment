"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit, Send, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { getAssetById, getAllUsers, type Asset } from "@/lib/contracts";

export default function AssetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const connected = accounts.length > 0;
        const account = accounts[0] || null;
        setIsConnected(connected);
        setCurrentAccount(account);
        if (connected && account) {
          checkAuthorization(account);
        } else {
          setCheckingAuth(false);
        }
      }
    };
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        const connected = accounts.length > 0;
        const account = accounts[0] || null;
        setIsConnected(connected);
        setCurrentAccount(account);
        if (connected && account) {
          checkAuthorization(account);
        } else {
          setIsAuthorized(false);
          setCheckingAuth(false);
        }
      });
    }
  }, []);

  const checkAuthorization = async (account: string) => {
    try {
      setCheckingAuth(true);
      const users = await getAllUsers();
      const isUserAuthorized = users.some(
        (user) => user.walletAddress.toLowerCase() === account.toLowerCase()
      );
      setIsAuthorized(isUserAuthorized);
      if (isUserAuthorized) {
        fetchAsset();
      }
    } catch (error) {
      console.error("Error checking authorization:", error);
      setIsAuthorized(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsConnected(true);
        setCurrentAccount(account);
        checkAuthorization(account);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchAsset = async () => {
    setLoading(true);
    try {
      const assetData = await getAssetById(params.id);
      setAsset(assetData);
    } catch (error) {
      console.error("Error fetching asset:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto py-32 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Connect Your Wallet
        </h1>
        <p className="text-muted-foreground mb-8">
          Please connect your wallet to view asset details
        </p>
        <Button onClick={connectWallet} size="lg">
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="container mx-auto py-32 text-center">
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-32 text-center space-y-4">
        <div className="flex justify-center mb-8">
          <div className="bg-destructive/10 text-destructive p-4 rounded-full">
            <ShieldAlert className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Access Denied
        </h1>
        <p className="text-muted-foreground">
          You are not authorized to view asset details.
          <br />
          Please contact an administrator to get access.
        </p>
        <p className="text-sm text-muted-foreground mt-8">
          Connected wallet: {currentAccount}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-32 text-center">
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto py-32 text-center">
        <p>Asset not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Asset Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{asset.name}</CardTitle>
                <CardDescription>Asset ID: {asset.id}</CardDescription>
              </div>
              <StatusBadge status={asset.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Asset Type
                </h3>
                <p>{asset.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Current Location
                </h3>
                <p>{asset.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Distance Traveled
                </h3>
                <p>{asset.distance}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </h3>
                <p>
                  {new Date(asset.lastUpdatedTimeStamp * 1000).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p>{asset.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/assets/${asset.id}/update`} className="flex-1">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </Link>
              <Link href={`/assets/${asset.id}/transfer`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Transfer Ownership
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h3>
                  <p className="font-mono text-sm break-all">{asset.sender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Address
                  </h3>
                  <p className="font-mono text-sm break-all">
                    {asset.recipient}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Name
                  </h3>
                  <p>{asset.recipientName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
