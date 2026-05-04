import api from "@/api/axios"; // Adjust this path to where your axios file is saved


export interface AssessmentRequest {
  title: string;
  role: string;
  seniority: string;
  documentIds: string[];
  jobDescription?: string;
}

export interface AssignmentRequest {
  assessmentId: number;
  candidateIds: number[];
}

// ❗ Interface for submitting answers
export interface SubmissionRequest {
  assessmentId: number;
  answers: any; // Update with your specific MCQ/Code answer structure
}

const assessmentService = {
  // --- EXISTING MANAGER METHODS ---
  getAssessments: async () => {
    const response = await api.get("/assessments");
    return response.data.data;
  },

  generateAssessment: async (payload: AssessmentRequest) => {
    const response = await api.post("/assessments/generate", payload);
    return response.data;
  },

  getLibraryDocuments: async () => {
    const response = await api.get("/ai/docs");
    return response.data.data;
  },

  assignAssessment: async (payload: AssignmentRequest) => {
    const response = await api.post("/user-assessments/assign", payload);
    return response.data;
  },

  getCompleteAssessments: async () => {
    const response = await api.get("/assessments/get-complete-assessments");
    return response.data.data;
  },

  // // 3. GET KNOWLEDGE BASE DOCS
  // getLibraryDocuments: async () => {
  //   const response = await api.get("/ai/docs");
  //   return response.data.data;
  // },

  // 4. UPLOAD/INGEST NEW KNOWLEDGE
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/ai/docs/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },


  

  // assessmentApi.ts
getOrgMembers: async () => {
  const response = await api.get("/org/members");
  // Reach into the nested data if your Spring Boot uses a wrapper
  return response.data.data || response.data; 
},

  // --- ❗ ADD THESE MISSING METHODS ---

  // Fetches full assessment details (questions) for the candidate
  getAssessment: async (id: string | number) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data.data;
  },

  // Submits the candidate's answers
  submitAssessment: async (payload: SubmissionRequest) => {
    const response = await api.post("/user-assessments/submit", payload);
    return response.data;
  },

  // Fetches the AI-generated result/feedback for a completed test
  getAssessmentResult: async (id: string | number) => {
    const response = await api.get(`/user-assessments/results/${id}`);
    return response.data.data;
  }
};

export default assessmentService;