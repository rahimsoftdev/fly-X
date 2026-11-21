import { useFetch } from "@/hooks/useFetch"; // useFetch-er asol path (useMyTravels.ts e ja ache seta)
import { getMyCustomTravels } from "@/services/custom-travel.api";

export const useMyCustomTravels = () => {
  return useFetch((signal) => getMyCustomTravels(signal));
};