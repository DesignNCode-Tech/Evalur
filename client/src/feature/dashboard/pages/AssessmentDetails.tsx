import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Archive,
  Send,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Mock data for the assessment details
const assessmentData = {
  id: 1,
  title: "Frontend Developer Test",
  role: "React Developer",
  description: "This assessment evaluates candidates' proficiency in frontend development with focus on React, TypeScript, and modern web technologies.",
  status: "Active",
  created: "2024-01-15",
  duration: 60,
  totalQuestions: 30,
  passingScore: 70,
  candidates: 32,
  completed: 24,
  avgScore: 78,
  instructions: "Please complete all questions within the time limit. Make sure you have a stable internet connection.",
  skills: ["React", "TypeScript", "Redux", "Tailwind CSS", "Jest"],
};

// Mock candidates data
const candidatesData = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    score: 92,
    status: "Completed",
    completedAt: "2024-01-20",
    timeSpent: 52,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, USA",
    score: 85,
    status: "Completed",
    completedAt: "2024-01-19",
    timeSpent: 58,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, USA",
    score: 0,
    status: "In Progress",
    completedAt: "",
    timeSpent: 35,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, USA",
    score: 78,
    status: "Completed",
    completedAt: "2024-01-18",
    timeSpent: 60,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 (555) 567-8901",
    location: "Chicago, USA",
    score: 0,
    status: "Not Started",
    completedAt: "",
    timeSpent: 0,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

// Mock analytics data
const analyticsData = {
  scoreDistribution: [
    { range: "0-20%", count: 1 },
    { range: "21-40%", count: 0 },
    { range: "41-60%", count: 3 },
    { range: "61-80%", count: 8 },
    { range: "81-100%", count: 12 },
  ],
  averageTimePerQuestion: 1.8,
  hardestQuestions: [
    { id: 5, text: "React Hooks implementation", correctRate: 45 },
    { id: 12, text: "State management with Redux", correctRate: 52 },
    { id: 18, text: "TypeScript advanced types", correctRate: 58 },
  ],
};

const AssessmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");

  const filteredCandidates = candidatesData.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score > 0) return "text-orange-600";
    return "text-gray-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    if (score > 0) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const handleInvite = () => {
    const emails = inviteEmails.split(",").map(email => email.trim());
    console.log("Inviting candidates:", emails);
    setShowInviteDialog(false);
    setInviteEmails("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/assessments")}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessments
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{assessmentData.title}</h1>
                <Badge className={
                  assessmentData.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }>
                  {assessmentData.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{assessmentData.role}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(`/assessments/edit/${id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setShowInviteDialog(true)}>
                <Send className="w-4 h-4 mr-2" />
                Invite Candidates
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Candidates</p>
                      <p className="text-2xl font-bold">{assessmentData.candidates}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary opacity-60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {Math.round((assessmentData.completed / assessmentData.candidates) * 100)}%
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{assessmentData.avgScore}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Passing Rate</p>
                      <p className="text-2xl font-bold">
                        {Math.round((assessmentData.completed > 0 ? 
                          candidatesData.filter(c => c.score >= assessmentData.passingScore).length / assessmentData.completed * 100 : 0))}%
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-yellow-500 opacity-60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>About this Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assessmentData.description}</p>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Instructions</h4>
                    <p className="text-sm text-muted-foreground">{assessmentData.instructions}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Duration</span>
                    </div>
                    <span className="font-medium">{assessmentData.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* <FileText className="w-4 h-4 text-muted-foreground" /> */}
                      <span className="text-sm">Questions</span>
                    </div>
                    <span className="font-medium">{assessmentData.totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Passing Score</span>
                    </div>
                    <span className="font-medium">{assessmentData.passingScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Created</span>
                    </div>
                    <span className="font-medium">{new Date(assessmentData.created).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Required Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {assessmentData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidates Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={candidate.avatar} />
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {candidate.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {candidate.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getScoreBadge(candidate.score)}>
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {candidate.score > 0 ? (
                              <div>
                                <span className={`font-semibold ${getScoreColor(candidate.score)}`}>
                                  {candidate.score}%
                                </span>
                                <Progress value={candidate.score} className="w-20 h-1 mt-1" />
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {candidate.timeSpent > 0 ? `${candidate.timeSpent} min` : '-'}
                          </TableCell>
                          <TableCell>
                            {candidate.completedAt ? new Date(candidate.completedAt).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/candidates/${candidate.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Score Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Score Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.scoreDistribution.map((item) => (
                      <div key={item.range}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.range}</span>
                          <span>{item.count} candidates</span>
                        </div>
                        <Progress 
                          value={(item.count / assessmentData.completed) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Average Time per Question</p>
                    <p className="text-2xl font-bold">{analyticsData.averageTimePerQuestion} min</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((assessmentData.completed / assessmentData.candidates) * 100)}%
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Top Performers</p>
                    <p className="text-2xl font-bold">
                      {candidatesData.filter(c => c.score >= 90).length} candidates
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hardest Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Most Challenging Questions</CardTitle>
                <CardDescription>
                  Questions with lowest correct rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.hardestQuestions.map((question) => (
                    <div key={question.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Q{question.id}: {question.text}</span>
                        <Badge variant="destructive">{question.correctRate}% correct</Badge>
                      </div>
                      <Progress value={question.correctRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Candidates</DialogTitle>
              <DialogDescription>
                Send assessment invitations to candidates via email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses separated by commas&#10;e.g., candidate1@example.com, candidate2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple emails with commas
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to the invitation..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>
                Send Invitations
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssessmentDetails;