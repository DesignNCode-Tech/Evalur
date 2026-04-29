import { useState } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Eye,
  MessageCircle,
  Filter,
  Download,
  MoreVertical,
  Star,
  Calendar,
  Briefcase,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo data
const demoData = [
  {
    id: 1,
    name: "Namira Mulla",
    email: "Exmaple@gmail.com",
    phone: "293849584059",
    location: "MUMbai",
    assessment: "Frontend Developer Test",
    status: "Completed",
    score: "92%",
    
    avatar: "./src/assets/namira/Namira.jpg",
    appliedDate: "28-04-2026",
    experience: "5 years",
    skills: ["React", "TypeScript", "TailwindCSS"],
    feedback: "Excellent problem-solving skills",
  } ,
  
];

const statusColors = {
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const statusIcons = {
  Completed: CheckCircle2,
  "In Progress": Clock,
  Pending: AlertCircle,
};

const Candidates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assessmentFilter, setAssessmentFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Filter candidates based on search and filters
  const filteredCandidates = demoData.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.assessment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesAssessment = assessmentFilter === "all" || candidate.assessment === assessmentFilter;
    return matchesSearch && matchesStatus && matchesAssessment;
  });

  // Stats
  const stats = {
    total: demoData.length,
    completed: demoData.filter(c => c.status === "Completed").length,
    inProgress: demoData.filter(c => c.status === "In Progress").length,
    pending: demoData.filter(c => c.status === "Pending").length,
    averageScore: Math.round(
      demoData.filter(c => c.score !== "-").reduce((acc, c) => acc + parseInt(c.score), 0) / 
      demoData.filter(c => c.score !== "-").length
    ),
  };

  const ViewCandidateDialog = ({ candidate, open, onOpenChange }: any) => {
    if (!candidate) return null;
    
    const StatusIcon = statusIcons[candidate.status as keyof typeof statusIcons];
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogDescription>
              Complete information about {candidate.name}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={candidate.avatar} />
                  <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{candidate.name}</h3>
                  <p className="text-muted-foreground">{candidate.assessment}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={statusColors[candidate.status as keyof typeof statusColors]}>
                      {candidate.status}
                    </Badge>
                    {candidate.score !== "-" && (
                      <Badge variant="outline">Score: {candidate.score}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {candidate.location}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Professional Info</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      {candidate.experience} experience
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-4">
              {candidate.score !== "-" ? (
                <>
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-primary mb-2">{candidate.score}</div>
                    <p className="text-muted-foreground">Overall Score</p>
                  </div>
                  <Progress value={parseInt(candidate.score)} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-sm text-muted-foreground">Technical Skills</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-sm text-muted-foreground">Problem Solving</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Assessment in progress</p>
                  <Button className="mt-4" variant="outline">
                    Send Reminder
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-4">
              {candidate.feedback ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm">{candidate.feedback}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Reviewed by Hiring Manager
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No feedback yet</p>
                  <Button className="mt-4" variant="outline">
                    Add Feedback
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6  min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Candidates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and evaluate candidate performance
          </p>
        </div>

        <Button onClick={() => navigate("/create")} className="shadow-lg hover:shadow-xl transition-shadow">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
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
                placeholder="Search by name, email, or assessment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={assessmentFilter} onValueChange={setAssessmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Assessment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assessments</SelectItem>
                  <SelectItem value="Frontend Developer Test">Frontend Developer Test</SelectItem>
                  <SelectItem value="Backend Engineer Assessment">Backend Engineer Assessment</SelectItem>
                  <SelectItem value="Full Stack Challenge">Full Stack Challenge</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Candidate List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">Candidate</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <UserPlus className="mx-auto mb-3 w-12 h-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No candidates found</p>
                      <Button 
                        variant="link" 
                        onClick={() => navigate("/create")}
                        className="mt-2"
                      >
                        Add your first candidate
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => {
                    const StatusIcon = statusIcons[candidate.status as keyof typeof statusIcons];
                    
                    return (
                      <TableRow key={candidate.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {candidate.experience}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{candidate.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{candidate.location}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="text-sm">{candidate.assessment}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.slice(0, 2).map((skill: string) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge className={`${statusColors[candidate.status as keyof typeof statusColors]} gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {candidate.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {candidate.score === "-" ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {candidate.score}
                              </span>
                              <Progress value={parseInt(candidate.score)} className="w-16 h-1" />
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedCandidate(candidate);
                                setViewDialogOpen(true);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="w-4 h-4 mr-2" />
                                Shortlist
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Candidate Dialog */}
      <ViewCandidateDialog 
        candidate={selectedCandidate}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default Candidates;