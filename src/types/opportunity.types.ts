export type OpportunityStatus = "draft" | "open" | "confirmed" | "completed";
export type OpportunityType = "one-way" | "two-way";

export interface Opportunity {
  _id: string;
  type: OpportunityType;
  origin: string;
  destination: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate?: string;
  preferredDeparture: string;
  price: number;
  aircraftType: string;
  totalCapacity: number;
  bookingSpeed: string;
  status: OpportunityStatus;
  passengers: string[];
  createdAt: string;
}

export interface OpportunityQuery {
  page?: number | undefined;
  limit?: number | undefined;
  status?: OpportunityStatus | undefined;
  type?: OpportunityType | undefined;
}