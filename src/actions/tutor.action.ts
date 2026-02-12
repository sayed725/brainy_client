"use server";

import { tutorServices, TutorUpdateInput } from "@/services/tutor.service";
import { updateTag } from "next/cache";

export const addTutor = async (tutorData: TutorUpdateInput) => {
  console.log("[addTutor] Creating tutor for user:", tutorData.userId);
  const result = await tutorServices.createTutor(tutorData);
   updateTag("createTutor")
  return result; // { data, error }
};
