import { useFetch } from "@/hooks/useFetch"; // useFetch-er asol path boshan
import { getMyTravels } from "@/services/travel.api";

export const useMyTravels = () => {
  return useFetch((signal) => getMyTravels(signal));
};