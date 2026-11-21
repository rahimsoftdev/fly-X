import type {
  OpportunityStatus,
  OpportunityType,
} from "@/types/opportunity.types";

export interface ManageOpportunity {
  _id: string;
  type: OpportunityType;
  origin: string;
  destination: string;
  preferredDeparture: string;
  price: number;
  aircraftType: string;
  totalCapacity: number;
  status: OpportunityStatus;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ManageListResponse {
  items: ManageOpportunity[];
  meta: PageMeta;
}

export interface OpportunityTraveler {
  userId: string;
  member?: { name?: string; email?: string };
}

export interface ManageOpportunityDetails extends ManageOpportunity {
  travelers: OpportunityTraveler[];
}

export interface OpportunityDirection {
  origin: string;
  destination: string;
}

export interface CreateOpportunityPayload {
  type: "one-way" | "two-way";
  origin: string;
  destination: string;
  preferredDeparture: string; // "YYYY-MM-DD"
  returnDate?: string; // শুধু two-way হলে
  price: number;
  aircraftType: string;
  totalCapacity: number;
  status: "open" | "draft";
}