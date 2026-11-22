// import { api } from "@/lib/api";
import { api } from "@/lib/axios";
import type { IDashboard } from "./dashboard.types";

export const fetchDashboard = async (signal?: AbortSignal) => {
  const res = await api.get<{ success: boolean; data: IDashboard }>(
    "/dashboard/overview",
    { signal }
  );
  return res.data.data;
};