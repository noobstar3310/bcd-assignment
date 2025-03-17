"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "../../../../hooks/use-toast";
import {
  getAssetById,
  getAllUsers,
  updateAssetStatus,
  type Asset,
} from "@/lib/contracts";

const formSchema = z.object({
  status: z.string().min(1, {
    message: "Please select a status.",
  }),
});

export default function UpdateAssetStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      form.setValue("status", assetData.status);
    } catch (error) {
      console.error("Error fetching asset:", error);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await updateAssetStatus(params.id, values.status);
      toast({
        title: "Status updated",
        description: `Asset status has been updated to ${values.status}.`,
      });
      router.push(`/assets/${params.id}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update asset status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-32 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Connect Your Wallet
        </h1>
        <p className="text-muted-foreground mb-8">
          Please connect your wallet to update asset status
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
          You are not authorized to update asset status.
          <br />
          Please contact an administrator to get access.
        </p>
        <p className="text-sm text-muted-foreground mt-8">
          Connected wallet: {currentAccount}
        </p>
      </div>
    );
  }

  if (loading || !asset) {
    return (
      <div className="container mx-auto py-32 text-center">
        <p>Loading asset details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/assets/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Update Asset Status
        </h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Update Status for {asset.name}</CardTitle>
          <CardDescription>
            Change the current status of this asset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="delivering">Delivering</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status: {asset.status}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Link href={`/assets/${params.id}`}>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
