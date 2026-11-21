import type { ITravel } from "@/types/travel.type";

export interface TravelMember {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ManageTravel extends ITravel {
  member?: TravelMember;
}

export interface TravelPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ManageTravelListResponse {
  items: ManageTravel[];
  meta: TravelPageMeta;
}

export interface TravelDirection {
  origin: string;
  destination: string;
}