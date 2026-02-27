import { cookies } from "next/headers";




export interface CategoryInput {
   name :  string;
  slug?  : string;
}
export const categoryServices = {
  getAllCategories: async function () {
    try {
      const res = await fetch(`${process.env.API_URL}/api/v1/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      return { data: data.data, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  createCategory: async (data: CategoryInput) => {
      try {
        const cookieStore = await cookies();
  
        const res = await fetch(`${process.env.API_URL}/api/v1/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
          },
          body: JSON.stringify(data),
          credentials: "include",
          cache: "no-store",
        });
  
        let responseData;
        try {
          responseData = await res.json();
        } catch {
          responseData = null;
        }
        if (!res.ok) {
          return {
            data: null,
            error: {
              message:
                responseData?.error?.message ||
                responseData?.message ||
                "Failed to create category",
              status: res.status,
            },
          };
        }
  
        return {
          data: responseData?.data || responseData,
          error: null,
        };
      } catch (err: any) {
        console.error("[createCategory]", err);
        return {
          data: null,
          error: { message: err.message || "Network or server error" },
        };
      }
    },

    deleteCategory: async (categoryId: number) => {
        const cookieStore = await cookies();
        try {
          const res = await fetch(
            `${process.env.BACKEND_URL}/api/v1/categories/${categoryId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
              },
              credentials: "include", // Ensure cookies are sent
              cache: "no-store", // Always fetch fresh data
            },
          );
    
          if (!res.ok) {
            const errorData = await res.json();
            return { error: { message: errorData?.message || "Failed to delete" } };
          }
          const data = await res.json();
    
          return { data: data, error: null };
        } catch (err: any) {
          return { error: { message: err.message || "Network or server error" } };
        }
      },

  
    
};
