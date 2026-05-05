"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import FeatureCategoryClient from "./FeatureCategoryClient";

const FeatureCategory = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["featureCategories"],
    queryFn: async () => {
      const result = await fetchApi<any>("/api/v1/categories", {
        params: { 
          limit: 50, 
          sortBy: "id", 
          sortOrder: "asc",
          isActive: true 
        }
      });
      // Extract data based on the structure we've seen
      const data = result?.data?.data || result?.data || result;
      return Array.isArray(data) ? data : [];
    }
  });

  return <FeatureCategoryClient categories={categories || []} isLoading={isLoading} />;
};

export default FeatureCategory;
