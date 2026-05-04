import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import assessmentService from "../api/assessmentApi"; // Ensure this path correctly points to your API file
import { toast } from "sonner";
import type {AssessmentRequest, 
  AssignmentRequest } from "@/feature/dashboard/api/assessmentApi"; // Importing types for request payloads

/** 
 * QUERIES (Data Syncing)
 */

// 1. Fetch all assessments for the organization
export const useAssessments = () => {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: assessmentService.getAssessments, // Hits /assessments
  });
};

// 2. Fetch knowledge library (uploaded PDFs) for the selection dropdown
export const useLibraryDocuments = () => {
  return useQuery({
    queryKey: ["docs"],
    queryFn: assessmentService.getLibraryDocuments, // Hits /ai/docs
  });
};

// 3. Fetch all members and filter specifically for CANDIDATEs
// useAssessment.ts
export const useCandidates = () => {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const members = await assessmentService.getOrgMembers();
      
      // Ensure we have an array before filtering
      const memberArray = Array.isArray(members) ? members : [];

      return memberArray.filter((m: any) => m.role === "CANDIDATE");
    },
  });
};
// 4. Fetch a specific assessment's full details (Questions/Structure)
export const useAssessment = (id: string | number) => {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: () => assessmentService.getAssessment(id),
    enabled: !!id, // Only run if ID is provided
  });
};

// 5. Fetch result/score for a completed assessment
export const useAssessmentResult = (id: string | number) => {
  return useQuery({
    queryKey: ["assessment-result", id],
    queryFn: () => assessmentService.getAssessmentResult(id),
    enabled: !!id,
  });
};

/** 
 * MUTATIONS (Actions)
 */

// 6. Trigger the AI Assessment Generation Pipeline
export const useGenerateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssessmentRequest) => assessmentService.generateAssessment(payload),
    onSuccess: () => {
      toast.success("AI Generation pipeline started!");
      // Automatically refresh the assessment list to show 'GENERATING' status
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: () => {
      toast.error("Failed to start generation. Please try again.");
    },
  });
};

// 7. Assign Assessment to Candidate (Numeric IDs)
export const useAssignAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignmentRequest) => assessmentService.assignAssessment(payload),
    onSuccess: () => {
      toast.success("Assessment assigned successfully");
      // Refresh list to update candidate counts or status badges
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: () => {
      toast.error("Assignment failed. Check if candidate is already assigned.");
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => assessmentService.uploadDocument(file),
    onSuccess: () => {
      toast.success("Document ingested successfully!");
      queryClient.invalidateQueries({ queryKey: ["docs"] });
    },
    onError: () => {
      toast.error("Failed to ingest document. Ensure it's a valid PDF/Text file.");
    },
  });
};

export const useCompleteAssessment = (id: string) => {
  return useQuery({
    queryKey: ["complete-assessment", id],
    queryFn: async () => {
      const allComplete = await assessmentService.getCompleteAssessments();
      // Filter for the specific ID provided in the URL
      const found = allComplete.find((a: any) => a.id.toString() === id);
      if (found && typeof found.content === "string") {
        found.content = JSON.parse(found.content);
      }
      return found;
    },
    enabled: !!id,
  });
};

// // 8. Submit candidate answers for evaluation
// export const useSubmitAssessment = () => {
//   return useMutation({
//     mutationFn: (payload: { assessmentId: string | number; answers: any }) => 
//       assessmentService.submitAssessment(payload),
//     onSuccess: () => {
//       toast.success("Assessment submitted successfully");
//     },
//     onError: () => {
//       toast.error("Submission failed. Check your connection.");
//     },
//   });
// };