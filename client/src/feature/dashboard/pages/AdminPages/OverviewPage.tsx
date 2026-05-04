// pages/admin/OverviewPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Upload,
  UserPlus,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Eye,
  Star,
  Activity,
  BarChart3,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/app/providers/AuthContext";
import { toast } from "sonner";

interface Stats {
  totalAssessments: number;
  totalCandidates: number;
  pendingReviews: number;
  averageScore: number;
  activeAssessments: number;
  completionRate: number;
}

interface RecentAssessment {
  id: string;
  title: string;
  role: string;
  candidates: number;
  status: "draft" | "active" | "completed";
  createdAt: string;
  dueDate?: string;
}

interface RecentSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  score: number;
  submittedAt: string;
  status: "pending_review" | "auto_graded" | "needs_review";
}

interface ActivityData {
  month: string;
  assessments: number;
  candidates: number;
}

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalAssessments: 0,
    totalCandidates: 0,
    pendingReviews: 0,
    averageScore: 0,
    activeAssessments: 0,
    completionRate: 0,
  });
  const [recentAssessments, setRecentAssessments] = useState<RecentAssessment[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real data from API
      const [statsRes, assessmentsRes, submissionsRes, activityRes] = await Promise.all([
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/admin/recent-assessments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/admin/recent-submissions", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch("/api/admin/activity-data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (assessmentsRes.ok) setRecentAssessments(await assessmentsRes.json());
      if (submissionsRes.ok) setRecentSubmissions(await submissionsRes.json());
      if (activityRes.ok) setActivityData(await activityRes.json());
      else {
        // Mock data for development
        setStats({
          totalAssessments: 24,
          totalCandidates: 156,
          pendingReviews: 12,
          averageScore: 78,
          activeAssessments: 8,
          completionRate: 68,
        });

        setRecentAssessments([
          {
            id: "1",
            title: "Frontend Developer Assessment",
            role: "Frontend Developer",
            candidates: 24,
            status: "active",
            createdAt: "2024-01-15",
            dueDate: "2024-02-15",
          },
          {
            id: "2",
            title: "Backend Engineer Assessment",
            role: "Backend Engineer",
            candidates: 18,
            status: "active",
            createdAt: "2024-01-10",
            dueDate: "2024-02-10",
          },
          {
            id: "3",
            title: "Full Stack Developer Assessment",
            role: "Full Stack Developer",
            candidates: 32,
            status: "completed",
            createdAt: "2024-01-05",
          },
          {
            id: "4",
            title: "DevOps Engineer Assessment",
            role: "DevOps Engineer",
            candidates: 12,
            status: "draft",
            createdAt: "2024-01-18",
          },
        ]);

        setRecentSubmissions([
          {
            id: "1",
            candidateName: "John Doe",
            candidateEmail: "john@example.com",
            assessmentTitle: "Frontend Developer Assessment",
            score: 85,
            submittedAt: "2024-01-20T10:30:00",
            status: "auto_graded",
          },
          {
            id: "2",
            candidateName: "Jane Smith",
            candidateEmail: "jane@example.com",
            assessmentTitle: "Backend Engineer Assessment",
            score: 0,
            submittedAt: "2024-01-19T15:45:00",
            status: "pending_review",
          },
          {
            id: "3",
            candidateName: "Mike Johnson",
            candidateEmail: "mike@example.com",
            assessmentTitle: "Full Stack Developer Assessment",
            score: 72,
            submittedAt: "2024-01-18T09:15:00",
            status: "auto_graded",
          },
          {
            id: "4",
            candidateName: "Sarah Williams",
            candidateEmail: "sarah@example.com",
            assessmentTitle: "Frontend Developer Assessment",
            score: 0,
            submittedAt: "2024-01-17T14:20:00",
            status: "needs_review",
          },
        ]);

        setActivityData([
          { month: "Sep", assessments: 12, candidates: 45 },
          { month: "Oct", assessments: 18, candidates: 62 },
          { month: "Nov", assessments: 15, candidates: 58 },
          { month: "Dec", assessments: 22, candidates: 74 },
          { month: "Jan", assessments: 28, candidates: 89 },
          { month: "Feb", assessments: 24, candidates: 78 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case "auto_graded":
        return <Badge className="bg-green-500">Auto-graded</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case "needs_review":
        return <Badge className="bg-red-500">Needs Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name || "Admin"}! Here's what's happening with your assessments.
          </p>
        </div>
        <div className="flex gap-2">
        </div>
      </div>


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your assessment platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/5"
             onClick={() =>
  navigate("/admin/assessments", { state: { openCreate: true } })
}
            >
              <Plus className="h-6 w-6 text-primary" />
              <span>Create Assessment</span>
              <span className="text-xs text-muted-foreground">Build new assessments with AI</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/5"
              onClick={() => navigate("/admin/knowledge")}
            >
              <Upload className="h-6 w-6 text-primary" />
              <span>Upload Knowledge</span>
              <span className="text-xs text-muted-foreground">Add company documentation</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-primary/5"
              onClick={() => navigate("/admin/candidates")}
            >
              <UserPlus className="h-6 w-6 text-primary" />
              <span>Invite Candidate</span>
              <span className="text-xs text-muted-foreground">Add new candidates to platform</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>Assessments and candidates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="assessments"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Assessments"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="candidates"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Candidates"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Distribution
            </CardTitle>
            <CardDescription>Candidate score distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { range: "0-20%", count: 5 },
                  { range: "21-40%", count: 12 },
                  { range: "41-60%", count: 28 },
                  { range: "61-80%", count: 42 },
                  { range: "81-100%", count: 31 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="assessments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assessments">Recent Assessments</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        {/* Recent Assessments Tab */}
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Recently Created Assessments</CardTitle>
              <CardDescription>Your latest assessment creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{assessment.title}</p>
                        <Badge className={getStatusColor(assessment.status)}>
                          {assessment.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Role: {assessment.role}</span>
                        <span>•</span>
                        <span>{assessment.candidates} candidates</span>
                        <span>•</span>
                        <span>Created: {formatDate(assessment.createdAt)}</span>
                        {assessment.dueDate && (
                          <>
                            <span>•</span>
                            <span>Due: {formatDate(assessment.dueDate)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/assessments/${assessment.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>

              {recentAssessments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No assessments created yet</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/assessments/create")}
                    className="mt-2"
                  >
                    Create your first assessment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Candidate Submissions</CardTitle>
              <CardDescription>Latest assessment completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {submission.candidateName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{submission.candidateName}</p>
                          <p className="text-xs text-muted-foreground">
                            {submission.candidateEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground ml-10">
                        <span>{submission.assessmentTitle}</span>
                        <span>•</span>
                        <span>Submitted: {formatDate(submission.submittedAt)} at {formatTime(submission.submittedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {submission.score > 0 ? (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{submission.score}%</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      ) : (
                        getSubmissionStatusBadge(submission.status)
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/candidates/${submission.id}/report`)}
                      >
                        {submission.score > 0 ? "View Report" : "Review"}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {recentSubmissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No submissions yet</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/people/invitations")}
                    className="mt-2"
                  >
                    Invite candidates to get started
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>Assessments ending in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAssessments
              .filter(a => a.dueDate && new Date(a.dueDate) > new Date())
              .slice(0, 3)
              .map((assessment) => {
                const dueDate = new Date(assessment.dueDate!);
                const daysLeft = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                
                return (
                  <div key={assessment.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div>
                      <p className="font-medium">{assessment.title}</p>
                      <p className="text-sm text-muted-foreground">{assessment.candidates} candidates assigned</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={daysLeft <= 2 ? "destructive" : "default"}>
                        {daysLeft} days left
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Due {formatDate(assessment.dueDate!)}</p>
                    </div>
                  </div>
                );
              })}
            
            {(!recentAssessments.some(a => a.dueDate)) && (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming deadlines
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}