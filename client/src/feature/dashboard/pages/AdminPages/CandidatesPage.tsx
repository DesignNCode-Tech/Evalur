"use client";

import { useState } from "react";
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
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CandidatesPage() {
  // --- 1. DATA SYNC ---
  const { 
    data: candidates = [], 
    isLoading: isCandidatesLoading, 
    isFetching: isSyncing,
    refetch: refreshCandidates 
  } = useCandidates();

  const { mutateAsync: generateInvite, isPending: isInviting } = useInvite();

  // --- 2. LOCAL UI STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [selectedSeniority, setSelectedSeniority] = useState("Intern");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- 3. HANDLERS ---

  // Aligns with your Postman JSON: { "role": "CANDIDATE", "seniorityLevel": "Intern" }
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
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Candidate Registry</h1>
          <p className="text-gray-500 mt-2 text-lg">Monitor student performance and invite new applicants</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="icon" onClick={() => refreshCandidates()} className="rounded-full h-12 w-12 border-2">
            <RefreshCw className={cn("h-5 w-5 text-gray-400", isSyncing && "animate-spin")} />
          </Button>
          <Button onClick={() => setShowInviteDialog(true)} className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 rounded-full px-8 h-12 text-base font-bold">
            <UserPlus className="h-5 w-5 mr-2" />
            Invite Candidate
          </Button>
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 transition-all shadow-sm text-base"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {candidates.length} Registered Candidates
        </div>
      </div>

      {/* Candidates List */}
      <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-3xl">
        <Table>
          <TableHeader className="bg-gray-50/50 h-16">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-8 font-black text-xs uppercase tracking-widest text-gray-400">Candidate Information</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest text-gray-400">Seniority</TableHead>
              <TableHead className="font-black text-xs uppercase tracking-widest text-gray-400">Test Status</TableHead>
              <TableHead className="text-right pr-8 font-black text-xs uppercase tracking-widest text-gray-400">Overall Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {isCandidatesLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600 mb-4 opacity-20" />
                  <p className="text-gray-400 font-bold uppercase tracking-tighter">Synchronizing Database...</p>
                </TableCell>
              </TableRow>
            ) : filteredCandidates.map((candidate) => (
              <TableRow key={candidate.id} className="group hover:bg-blue-50/30 transition-all border-b border-gray-50">
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-blue-600 text-white font-black text-lg">
                        {candidate.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-lg leading-none group-hover:text-blue-600 transition-colors">{candidate.name}</span>
                      <span className="text-sm text-gray-400 mt-1.5 font-medium">{candidate.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-white text-gray-600 border-gray-200 uppercase text-[10px] font-black tracking-widest">
                    {candidate.seniorityLevel || "Intern"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 w-2 rounded-full",
                        candidate.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    )} />
                    <span className="text-sm font-bold text-gray-700 capitalize">{candidate.status || "Ready"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  {candidate.score ? (
                    <div className="flex items-center justify-end gap-3">
                      <span className="text-xl font-black text-gray-900">{candidate.score}%</span>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-blue-100 hover:text-blue-600">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-200 font-black tracking-widest text-[10px]">EVALUATION PENDING</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modern Invite Generator Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={(open) => {
        setShowInviteDialog(open);
        if (!open) { setInviteLink(""); }
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
          <div className="bg-blue-600 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <LinkIcon className="h-24 w-24" />
            </div>
            <DialogHeader className="relative z-10">
              <DialogTitle className="text-3xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
                Invite Generator
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-base mt-2 font-medium">
                Create a secure registration link for new candidates.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-10 space-y-8 bg-white">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Candidate Seniority</Label>
              <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
                <SelectTrigger className="h-16 bg-gray-50 border-2 border-gray-100 rounded-2xl text-lg font-bold">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 shadow-2xl">
                  <SelectItem value="Intern" className="py-3 font-bold">Intern</SelectItem>
                  <SelectItem value="Junior" className="py-3 font-bold">Junior</SelectItem>
                  <SelectItem value="Senior" className="py-3 font-bold">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!inviteLink ? (
              <Button
                onClick={handleGenerateInvite}
                disabled={isInviting}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-blue-100"
              >
                {isInviting ? (
                  <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Crypting Link...</>
                ) : (
                  <>Generate Invitation</>
                )}
              </Button>
            ) : (
              <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100 relative group">
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] mb-3">Unique Registration Link</p>
                  <code className="text-sm bg-white p-4 rounded-2xl block break-all border-2 border-blue-100 text-gray-600 font-mono leading-relaxed">
                    {inviteLink}
                  </code>
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleCopy} variant="outline" className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all">
                    {copied ? (
                      <><CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Copied</>
                    ) : (
                      <><Copy className="h-5 w-5 mr-2" /> Copy Link</>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-700 transition-all">
                    <Mail className="h-5 w-5 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-10 pb-10 bg-white">
            <Button variant="ghost" className="w-full h-12 text-gray-400 font-bold hover:bg-gray-50 rounded-xl" onClick={() => {
                setShowInviteDialog(false);
                setInviteLink("");
            }}>
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}