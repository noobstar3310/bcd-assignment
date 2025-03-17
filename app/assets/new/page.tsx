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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "../../../hooks/use-toast";
import { createAsset, getAllUsers } from "@/lib/contracts";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Asset name must be at least 2 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select an asset type.",
  }),
  description: z.string().min(1, {
    message: "Please provide a description.",
  }),
  recipientAddress: z.string().min(42, {
    message: "Please enter a valid Ethereum address (42 characters).",
  }),
  recipientName: z.string().min(2, {
    message: "Recipient name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  status: z.string().min(1, {
    message: "Please select an initial status.",
  }),
  distance: z.string().min(1, {
    message: "Please enter the initial distance.",
  }),
});

export default function NewAssetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      recipientAddress: "",
      recipientName: "",
      location: "",
      status: "pending",
      distance: "0",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      await createAsset({
        recipientAddress: values.recipientAddress,
        recipientName: values.recipientName,
        name: values.name,
        description: values.description,
        type: values.type,
        location: values.location,
        status: values.status,
        distance: values.distance,
      });

      toast({
        title: "Asset created",
        description: "Your new asset has been created successfully.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
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
          Please connect your wallet to add new assets
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
          You are not authorized to create new assets.
          <br />
          Please contact an administrator to get access.
        </p>
        <p className="text-sm text-muted-foreground mt-8">
          Connected wallet: {currentAccount}
        </p>
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
        <h1 className="text-3xl font-bold tracking-tight">Add New Asset</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
          <CardDescription>
            Enter the details of the new asset you want to track.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Medical Supplies" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the asset being tracked.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="perishable">Perishable</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category of the asset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, USA" {...field} />
                      </FormControl>
                      <FormDescription>
                        The current location of the asset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Distance</FormLabel>
                      <FormControl>
                        <Input placeholder="0" type="text" {...field} />
                      </FormControl>
                      <FormDescription>
                        The initial distance traveled by the asset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
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
                        The initial status of the asset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the asset..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional details about the asset.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  Recipient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="recipientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0xabcd...efgh" {...field} />
                        </FormControl>
                        <FormDescription>
                          The blockchain address of the recipient.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Regional Clinic" {...field} />
                        </FormControl>
                        <FormDescription>
                          The name of the recipient.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Asset"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
