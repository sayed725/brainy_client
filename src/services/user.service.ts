// lib/user-services.ts  (or app/lib/session.ts)
import { updateUser } from "better-auth/api";
import { cookies } from "next/headers";

type SessionResponse = {
  user?: { id: string; email: string; name?: string; role?: string /* add your fields */ };
  session?: { id: string; expiresAt: string /* etc. */ };
  // or whatever shape your /get-session returns
};

type ApiResult<T> = {
  data: T | null;
  error: { message: string; status?: number } | null;
};

export const userServices = {
  async getSession(): Promise<ApiResult<SessionResponse>> {
    try {
      const cookieStore = await cookies(); // await the Promise returned by cookies()

      const authUrl = process.env.AUTH_URL;
      if (!authUrl) {
        throw new Error("AUTH_URL environment variable is not set");
      }

      const res = await fetch(`${authUrl}/get-session`, {
        method: "GET",
        headers: {
          // Forward ALL cookies safely (better than .toString() in some edge cases)
          Cookie: cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
          Accept: "application/json",
        },
        cache: "no-store", // critical for session data
        // credentials: "include" is NOT needed here since we're manually forwarding Cookie
      });

      if (!res.ok) {
        let errorBody;
        try {
          errorBody = await res.json();
        } catch {}
        return {
          data: null,
          error: {
            message: errorBody?.message || `Session fetch failed (${res.status})`,
            status: res.status,
          },
        };
      }

      const session: SessionResponse | null = await res.json();

      if (!session || !session.user) {
        return {
          data: null,
          error: { message: "No active session found" },
        };
      }

      return { data: session, error: null };
    } catch (err: any) {
      console.error("[getSession] Failed:", err);
      return {
        data: null,
        error: {
          message: err.message || "Failed to retrieve session",
        },
      };
    }
  },


  updateUser: async (id: string, userData: any) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(userData),
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
            message: data?.error?.message || data?.message || "Failed to update user",
            status: res.status,
          },
        };
      }

      return {
        data: data?.data || data,
        error: null,
      };
    } catch (err: any) {
      console.error("[updateUser]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },


   getAllUser: async () => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${process.env.BACKEND_URL}/api/v1/user`, {
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
            message: data?.error?.message || data?.message || "Failed to fetch users",
            status: res.status,
          },
        };
      }

      return {
        data: data?.data || data,
        error: null,
      };
    } catch (err: any) {
      console.error("[fetchusers]", err);
      return {
        data: null,
        error: { message: err.message || "Network or server error" },
      };
    }
  },

  

};




