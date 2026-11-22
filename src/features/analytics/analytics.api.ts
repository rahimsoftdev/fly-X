// import { api } from "@/lib/api";
import { api } from "@/lib/axios";
import type { IAdminOverview, IInsights } from "./analytics.types";

export const fetchInsights = async (signal?: AbortSignal) => {
  const res = await api.get<{ success: boolean; data: IInsights }>(
    "/analytics/insights",
    { signal }
  );
  return res.data.data;
};

export const fetchAdminOverview = async (
  year: number,
  signal?: AbortSignal
) => {
  const res = await api.get<{ success: boolean; data: IAdminOverview }>(
    "/analytics/admin-overview",
    { params: { year }, signal }
  );
  return res.data.data;
};