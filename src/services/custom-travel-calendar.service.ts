import { api } from "@/lib/axios";
import type {
  CalendarDayDetails,
  CalendarSummaryResponse,
  TravelDetails,
} from "@/types/custom-travel-calendar.types";

export const getCalendarSummary = async (
  from: string,
  to: string,
  signal?: AbortSignal
) => {
  const res = await api.get("/custom-travel/calendar", {
    params: { from, to },
    signal,
  });
  return res.data.data as CalendarSummaryResponse;
};

export const getCalendarDay = async (date: string, signal?: AbortSignal) => {
  const res = await api.get(`/custom-travel/calendar/${date}`, { signal });
  return res.data.data as CalendarDayDetails;
};

export const getTravelDetails = async (id: string, signal?: AbortSignal) => {
  const res = await api.get(`/custom-travel/${id}`, { signal });
  return res.data.data as TravelDetails;
};