import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  TrendingUp,
  User,
  Bell,
  Search,
  Calendar,
  Clock,
  Award,
  Star,
  ChevronRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Brain,
  Coffee,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for dashboard
const userData = {
  name: "Alex Thompson",
  email: "alex.thompson@company.com",
  role: "Frontend Developer",
  department: "Engineering",
  avatar: "https://i.pravatar.cc/150?img=1",
  joinDate: "2024-01-15",
  completedAssessments: 8,
  pendingAssessments: 3,
  averageScore: 85,
  streak: 12,
  badges: 5,
};

const upcomingAssessments = [
  {
    id: 1,
    title: "React Performance Optimization",
    type: "Technical Assessment",
    dueDate: "2024-02-20",
    duration: 45,
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    title: "Security Best Practices",
    type: "Compliance",
    dueDate: "2024-02-25",
    duration: 30,
    status: "pending",
    priority: "medium",
  },
  {
    id: 3,
    title: "Leadership Skills Evaluation",
    type: "Soft Skills",
    dueDate: "2024-03-01",
    duration: 60,
    status: "pending",
    priority: "low",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "completed",
    title: "JavaScript Fundamentals",
    score: 92,
    date: "2024-02-10",
    duration: 45,
  },
  {
    id: 2,
    type: "completed",
    title: "React Hooks Deep Dive",
    score: 88,
    date: "2024-02-05",
    duration: 60,
  },
  {
    id: 3,
    type: "started",
    title: "TypeScript Mastery",
    progress: 45,
    date: "2024-02-12",
    duration: 90,
  },
];

const skillProgress = [
  { skill: "JavaScript", proficiency: 85, color: "#F7DF1E" },
  { skill: "React", proficiency: 78, color: "#61DAFB" },
  { skill: "TypeScript", proficiency: 65, color: "#3178C6" },
  { skill: "Node.js", proficiency: 70, color: "#339933" },
  { skill: "CSS", proficiency: 82, color: "#264DE4" },
];

const weeklyProgress = [
  { day: "Mon", completed: 2, started: 1 },
  { day: "Tue", completed: 1, started: 2 },
  { day: "Wed", completed: 3, started: 1 },
  { day: "Thu", completed: 2, started: 2 },
  { day: "Fri", completed: 1, started: 1 },
  { day: "Sat", completed: 0, started: 1 },
  { day: "Sun", completed: 0, started: 0 },
];

const recommendations = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description: "Level up your React skills with advanced patterns",
    difficulty: "Advanced",
    estimatedTime: 120,
    matchScore: 95,
  },
  {
    id: 2,
    title: "System Design Fundamentals",
    description: "Learn how to design scalable systems",
    difficulty: "Intermediate",
    estimatedTime: 90,
    matchScore: 88,
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-50 dark:bg-red-950/30";
      case "medium": return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30";
      case "low": return "text-green-500 bg-green-50 dark:bg-green-950/30";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Welcome */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-4 ring-primary/20">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back, {userData.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-muted-foreground">
                  {userData.role} • {userData.department}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Member since {new Date(userData.joinDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    🔥 {userData.streak} day streak
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/user/profile")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{userData.completedAssessments}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{userData.pendingAssessments}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold text-blue-600">{userData.averageScore}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-500 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Badges Earned</p>
                    <p className="text-2xl font-bold text-purple-600">{userData.badges}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Upcoming & Recent */}
              <div className="lg:col-span-2 space-y-6">
                {/* Upcoming Assessments */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Upcoming Assessments
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => navigate("/user/assessments")}>
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    <CardDescription>
                      Complete these assessments before their deadlines
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate(`/user/assessment/${assessment.id}`)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{assessment.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {assessment.type}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>📅 Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                            <span>⏱ {assessment.duration} min</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(assessment.priority)}>
                            {assessment.priority} priority
                          </Badge>
                          <Button size="sm">
                            Start
                            <Play className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your recent assessment completions and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {activity.type === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()} • {activity.duration} min
                            </p>
                          </div>
                        </div>
                        {activity.type === "completed" ? (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            Score: {activity.score}%
                          </Badge>
                        ) : (
                          <div className="text-right">
                            <span className="text-sm">Progress: {activity.progress}%</span>
                            <Progress value={activity.progress} className="w-24 h-1 mt-1" />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Skills & Recommendations */}
              <div className="space-y-6">
                {/* Skill Proficiency */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Skill Proficiency
                    </CardTitle>
                    <CardDescription>
                      Your current skill levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillProgress.map((skill) => (
                      <div key={skill.skill}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill.skill}</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-primary" />
                      Recommended for You
                    </CardTitle>
                    <CardDescription>
                      Based on your skills and interests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="p-3 rounded-lg border hover:border-primary transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {rec.matchScore}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <span>📊 {rec.difficulty}</span>
                            <span>⏱ {rec.estimatedTime} min</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>
                  Your assessment activity for this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" />
                      <Bar dataKey="started" fill="#3b82f6" name="Started" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This will be expanded with MyAssessments component */}
              <Card className="col-span-full text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manage Your Assessments</h3>
                <p className="text-muted-foreground mb-4">
                  View all your assigned assessments and track progress
                </p>
                <Button onClick={() => navigate("/user/assessments")}>
                  View All Assessments
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20 mb-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold">
                          {Math.round((userData.completedAssessments / 
                            (userData.completedAssessments + userData.pendingAssessments)) * 100)}%
                        </span>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                    </div>
                    <Progress 
                      value={(userData.completedAssessments / 
                        (userData.completedAssessments + userData.pendingAssessments)) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Excellent (90%+)", value: 3, color: "#10b981" },
                            { name: "Good (70-89%)", value: 4, color: "#3b82f6" },
                            { name: "Average (50-69%)", value: 1, color: "#f59e0b" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                        //   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[3, 4, 1].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={["#10b981", "#3b82f6", "#f59e0b"][index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;