import { useMutation } from "@tanstack/react-query";
import { updateActivityProgress } from "../services/bscService";
import { useInvalidatePerspectives } from "./usePerspectives";

export function useUpdateProgress() {
  const invalidatePerspectives = useInvalidatePerspectives();

  return useMutation({
    mutationFn: ({
      perspectiveId,
      projectId,
      activityId,
      progress,
    }: {
      perspectiveId: string;
      projectId: string;
      activityId: string;
      progress: number;
    }) =>
      updateActivityProgress(perspectiveId, projectId, activityId, progress),
    onSuccess: () => {
      invalidatePerspectives();
    },
  });
}