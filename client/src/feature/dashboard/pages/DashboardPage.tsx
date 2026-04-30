import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // 👈 Get the logout function from context

  const handleLogout = () => {
    // 1. Call the global logout (clears state + storage)
    logout();

    // 2. Show feedback
    toast.success("Logged out successfully");

    // 3. Force navigation to the auth entry point
    navigate("/auth/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your organizational hiring context</p>
        </div>

        {/* TEMPORARY LOGOUT BUTTON */}
      <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
      </header>

      <main>
        {/* Your dashboard content goes here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Total Assessments: 0</span>
          </div>
          <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Active Candidates: 0</span>
          </div>
          <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400">Tenant Status: Active</span>
          </div>
        </div>
      </main>
    </div>
  );
}