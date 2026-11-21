export interface CalendarDirection {
  origin: string;
  destination: string;
  count: number;
}

// GET /custom-travel/calendar এর প্রতিটা item
export interface CalendarDay {
  date: string; // "YYYY-MM-DD"
  count: number;
  directions: CalendarDirection[];
}

export interface CalendarSummaryResponse {
  items: CalendarDay[];
}

export interface CalendarMember {
  name?: string;
  email?: string;
}

// GET /custom-travel/calendar/:date এর প্রতিটা item
export interface CalendarDayItem {
  _id: string;
  type: "one-way" | "two-way";
  status: "interested" | "confirmed";
  origin: string;
  destination: string;
  preferredDeparture: string;
  returnOrigin?: string;
  returnDestination?: string;
  returnDate?: string;
  passengerCount: number;
  member?: CalendarMember;
}

export interface CalendarDayDetails {
  date: string;
  total: number;
  directions: CalendarDirection[];
  items: CalendarDayItem[];
}

export interface TravelPassenger {
  firstName: string;
  lastName: string;
  streetAddress: string;
  zipCode: string;
  email: string;
  phone: string;
}

// GET /custom-travel/:id (View Details modal)
export interface TravelDetails extends Omit<CalendarDayItem, "passengerCount"> {
  passengers: TravelPassenger[];
  specialRequests?: string;
}