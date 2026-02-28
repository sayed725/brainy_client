import { cookies } from "next/headers";

export const adminServices = {

    getallAdminStats: async () => {
        try {
          const cookieStore = await cookies();
    
          const res = await fetch(`${process.env.BACKEND_URL}/api/v1/admin/allCollection`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: cookieStore.toString(),
            },
            credentials: "include",
            cache: "no-store",
          });
    
          let data;
          try {
            data = await res.json();
          } catch {
            data = null;
          } 
          if (!res.ok) {
            return {
              data: null,
              error: {
                message: data?.error?.message || data?.message || "Failed to fetch adminData",
                status: res.status,
              },
            };
          }
    
          return {
            data: data?.data || data,
            error: null,
          };
        } catch (err: any) {
          console.error("[fetchadminData]", err);
          return {
            data: null,
            error: { message: err.message || "Network or server error" },
          };
        }
      },

};