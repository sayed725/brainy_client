"use server";

import { categoryServices } from "@/services/category.service";

export interface CategoryInput {
  name: string;
  slug?: string;
}

export const getCategories = async () => {
  return await categoryServices.getAllCategories();
};

export const createCategory = async (data: CategoryInput) => {
  const result = await categoryServices.createCategory(data);

  if (result?.error) {
    throw new Error(result.error.message || "Failed to create Category");
  }

  return result; // { data, error }
};

export async function deleteCategory(categoryId: number) {
  const result = await categoryServices.deleteCategory(categoryId);
  if (result?.error) {
    throw new Error(result.error.message || "Failed to delete Category");
  }

  return result;
}
