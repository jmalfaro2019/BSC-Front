import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPerspectives } from "../services/bscService";
import type { BSCData } from "../types/bsc";

export function usePerspectives() {
  return useQuery<BSCData>({
    queryKey: ["perspectives"],
    queryFn: fetchPerspectives,
  });
}

export function useInvalidatePerspectives() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["perspectives"] });
  };
}