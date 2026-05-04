import { useQuery, useMutation } from "@tanstack/react-query";
import { getAssessment, getAssessmentResult, submitAssessment } from "../api/assessmentApi";
import { toast } from "sonner";

export const useAssessment = (id: string) => {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: () => getAssessment(id),
  });
};

export const useSubmitAssessment = () => {
  return useMutation({
    mutationFn: submitAssessment,

    onSuccess: () => {
      toast.success("Assessment submitted successfully");
    },

    onError: () => {
      toast.error("Submission failed");
    },
  });
};
export const useAssessmentResult = (id: string) => {
  return useQuery({
    queryKey: ["assessment-result", id],
    queryFn: () => getAssessmentResult(id),
  });
};