"use server"

import { adminServices } from "@/services/admin.service";






export const getallAdminData = async () =>{
  const result = await adminServices.getallAdminStats();

//   console.log(result)
      if (result?.error) {
    throw new Error(result.error.message || "Failed to fetch getAdminData");
  }
 
  return result; // { data, error }

}