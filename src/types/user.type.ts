// All roles available in the app
export type UserRole = "admin" | "staff" | "user";

// User object used across the app (never contains the password)
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO date string
}

// User as saved in the localStorage users list (includes password, demo only)
export interface IStoredUser extends IUser {
  password: string;
}

// Data submitted by the login form
export interface ILoginPayload {
  email: string;
  password: string;
}

// Data submitted by the register form
export interface IRegisterPayload {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}