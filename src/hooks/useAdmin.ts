import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { AdminDashboardData } from "@/constants/otherinterface";

const extractData = (result: any): any => {
  return result?.data?.data || result?.data || result;
};

export function useAdminData() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const result = await fetchApi("/api/v1/admin/allCollection");
      return extractData(result) as AdminDashboardData;
    },
  });
}
