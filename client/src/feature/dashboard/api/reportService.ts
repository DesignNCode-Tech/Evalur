import api from "@/api/axios";

export const downloadAssessmentReport = async (evaluationId: number) => {
  try {
    const response = await api.get(`/user-assessments/evaluation/${evaluationId}/report`, {
      responseType: "blob", // Critical: Tells Axios to handle binary data
    });

    // Create a local URL for the PDF blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    
    // Set the filename
    link.setAttribute("download", `evalur_report_${evaluationId}.pdf`);
    
    document.body.appendChild(link);
    link.click();

    // Clean up to prevent memory leaks
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF Download Error:", error);
    throw error;
  }
};