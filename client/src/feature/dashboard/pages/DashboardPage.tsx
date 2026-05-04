import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserRole = "ADMIN" | "MANAGER" | "STAFF" | "CANDIDATE";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase() as UserRole | undefined;

  if (!role) {
    return <div className="p-6">Loading...</div>;
  }

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";
  const isStaff = role === "STAFF";
  const isCandidate = role === "CANDIDATE";

  // ✅ STATE
  const [assessments, setAssessments] = useState<any[]>([]);

  // ✅ FETCH
  const fetchAssessments = async () => {
    try {
      const res = await fetch("/api/candidate/assessments");
      const data = await res.json();
      setAssessments(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ EFFECT (AFTER role is defined)
  useEffect(() => {
    if (isCandidate) {
      fetchAssessments();
    }
  }, [isCandidate]);

  // ✅ ACTION
  const handleAction = (a: any) => {
    if (a.status === "PENDING") {
      navigate(`/assessment/${a.id}`);
    } else if (a.status === "IN_PROGRESS") {
      navigate(`/assessment/${a.id}`);
    } else {
      navigate(`/assessment/result/${a.id}`);
    }
  };

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

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isAdmin
              ? "Organization Dashboard"
              : isManager
              ? "Manager Dashboard"
              : isStaff
              ? "Staff Dashboard"
              : "Candidate Dashboard"}
          </h2>

          <p className="text-slate-600 mt-1">
            {isAdmin
              ? "Manage company knowledge, create assessments, and evaluate candidates"
              : isManager
              ? "Track your team's assessment progress"
              : isStaff
              ? "Manage internal tasks"
              : "View your assigned assessments"}
          </p>
        </div>

        {/* ADMIN */}
        {isAdmin && (
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
              <p className="text-green-600 text-2xl font-bold">Active</p>
            </div>
          </div>
        )}

        {/* MANAGER */}
        {isManager && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border">
              <p>Total</p>
              <p className="text-2xl">{stats.totalAssessments}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <p>Pending</p>
              <p className="text-yellow-600 text-2xl">
                {stats.pendingAssessments}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <p>Completed</p>
              <p className="text-green-600 text-2xl">
                {stats.completedAssessments}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <p>Avg Score</p>
              <p className="text-purple-600 text-2xl">
                {stats.averageScore}%
              </p>
            </div>
          </div>
        )}

        {/* STAFF */}
        {isStaff && (
          <Card>
            <CardHeader>
              <CardTitle>Staff Panel</CardTitle>
              <CardDescription>
                Manage daily operations
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p>No tasks assigned yet</p>
            </CardContent>
          </Card>
        )}

        {/* CANDIDATE */}
        {isCandidate && (
          <Card>
            <CardHeader>
              <CardTitle>My Assessments</CardTitle>
              <CardDescription>
                Complete your assigned assessments
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {assessments.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No assessments assigned yet
                </p>
              )}

              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>

                    <p className="text-sm">
                      {a.status === "PENDING" && (
                        <span className="text-yellow-600">Pending</span>
                      )}

                      {a.status === "IN_PROGRESS" && (
                        <span className="text-blue-600">In Progress</span>
                      )}

                      {a.status === "COMPLETED" && (
                        <span className="text-green-600">
                          Completed ({a.score ?? 0}%)
                        </span>
                      )}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant={a.status === "PENDING" ? "default" : "outline"}
                    onClick={() => handleAction(a)}
                  >
                    {a.status === "PENDING"
                      ? "Start"
                      : a.status === "IN_PROGRESS"
                      ? "Continue"
                      : "View"}
                  </Button>
                </div>
              ))}

            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
}