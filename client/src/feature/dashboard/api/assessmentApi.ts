import api from "@/api/axios"; // Adjust this path to where your axios file is saved

// Interfaces for request payloads
export interface AssessmentRequest {
  title: string;
  role: string;
  seniority: string;
  documentIds: string[];
  jobDescription?: string;
}

export interface AssignmentRequest {
  assessmentId: string | number;
  candidateIds: (string | number)[];
}

const assessmentService = {
  /**
   * MANAGER ENDPOINTS
   */

  // Get list of all assessments for the organization (Summary View)
  getAssessments: async () => {
    const response = await api.get("/assessments");
    return response.data.data;
  },

  // Trigger the AI Generation Pipeline
  generateAssessment: async (payload: AssessmentRequest) => {
    const response = await api.post("/assessments/generate", payload);
    return response.data;
  },

  // Get the library of uploaded PDFs to populate the selection dropdown
  getLibraryDocuments: async () => {
    const response = await api.get("/ai/docs");
    return response.data.data;
  },

  // Assign a specific assessment to one or more candidates
  assignAssessment: async (payload: AssignmentRequest) => {
    const response = await api.post("/user-assessments/assign", payload);
    return response.data;
  },

  // Get organization members to find candidates for assignment
  getOrgMembers: async () => {
    const response = await api.get("/users/org-members");
    return response.data.data;
  },

  /**
   * CANDIDATE ENDPOINTS
   */

  // Get assessments assigned specifically to the logged-in candidate
  getMyTasks: async () => {
    const response = await api.get("/user-assessments/my-tasks");
    return response.data.data;
  },

  // Unlock and fetch the actual test content (JSON) to start the exam
  startTest: async (assignmentId: string | number) => {
    const response = await api.get(`/user-assessments/${assignmentId}/start`);
    return response.data.data;
  }
};

export default assessmentService;