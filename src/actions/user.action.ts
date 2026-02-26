"use server";

import { userServices } from "@/services/user.service";



export const updateUser = async (id: string, userData:any) => {
  // console.log("[updateTutor] Updating tutor for user:", id);
  const result = await userServices.updateUser(id, userData);
    if (result?.error) {
    throw new Error(result.error.message || "Failed to update tutor");
  }
 
  return result; // { data, error }
};


export const getAllUsers = async () =>{
  const result = await userServices.getAllUser();
      if (result?.error) {
    throw new Error(result.error.message || "Failed to update tutor");
  }
 
  return result; // { data, error }

}