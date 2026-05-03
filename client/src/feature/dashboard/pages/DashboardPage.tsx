import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type UserRole = "ADMIN" | "CORPORATE_ADMIN" | "MANAGER" | "STAFF" | "CANDIDATE" | "EMPLOYEE";

type KnowledgeDoc = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
};

type AssessmentItem = {
  id: string;
  name: string;
  assignedTo: string;
  status: string;
  due?: string;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login", { replace: true });
  };

  const userRole: UserRole = user?.role || "STAFF";

  const isAdmin = userRole === "ADMIN";
  const isManager = userRole === "MANAGER";
  const isCandidate = userRole === "STAFF";

  const stats = {
    totalAssessments: 0,
    activeCandidates: 0,
    pendingAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto p-6">

        {/* ✅ Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isAdmin
              ? "Organization Dashboard"
              : isManager
              ? "Manager Dashboard"
              : "Candidate Dashboard"}
          </h2>

          <p className="text-slate-600 mt-1">
            {isAdmin
              ? "Manage company knowledge, create assessments, and evaluate candidates"
              : isManager
              ? "Track your team's assessment progress and review candidate performance"
              : "View your assigned assessments and track your progress"}
          </p>
        </div>
        {isAdmin ? (
          <>
            {/* ADMIN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border">
                <p>Total Assessments</p>
                <p className="text-2xl font-bold">{stats.totalAssessments}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p>Active Candidates</p>
                <p className="text-2xl font-bold">{stats.activeCandidates}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p>Tenant Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </>
        ) : isManager ? (
          <>
            {/* MANAGER */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border">
                <p>Total</p>
                <p className="text-2xl">{stats.totalAssessments}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p>Pending</p>
                <p className="text-yellow-600 text-2xl">{stats.pendingAssessments}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p>Completed</p>
                <p className="text-green-600 text-2xl">{stats.completedAssessments}</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p>Avg Score</p>
                <p className="text-purple-600 text-2xl">{stats.averageScore}%</p>
              </div>
            </div>
          </>
        ) : isCandidate ? (
          <>
            {/* ✅ CANDIDATE DASHBOARD */}
            <Card>
              <CardHeader>
                <CardTitle>My Assessments</CardTitle>
                <CardDescription>
                  Complete your assigned assessments
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Frontend Assessment</p>
                    <p className="text-sm text-yellow-600">Pending</p>
                  </div>
                  <Button size="sm">Start</Button>
                </div>

                <div className="flex justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Backend Assessment</p>
                    <p className="text-sm text-blue-600">In Progress</p>
                  </div>
                  <Button size="sm" variant="outline">Continue</Button>
                </div>

                <div className="flex justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Full Stack Assessment</p>
                    <p className="text-sm text-green-600">Completed (85%)</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>

              </CardContent>
            </Card>
          </>
        ) : null}
      </main>
    </div>
  );
}
