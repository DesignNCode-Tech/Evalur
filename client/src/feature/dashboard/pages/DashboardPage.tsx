import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";
import { Building2, Users, FileText, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { KnowledgeIngestionTab } from "@/components/dashboard/tabs/KnowledgeIngestionTab";
// import { AssessmentCreationTab } from "@/components/dashboard/tabs/AssessmentCreationTab";
// import { CandidatesTab } from "@/components/dashboard/tabs/CandidatesTab";
// import { SettingsTab } from "@/components/dashboard/tabs/SettingsTab";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/auth/login", { replace: true });
  };

  // Use the role from your auth context (ADMIN, MANAGER, etc.)
  const userRole = user?.role || "STAFF";
  const isAdmin = userRole === "ADMIN";
  const isManager = userRole === "MANAGER";

  // Stats data (replace with real API data)
  const stats = {
    totalAssessments: 0,
    activeCandidates: 0,
    pendingAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50">
    {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {isAdmin ? "Organization Dashboard" : "Manager Dashboard"}
          </h2>
          <p className="text-slate-600 mt-1">
            {isAdmin 
              ? "Manage company knowledge, create assessments, and evaluate candidates"
              : "Track your team's assessment progress and review candidate performance"}
          </p>
        </div>

        {/* Conditional Rendering based on role */}
        {isAdmin ? (
          // ADMIN Dashboard - Full Access
          <>
            {/* Admin Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Assessments</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAssessments}</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Candidates</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.activeCandidates}</p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Tenant Status</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
                  </div>
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Tabs - Full Access */}
            <Tabs defaultValue="knowledge" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="knowledge">📚 Ingest Knowledge</TabsTrigger>
                <TabsTrigger value="assessments">📝 Create Assessment</TabsTrigger>
                <TabsTrigger value="candidates">👥 Candidates</TabsTrigger>
                <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="knowledge">
                {/* <KnowledgeIngestionTab /> */}
              </TabsContent>

              <TabsContent value="assessments">
                {/* <AssessmentCreationTab /> */}
              </TabsContent>

              <TabsContent value="candidates">
                {/* <CandidatesTab /> */}
              </TabsContent>

              <TabsContent value="settings">
                {/* <SettingsTab /> */}
              </TabsContent>
            </Tabs>
          </>
        ) : isManager ? (
          // MANAGER Dashboard - Limited Access
          <>
            {/* Manager Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Assessments</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalAssessments}</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingAssessments}</p>
                  </div>
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.completedAssessments}</p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Avg. Score</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{stats.averageScore}%</p>
                  </div>
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Manager Tabs - Limited Access */}
            <Tabs defaultValue="assigned" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="assigned">📋 Assigned Assessments</TabsTrigger>
                <TabsTrigger value="candidates">👥 My Candidates</TabsTrigger>
              </TabsList>

              <TabsContent value="assigned">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Assessments</CardTitle>
                    <CardDescription>
                      Track and review assessments assigned to your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <p className="font-medium">Frontend Developer Assessment</p>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                              Pending
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span>Candidate: John Doe</span>
                            <span>•</span>
                            <span>Due: 2024-01-22</span>
                          </div>
                        </div>
                        <Button size="sm" disabled>
                          Awaiting Submission
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <p className="font-medium">Backend Engineer Assessment</p>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              In Progress
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span>Candidate: Jane Smith</span>
                            <span>•</span>
                            <span>Due: 2024-01-21</span>
                          </div>
                        </div>
                        <Button size="sm" disabled>
                          In Progress
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <p className="font-medium">Full Stack Developer Assessment</p>
                            <Badge className="bg-green-500">Completed</Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span>Candidate: Mike Johnson</span>
                            <span>•</span>
                            <span>Score: 85%</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="candidates">
                <Card>
                  <CardHeader>
                    <CardTitle>My Candidates</CardTitle>
                    <CardDescription>
                      Candidates assigned to your team for assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-slate-500">john.doe@example.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Frontend Assessment</p>
                          <p className="text-sm text-yellow-600">Status: Pending</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Jane Smith</p>
                            <p className="text-sm text-slate-500">jane.smith@example.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Backend Assessment</p>
                          <p className="text-sm text-blue-600">Status: In Progress</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>MJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Mike Johnson</p>
                            <p className="text-sm text-slate-500">mike.j@example.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Full Stack Assessment</p>
                          <p className="text-sm text-green-600">Score: 85%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </main>
    </div>
  );
}