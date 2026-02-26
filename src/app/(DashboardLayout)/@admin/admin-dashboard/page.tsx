"use client"

import { getAllUsers } from "@/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";





export default function AdminDashboard() {
    const { data: session, isPending: isSessionLoading } =
      authClient.useSession();
  const [allUser, setAllUser] =  useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



const userId = session?.user?.id;

  const refreshUsers = async () => {
    if (!userId) return;

    try {
      const result = await getAllUsers();
      if (result.error) {
        throw new Error(result.error || "Failed to load users");
      }
      setAllUser(result.data?.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to refresh users");
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshUsers();
    }
  }, [userId]);

  console.log(allUser);











  return (
    <div>
      <h1> Admin Dashboard </h1>
    </div>
  );
}