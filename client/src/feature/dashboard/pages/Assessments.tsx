import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  FileText,
  Users,
  Clock,
  Eye,
  TrendingUp,
  Filter,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const assessments = [
  {
    id: 1,
    title: "Frontend Developer Test",
    role: "React Developer",
    candidates: 32,
    completed: 24,
    duration: 60,
    status: "Active",
    created: "2024-01-15",
    avgScore: 78,
  },
  {
    id: 2,
    title: "Backend Engineer Assessment",
    role: "Spring Boot Engineer",
    candidates: 18,
    completed: 12,
    duration: 90,
    status: "Draft",
    created: "2024-01-10",
    avgScore: 0,
  },
  {
    id: 3,
    title: "Full Stack Challenge",
    role: "Full Stack Developer",
    candidates: 24,
    completed: 20,
    duration: 120,
    status: "Closed",
    created: "2024-01-05",
    avgScore: 82,
  },
];

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || assessment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: assessments.filter(a => a.status === "Active").length,
    draft: assessments.filter(a => a.status === "Draft").length,
    totalCandidates: assessments.reduce((sum, a) => sum + a.candidates, 0),
    completedCandidates: assessments.reduce((sum, a) => sum + a.completed, 0),
    avgScore: Math.round(assessments.filter(a => a.avgScore > 0).reduce((sum, a) => sum + a.avgScore, 0) / 
              assessments.filter(a => a.avgScore > 0).length) || 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Draft": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Closed": return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default: return "";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Assessments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage technical evaluations
          </p>
        </div>

        <Button onClick={() => navigate("/assessments/create")} className="shadow-lg hover:shadow-xl transition-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completedCandidates}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments by title or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-3 py-2 rounded-md border bg-background text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground">No assessments found</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => navigate(`/assessments/${assessment.id}`)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left Section */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {assessment.title}
                      </h2>
                      <Badge className={getStatusColor(assessment.status)}>
                        {assessment.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {assessment.role}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{assessment.candidates} Candidates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{assessment.duration} minutes</span>
                      </div>
                      {assessment.avgScore > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Avg Score: {assessment.avgScore}%</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for Completed Candidates */}
                    {assessment.candidates > 0 && (
                      <div className="w-full md:w-64">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Completion Rate</span>
                          <span>{Math.round((assessment.completed / assessment.candidates) * 100)}%</span>
                        </div>
                        <Progress value={(assessment.completed / assessment.candidates) * 100} className="h-1" />
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/assessments/${assessment.id}/analytics`);
                      }}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Analytics
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/assessments/${assessment.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate("/analytics")}>
          View Overall Analytics →
        </Button>
      </div>
    </div>
  );
};

export default AssessmentsPage;