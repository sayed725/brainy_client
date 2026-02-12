import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.API_URL || "http://localhost:5001",
      plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string", required: false },
        status: { type: "string", required: false },
      },
    }),
  ],
})