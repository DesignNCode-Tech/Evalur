import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  BadgeCheck,
  Shield,
  Lock,
  Unlock,
  Download,
  Upload,
  RefreshCw,
  Eye,
  MessageCircle,
  UserCheck,
  UserX,
  AlertCircle,
  Star,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  
  Camera,
  Save,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Staff role definitions
const roles = [
  { 
    id: "platform_admin", 
    name: "Platform Admin", 
    level: "Global",
    description: "Full system access, infrastructure management, tenant onboarding",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Shield
  },
  { 
    id: "corporate_admin", 
    name: "Corporate Admin", 
    level: "Organizational",
    description: "Department management, billing, global configurations",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Building2
  },
  { 
    id: "engineering_manager", 
    name: "Engineering Manager", 
    level: "Department",
    description: "Knowledge ingestion, assessment generation, evaluation",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: Briefcase
  },
  { 
    id: "hr_manager", 
    name: "HR Manager", 
    level: "Department",
    description: "Candidate management, onboarding coordination",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    icon: Users
  },
  { 
    id: "team_lead", 
    name: "Team Lead", 
    level: "Team",
    description: "Team management, assessment review",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Star
  },
];

// Mock staff data
const staffData = [
  {
    id: 1,
    name: "Namira Mulla",
    email: "namira.mulla@evalur.com",
    phone: "+1 (555) 123-4567",
    role: "platform_admin",
    roleName: "Platform Admin",
    department: "Executive",
    location: "San Francisco, CA",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?img=1",
    permissions: 45,
    managedTeams: 3,
    performance: 98,
    reports: [
      { id: 2, name: "John Smith" },
      { id: 3, name: "Sarah Johnson" }
    ]
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 234-5678",
    role: "corporate_admin",
    roleName: "Corporate Admin",
    department: "Operations",
    location: "New York, NY",
    status: "active",
    joinDate: "2024-01-20",
    lastActive: "2024-02-19",
    avatar: "https://i.pravatar.cc/150?img=2",
    permissions: 38,
    managedTeams: 5,
    performance: 92,
    reports: [
      { id: 4, name: "Mike Brown" },
      { id: 5, name: "Lisa Wilson" }
    ]
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 345-6789",
    role: "engineering_manager",
    roleName: "Engineering Manager",
    department: "Engineering",
    location: "Austin, TX",
    status: "active",
    joinDate: "2024-01-25",
    lastActive: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?img=3",
    permissions: 32,
    managedTeams: 2,
    performance: 95,
    reports: [
      { id: 6, name: "Alex Chen" },
      { id: 7, name: "Emily Davis" }
    ]
  },
  {
    id: 4,
    name: "Mike Brown",
    email: "mike.brown@company.com",
    phone: "+1 (555) 456-7890",
    role: "hr_manager",
    roleName: "HR Manager",
    department: "Human Resources",
    location: "Chicago, IL",
    status: "active",
    joinDate: "2024-02-01",
    lastActive: "2024-02-18",
    avatar: "https://i.pravatar.cc/150?img=4",
    permissions: 28,
    managedTeams: 1,
    performance: 88,
    reports: []
  },
  {
    id: 5,
    name: "Lisa Wilson",
    email: "lisa.wilson@company.com",
    phone: "+1 (555) 567-8901",
    role: "team_lead",
    roleName: "Team Lead",
    department: "Engineering",
    location: "Seattle, WA",
    status: "inactive",
    joinDate: "2024-01-10",
    lastActive: "2024-02-10",
    avatar: "https://i.pravatar.cc/150?img=5",
    permissions: 25,
    managedTeams: 1,
    performance: 85,
    reports: []
  },
  {
    id: 6,
    name: "Alex Chen",
    email: "alex.chen@company.com",
    phone: "+1 (555) 678-9012",
    role: "engineering_manager",
    roleName: "Engineering Manager",
    department: "Engineering",
    location: "San Francisco, CA",
    status: "active",
    joinDate: "2024-02-05",
    lastActive: "2024-02-19",
    avatar: "https://i.pravatar.cc/150?img=6",
    permissions: 30,
    managedTeams: 2,
    performance: 90,
    reports: []
  },
];

const Staff = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: staffData.length,
    active: staffData.filter(s => s.status === "active").length,
    inactive: staffData.filter(s => s.status === "inactive").length,
    platformAdmins: staffData.filter(s => s.role === "platform_admin").length,
    corporateAdmins: staffData.filter(s => s.role === "corporate_admin").length,
    managers: staffData.filter(s => s.role === "engineering_manager").length,
  };

  const handleAddStaff = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match.",
      });
      return;
    }
    toast.success("Staff Added", {
      description: `${formData.name} has been added successfully.`,
    });
    setShowAddDialog(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      location: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleUpdateStaff = () => {
    toast.success("Staff Updated", {
      description: "Staff information has been updated successfully.",
    });
    setShowEditDialog(false);
  };

  const handleDeleteStaff = () => {
    toast.error("Staff Removed", {
      description: "Staff member has been removed from the system.",
    });
    setShowDeleteDialog(false);
    setShowViewDialog(false);
  };

  const handleStatusToggle = (staffId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toast.success(`Staff ${newStatus === "active" ? "Activated" : "Deactivated"}`, {
      description: `Staff member has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    });
  };

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? (
      <Badge className={role.color}>
        {role.name}
      </Badge>
    ) : (
      <Badge variant="outline">{roleId}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">Inactive</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage platform administrators, managers, and team members
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="shadow-lg">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Platform Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.platformAdmins}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Corporate Admins</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.corporateAdmins}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Managers</p>
                  <p className="text-2xl font-bold text-green-600">{stats.managers}</p>
                </div>
                <Briefcase className="w-8 h-8 text-green-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
                </div>
                <UserX className="w-8 h-8 text-gray-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Staff Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                        <p className="text-muted-foreground">No staff members found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((staff) => (
                      <TableRow key={staff.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {staff.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-xs text-muted-foreground">{staff.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(staff.role)}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{staff.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(staff.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{new Date(staff.joinDate).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={staff.performance} className="w-20 h-1" />
                            <span className="text-sm font-medium">{staff.performance}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setSelectedStaff(staff);
                                setShowViewDialog(true);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedStaff(staff);
                                setShowEditDialog(true);
                              }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusToggle(staff.id, staff.status)}>
                                {staff.status === "active" ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Staff Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Create a new staff account with role-based permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} - {role.level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Engineering, HR, etc."
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Staff Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStaff && (
            <>
              <DialogHeader>
                <DialogTitle>Staff Details</DialogTitle>
                <DialogDescription>
                  Complete information about {selectedStaff.name}
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="profile" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedStaff.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                        {selectedStaff.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{selectedStaff.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(selectedStaff.role)}
                        {getStatusBadge(selectedStaff.status)}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {selectedStaff.email}
                        <span className="mx-2">•</span>
                        <Phone className="w-4 h-4" />
                        {selectedStaff.phone}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Department</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{selectedStaff.department}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Location</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{selectedStaff.location}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Join Date</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{new Date(selectedStaff.joinDate).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Last Active</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{new Date(selectedStaff.lastActive).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Full System Access</span>
                          <Switch checked={selectedStaff.role === "platform_admin"} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Department Management</span>
                          <Switch checked={selectedStaff.role !== "team_lead"} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Assessment Creation</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Candidate Management</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Billing Access</span>
                          <Switch checked={selectedStaff.role === "corporate_admin" || selectedStaff.role === "platform_admin"} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Permission Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{selectedStaff.permissions}/50</div>
                        <Progress value={(selectedStaff.permissions / 50) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="team" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Managed Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-2">{selectedStaff.managedTeams}</p>
                      <p className="text-sm text-muted-foreground">Teams under management</p>
                    </CardContent>
                  </Card>
                  {selectedStaff.reports && selectedStaff.reports.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Direct Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedStaff.reports.map((report: any) => (
                            <div key={report.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{report.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{report.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Overall Performance</span>
                            <span className="text-sm font-medium">{selectedStaff.performance}%</span>
                          </div>
                          <Progress value={selectedStaff.performance} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">45</p>
                            <p className="text-xs text-muted-foreground">Assessments Created</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-2xl font-bold">128</p>
                            <p className="text-xs text-muted-foreground">Candidates Reviewed</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setShowViewDialog(false);
                  setShowEditDialog(true);
                }}>
                  Edit Profile
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update staff information and role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" defaultValue={selectedStaff?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" type="email" defaultValue={selectedStaff?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select defaultValue={selectedStaff?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input id="edit-department" defaultValue={selectedStaff?.department} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" defaultValue={selectedStaff?.location} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStaff}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedStaff?.name}'s account
              and remove all associated data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Staff;