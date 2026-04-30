import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
      <h1 className="text-6xl font-bold text-slate-900">403</h1>
      <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
      <p className="text-slate-500 mt-2 max-w-md">
        You do not have the necessary permissions to view this tenant dashboard or resource.
      </p>
      <Button 
        onClick={() => navigate("/dashboard")} 
        className="mt-6 bg-slate-900"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}