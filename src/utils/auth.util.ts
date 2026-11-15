import type { IUser, RegisterPayload } from "@/types/user.type";

const USERS_KEY = "raven_users"; // registered users list
const AUTH_KEY = "raven_auth_user"; // logged in user

// 3 demo accounts, role is decided by email
const demoUsers: IUser[] = [
  {
    firstName: "Admin", lastName: "Raven", address: "100 Park Avenue",
    zipCode: "10017", city: "New York", state: "NY", phone: "+1 212 555 0100",
    email: "admin1234@gmail.com", password: "admin1234", role: "admin",
  },
  {
    firstName: "Sophia", lastName: "Reed", address: "55 Madison Avenue",
    zipCode: "10010", city: "New York", state: "NY", phone: "+1 212 555 0155",
    email: "staff1234@gmail.com", password: "staff1234", role: "staff",
  },
  {
    firstName: "Daniel", lastName: "Carter", address: "22 Bayshore Boulevard",
    zipCode: "33606", city: "Tampa", state: "FL", phone: "+1 813 555 0122",
    email: "user1234@gmail.com", password: "user1234", role: "user",
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

// Register: save info, role is always "user"
export const register = (data: RegisterPayload): IUser | null => {
  const email = data.email.trim().toLowerCase();

  // email already used
  if ([...demoUsers, ...getUsers()].some((u) => u.email === email)) return null;

  const { confirmPassword: _confirm, ...rest } = data;
  const newUser: IUser = { ...rest, email, role: "user" };

  localStorage.setItem(USERS_KEY, JSON.stringify([...getUsers(), newUser]));
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  return newUser;
};

// Logout: remove logged in user
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};