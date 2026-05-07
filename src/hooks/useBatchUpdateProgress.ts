import { useMutation } from "@tanstack/react-query";
import { batchUpdateProgress } from "../services/bscService";
import { useInvalidatePerspectives } from "./usePerspectives";

export function useBatchUpdateProgress() {
  const invalidatePerspectives = useInvalidatePerspectives();

  return useMutation({
    mutationFn: (updates: { activityId: string; progress: number }[]) =>
      batchUpdateProgress(updates),
    onSuccess: () => {
      invalidatePerspectives();
    },
  });
}