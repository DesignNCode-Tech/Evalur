import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Clock,
  Calendar,
  Play,
  Eye,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allAssessments = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    type: "Technical",
    status: "completed",
    score: 92,
    completedDate: "2024-02-10",
    duration: 45,
    questions: 30,
  },
  {
    id: 2,
    title: "React Hooks Deep Dive",
    type: "Technical",
    status: "completed",
    score: 88,
    completedDate: "2024-02-05",
    duration: 60,
    questions: 40,
  },
  {
    id: 3,
    title: "TypeScript Mastery",
    type: "Technical",
    status: "in-progress",
    progress: 45,
    duration: 90,
    questions: 50,
  },
  {
    id: 4,
    title: "System Design Fundamentals",
    type: "Technical",
    status: "pending",
    dueDate: "2024-02-25",
    duration: 120,
    questions: 25,
  },
  {
    id: 5,
    title: "Leadership Skills Evaluation",
    type: "Soft Skills",
    status: "pending",
    dueDate: "2024-03-01",
    duration: 60,
    questions: 20,
  },
  {
    id: 6,
    title: "Security Best Practices",
    type: "Compliance",
    status: "pending",
    dueDate: "2024-02-20",
    duration: 30,
    questions: 15,
  },
];

const MyAssessments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAssessments = allAssessments.filter((assessment) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Assessments</h2>
          <p className="text-muted-foreground">View and complete your assigned assessments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="px-3 py-2 rounded-md border bg-background text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card
            key={assessment.id}
            className="hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => navigate(`/user/assessment/${assessment.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge className={getStatusBadge(assessment.status)}>
                  {assessment.status === "in-progress" ? "In Progress" : 
                   assessment.status === "completed" ? "Completed" : "Pending"}
                </Badge>
                <Badge variant="outline">{assessment.type}</Badge>
              </div>
              <CardTitle className="mt-2 group-hover:text-primary transition-colors">
                {assessment.title}
              </CardTitle>
              <CardDescription>
                {assessment.questions} questions • {assessment.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessment.status === "completed" && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Score</span>
                    <span className="font-semibold text-green-600">{assessment.score}%</span>
                  </div>
                  <Progress value={assessment.score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed on {new Date(assessment.completedDate!).toLocaleDateString()}
                  </p>
                </div>
              )}

              {assessment.status === "in-progress" && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{assessment.progress}%</span>
                  </div>
                  <Progress value={assessment.progress} className="h-2" />
                </div>
              )}

              {assessment.status === "pending" && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-yellow-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assessment.dueDate!).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <Button className="w-full" variant={assessment.status === "completed" ? "outline" : "default"}>
                {assessment.status === "completed" ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </>
                ) : assessment.status === "in-progress" ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Continue
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Assessment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyAssessments;