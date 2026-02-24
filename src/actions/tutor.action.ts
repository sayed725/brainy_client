"use server";

import { tutorServices, TutorUpdateInput } from "@/services/tutor.service";
import { updateTag } from "next/cache";

export const addTutor = async (tutorData: TutorUpdateInput) => {
  console.log("[addTutor] Creating tutor for user:", tutorData.userId);
  const result = await tutorServices.createTutor(tutorData);
   updateTag("createTutor")
  return result; // { data, error }
};


export const getTutorByUserId = async (id: string) => {
  
  const result =  await tutorServices.getTutorByUserid(id);
  // updateTag("getBookings")
  return result; // { data, error }

};

