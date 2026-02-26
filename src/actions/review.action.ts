"use server"

import { ReviewInput, reviewServices } from "@/services/review.service";



export const addReview = async (data: ReviewInput) => {
 
  const result = await reviewServices.createReview(data);
    if (result?.error) {
    throw new Error(result.error.message || "Failed to create review");
  }
 
  return result; // { data, error }
};
export const getAllReview = async () => {
 
  const result = await reviewServices.getAllReviews();
    if (result?.error) {
    throw new Error(result.error.message || "Failed to create review");
  }
 
  return result; // { data, error }
};