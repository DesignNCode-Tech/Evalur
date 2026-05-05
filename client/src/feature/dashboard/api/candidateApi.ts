// src/feature/dashboard/api/candidateApi.ts
import api from "@/api/axios";

export const candidateApi = {
  // 1. Fetch dashboard list
  getMyAssessments: async () => {
    const response = await api.get("/user-assessments/my-tasks"); 
    return response.data?.data || response.data;
  },

  // 2. Start Test & Get Secure Content
  startAssessment: async (assignmentId: number) => {
    const response = await api.get(`/user-assessments/${assignmentId}/start`);
    const rawData = response.data?.data || response.data;
    
    // Spring Boot sends the content as a JSON string, so we parse it here!
    return typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  },

  // 3. Submit Final Answers
  submitAssessment: async (payload: { userAssessmentId: number, mcqAnswers: number[], codingSolution: string }) => {
    const response = await api.post("/user-assessments/submit", payload);
    return response.data;
  }
};