"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidates } from "@/feature/dashboard/hooks/useAssessment";
import { useInvite } from '@/feature/dashboard/hooks/useInvite';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Loader2,
  Mail,
  Search,
  RefreshCw,
  FileText,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const getStatusStyles = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "COMPLETED") return "bg-green-100 text-green-700 border-green-200";
  if (s === "SUBMITTED") return "bg-blue-100 text-blue-700 border-blue-200";
  if (s === "STARTED") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

export default function CandidatesPage() {
  const navigate = useNavigate();
  
  // --- 1. DATA SYNC ---
  const { data: candidates = [], isLoading, isFetching, refetch } = useCandidates();
  const { mutateAsync: generateInvite, isPending: isInviting } = useInvite();

  // --- 2. LOCAL UI STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState("Intern");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- 3. HANDLERS ---
  const handleGenerateInvite = async () => {
    try {
      const res = await generateInvite({
        role: "CANDIDATE",
        seniorityLevel: selectedSeniority,
      });
      setInviteLink(res.inviteLink);
      toast.success(`${selectedSeniority} invite link generated!`);
    } catch (err) {
      toast.error("Failed to generate invitation link");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Candidate Management</h1>
          <p className="text-muted-foreground">Manage multi-assessment trajectories for all applicants.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" onClick={() => refetch()} className="rounded-xl">
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
          {/*  RESTORED ONCLICK HANDLER HERE */}
          <Button 
            className="rounded-xl font-bold px-6 bg-slate-900 text-white hover:bg-slate-800"
            onClick={() => setShowInviteDialog(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Invite
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search candidates..." 
          className="pl-10 h-12 rounded-xl border-2" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="rounded-2xl overflow-hidden border-2 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px] font-bold">Candidate</TableHead>
              <TableHead className="font-bold">Assigned Assessments</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
            ) : filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id} className="hover:bg-slate-50/50">
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-slate-200 text-slate-700 font-bold">{candidate.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm leading-none">{candidate.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{candidate.email}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {candidate.userAssessments?.length > 0 ? (
                      candidate.userAssessments.map((ua) => (
                        <div 
                          key={ua.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer hover:ring-2 ring-primary/20 transition-all",
                            getStatusStyles(ua.evaluationStatus)
                          )}
                          onClick={() => ua.evaluationStatus === "COMPLETED" && navigate(`/admin/assessments/view/${ua.id}/result`)}
                        >
                          <FileText className="h-3 w-3" />
                          <span>{ua.assessment.title}</span>
                          {ua.objectiveScore !== null && (
                            <span className="ml-1 px-1.5 py-0.5 bg-white/50 rounded text-[10px]">
                              {ua.objectiveScore}%
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No assessments assigned</span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="rounded-lg group">
                    View Profile <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

     
     {/* Clean, Minimalist Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={(open) => {
        setShowInviteDialog(open);
        if (!open) { setInviteLink(""); }
      }}>
        <DialogContent className="sm:max-w-md p-6 bg-white border-slate-200 shadow-lg rounded-xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              Invite Generator
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a secure registration link for new candidates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Candidate Seniority</Label>
              <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
                <SelectTrigger className="w-full h-11 bg-white border-slate-200 rounded-md text-slate-900 focus:ring-1 focus:ring-slate-900 transition-all">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-md shadow-md">
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!inviteLink ? (
              <Button
                onClick={handleGenerateInvite}
                disabled={isInviting}
                className="w-full h-11 bg-[#0f172a] hover:bg-slate-800 text-white rounded-md font-medium transition-colors"
              >
                {isInviting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  "Generate Invitation"
                )}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Registration Link</p>
                  <code className="text-sm text-slate-800 break-all select-all font-mono">
                    {inviteLink}
                  </code>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCopy} 
                    variant="outline" 
                    className="flex-1 h-11 rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copied ? (
                      <><CheckCircle className="h-4 w-4 mr-2 text-slate-900" /> Copied</>
                    ) : (
                      <><Copy className="h-4 w-4 mr-2" /> Copy Link</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-2" /> Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
