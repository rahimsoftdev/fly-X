export type CustomTripType = "one-way" | "two-way";

export type CustomTravelStatus = "interested" | "confirmed";

export interface IPassenger {
  firstName: string;
  lastName: string;
  streetAddress: string;
  zipCode: string;
  email: string;
  phone: string;
}

export interface ICustomTravel {
  _id: string;
  type: CustomTripType;
  origin: string;
  destination: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate?: string;
  preferredDeparture: string;
  specialRequests?: string;
  passengers: IPassenger[];
  status: CustomTravelStatus;
  creatorUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomTravelPayload {
  type: CustomTripType;
  origin: string;
  destination: string;
  preferredDeparture: string; // "YYYY-MM-DD"
  returnOrigin?: string; // shudhu two-way hole
  returnDestination?: string; // shudhu two-way hole
  returnDate?: string; // shudhu two-way hole
  specialRequests?: string;
  passengers: IPassenger[];
}