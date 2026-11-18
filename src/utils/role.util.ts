import { getCurrentUser } from "./auth.util";

export const checkUserRole = (role: string): void => {
  const user = getCurrentUser();

  if (!user || user.role !== role) {
    window.location.href = "/login";
  }
};