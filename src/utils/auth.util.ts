import type { RegisterPayload } from "@/types/user.type";
import { authClient } from "@/lib/auth-client";

export type AuthResult =
  | { ok: true; role: string }
  | { ok: false; message: string };

// Register: backend er better-auth e user create kore
export const register = async (data: RegisterPayload): Promise<AuthResult> => {
  const { confirmPassword: _confirm, userId: _userId, ...rest } = data;

  const { data: res, error } = await authClient.signUp.email({
    ...rest,
    email: rest.email.trim().toLowerCase(),
    name: `${rest.firstName} ${rest.lastName}`, // better-auth e name required
  });

  if (error || !res) {
    return { ok: false, message: error?.message || "Registration failed." };
  }
  return { ok: true, role: (res.user as { role?: string }).role ?? "user" };
};

// Login: backend er better-auth diye sign in
export const login = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const { data: res, error } = await authClient.signIn.email({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !res) {
    return { ok: false, message: error?.message || "Invalid email or password." };
  }
  return { ok: true, role: (res.user as { role?: string }).role ?? "user" };
};

// Logout: better-auth session clear kore
export const logout = async (): Promise<void> => {
  await authClient.signOut();
};