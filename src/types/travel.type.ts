export type TravelType = "regular" | "one-time";

export type DayOfWeek =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type PreferredTime = "morning" | "afternoon" | "evening";

export type TravelStatus = "interested" | "canceled" | "confirmed";

export interface ITravel {
  _id: string;
  type: TravelType;
  origin: string;
  destination: string;
  preferredTime: PreferredTime;
  date?: string;
  dayOfWeek?: DayOfWeek;
  status: TravelStatus;
  creatorUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelPayload {
  type: TravelType;
  origin: string;
  destination: string;
  preferredTime: PreferredTime;
  dayOfWeek?: DayOfWeek;
  date?: string; // "YYYY-MM-DD"
}