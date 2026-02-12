"use server"

import { categoryServices } from "@/services/category.service";


export const getCategories = async () => {
  return await categoryServices.getAllCategories();
};