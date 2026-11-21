

export type TravelStatus = "interested" | "confirmed";
export type TripType = "one-way" | "two-way";

export interface Passenger {
  firstName: string;
  lastName: string;
  streetAddress: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface MemberInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomTravelRequest {
  _id: string;
  type: TripType;
  origin: string;
  destination: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate?: string;
  preferredDeparture: string;
  specialRequests?: string;
  passengers: Passenger[];
  status: TravelStatus;
  creatorUserId: string;
  member?: MemberInfo; // backend populate করলে আসবে
  createdAt: string;
  updatedAt: string;
}