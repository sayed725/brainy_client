import { z } from "zod";
export const loginSchema = z.object({
    email : z.string("Email is required").email("Invalid email"),
    password : z.string( "Password is required").min(6,"Must be at least 6 character"),
})