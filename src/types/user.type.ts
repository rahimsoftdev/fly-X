export type UserRole = "admin" | "staff" | "user";

export interface IUser {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  userId:number
}

export type RegisterPayload = Omit<IUser, "role"> & { confirmPassword: string };