"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, UserPlus, X, ShieldAlert } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "../../hooks/use-toast";
import {
  getAllUsers,
  authorizeUser,
  revokeUser,
  type User,
} from "@/lib/contracts";

const formSchema = z.object({
  address: z.string().min(42, {
    message: "Please enter a valid Ethereum address (42 characters).",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const ADMIN_ADDRESS =
  "0x687D70b3E77889689951208F2DB2B2B4927DBf05".toLowerCase();

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
        setIsAdmin(account?.toLowerCase() === ADMIN_ADDRESS);
        if (connected && account?.toLowerCase() === ADMIN_ADDRESS) {
          fetchUsers();
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
        setIsAdmin(account?.toLowerCase() === ADMIN_ADDRESS);
        if (connected && account?.toLowerCase() === ADMIN_ADDRESS) {
          fetchUsers();
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
        const account = accounts[0];
        setIsConnected(true);
        setCurrentAccount(account);
        setIsAdmin(account.toLowerCase() === ADMIN_ADDRESS);
        if (account.toLowerCase() === ADMIN_ADDRESS) {
          fetchUsers();
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await authorizeUser(values.address, values.name);
      form.reset();
      fetchUsers();
      toast({
        title: "User authorized",
        description: `User ${values.name} has been authorized successfully.`,
      });
    } catch (error) {
      console.error("Error authorizing user:", error);
      toast({
        title: "Error",
        description: "Failed to authorize user. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleRevokeAccess(walletAddress: string) {
    try {
      if (walletAddress.toLowerCase() === ADMIN_ADDRESS) {
        toast({
          title: "Error",
          description: "Cannot revoke access from the admin account.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      await revokeUser(walletAddress);
      setUserToDelete(null);

      // Refresh the user list
      await fetchUsers();

      toast({
        title: "Access revoked",
        description: "User's access has been revoked successfully.",
      });
    } catch (error: any) {
      console.error("Error revoking user:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to revoke user access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      {!isConnected ? (
        <div className="text-center py-32 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Connect Your Wallet
          </h1>
          <p className="text-muted-foreground mb-8">
            Please connect your wallet to access the admin panel
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </div>
      ) : !isAdmin ? (
        <div className="text-center py-32 space-y-4">
          <div className="flex justify-center mb-8">
            <div className="bg-destructive/10 text-destructive p-4 rounded-full">
              <ShieldAlert className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You do not have permission to access the admin panel.
            <br />
            Please connect with an admin wallet to continue.
          </p>
          <p className="text-sm text-muted-foreground mt-8">
            Connected wallet: {currentAccount}
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Authorized Users</CardTitle>
                <CardDescription>
                  Manage users who have access to the asset tracking system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
                      <div className="col-span-5">User</div>
                      <div className="col-span-3">Date Added</div>
                      <div className="col-span-1"></div>
                    </div>

                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Loading users...
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No users found.
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center text-sm"
                        >
                          <div className="col-span-5">
                            <div>{user.userName}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {user.walletAddress}
                            </div>
                          </div>
                          <div className="col-span-3">
                            {new Date(
                              user.dateAdded * 1000
                            ).toLocaleDateString()}
                          </div>
                          <div className="col-span-1 text-right">
                            <AlertDialog
                              open={userToDelete === user.walletAddress}
                              onOpenChange={(open) =>
                                !open && setUserToDelete(null)
                              }
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setUserToDelete(user.walletAddress)
                                  }
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Revoke access</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Revoke User Access
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to revoke access for{" "}
                                    {user.userName}? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRevokeAccess(user.walletAddress)
                                    }
                                  >
                                    Revoke Access
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>
                  Authorize a new user to access the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Address</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormDescription>
                            The blockchain address of the user.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the user.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Authorize User
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
