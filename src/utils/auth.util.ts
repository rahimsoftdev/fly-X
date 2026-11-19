import type { IUser, RegisterPayload } from "@/types/user.type";
import { authClient } from "@/lib/auth-client";

const USERS_KEY = "raven_users"; // old local users list (login er jonno ekhono lage)
const AUTH_KEY = "raven_auth_user"; // logged in user

// 3 demo accounts, role is decided by email
const demoUsers: IUser[] = [
  {
    firstName: "Admin", lastName: "Raven", address: "100 Park Avenue",
    zipCode: "10017", city: "New York", state: "NY", phone: "+1 212 555 0100",
    email: "admin1234@gmail.com", password: "admin1234", role: "admin", userId: 1,
  },
  {
    firstName: "Sophia", lastName: "Reed", address: "55 Madison Avenue",
    zipCode: "10010", city: "New York", state: "NY", phone: "+1 212 555 0155",
    email: "staff1234@gmail.com", password: "staff1234", role: "staff", userId: 2,
  },
  {
    firstName: "Daniel", lastName: "Carter", address: "22 Bayshore Boulevard",
    zipCode: "33606", city: "Tampa", state: "FL", phone: "+1 813 555 0122",
    email: "user1234@gmail.com", password: "user1234", role: "user", userId: 3,
  },
];

// Read registered users from localStorage
const getUsers = (): IUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

// Login: check demo accounts + registered users, save user in localStorage
export const login = (email: string, password: string): IUser | null => {
  const found = [...demoUsers, ...getUsers()].find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );
  if (!found) return null;

  localStorage.setItem(AUTH_KEY, JSON.stringify(found));
  return found;
};

export type RegisterResult =
  | { ok: true; role: string }
  | { ok: false; message: string };

// Register: backend er better-auth e user create kore
export const register = async (
  data: RegisterPayload,
): Promise<RegisterResult> => {
  const { confirmPassword: _confirm, userId: _userId, ...rest } = data;
  const email = rest.email.trim().toLowerCase();

  const { data: res, error } = await authClient.signUp.email({
    ...rest,
    email,
    name: `${rest.firstName} ${rest.lastName}`, // better-auth e name required
  });

  if (error || !res) {
    return { ok: false, message: error?.message || "Registration failed." };
  }

  const role = (res.user as { role?: string }).role ?? "user";

  // Dashboard guard ekhono getCurrentUser() (localStorage) use kore,
  // tai logged in user ta ekhane rekhe dilam. Password rakha hocche na.
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ ...rest, email, password: "", role }),
  );

  return { ok: true, role };
};

// Logout: remove logged in user
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
  void authClient.signOut(); // better-auth session o clear hobe
};

// Get currently logged-in user
export const getCurrentUser = (): IUser | null => {
  try {
    const user = localStorage.getItem(AUTH_KEY);

    if (!user) return null;

    return JSON.parse(user) as IUser;
  } catch {
    return null;
  }
};