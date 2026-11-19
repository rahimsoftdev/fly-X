import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        address: { type: "string" },
        zipCode: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        phone: { type: "string" },
      },
    }),
  ],
});