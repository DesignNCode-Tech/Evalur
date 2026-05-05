"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAssessments,
  useLibraryDocuments,
  useCandidates,
  useGenerateAssessment,
  useAssignAssessment
} from "@/feature/dashboard/hooks/useAssessment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sparkles,
  FileText,
  Briefcase,
  UserPlus,
  Calendar,
  Send,
  Loader2,
  RefreshCw,
  Check,
  ChevronsUpDown,
  X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AssessmentRequest } from "@/feature/dashboard/api/assessmentApi";

const getStatusStyles = (status: string) => {
  const s = status?.toUpperCase();
  if (s === "READY") return "bg-green-100 text-green-700 border-green-200";
  if (s === "PENDING" || s === "GENERATING") return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

export default function AssessmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isComboOpen, setIsComboOpen] = useState(false);

  const navigate = useNavigate();

  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [targetAssessment, setTargetAssessment] = useState<any>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");

  const [config, setConfig] = useState<AssessmentRequest>({
    title: "",
    role: "",
    seniority: "",
    documentIds: [],
    jobDescription: "",
  });

  const { data: assessments = [], isFetching: isSyncing, isLoading: isAssessmentsLoading, refetch: refreshAssessments } = useAssessments();
  const { data: documents = [] } = useLibraryDocuments();
  const { data: candidates = [] } = useCandidates();

  const generateMutation = useGenerateAssessment();
  const assignMutation = useAssignAssessment();

  const handleGenerate = () => {
    if (!config.title || !config.role || !config.seniority || selectedDocIds.length === 0) {
      toast.error("Please fill all fields and select at least one document");
      return;
    }
    generateMutation.mutate({ ...config, documentIds: selectedDocIds }, {
      onSuccess: () => {
        setShowCreateForm(false);
        resetForm();
        toast.success("AI Assessment Generation Started");
      },
    });
  };

  const handleAssign = () => {
    if (!selectedCandidateId || !targetAssessment) return;
    assignMutation.mutate({
      assessmentId: Number(targetAssessment.id),
      candidateIds: [Number(selectedCandidateId)],
    }, {
      onSuccess: () => {
        setShowAssignDialog(false);
        setSelectedCandidateId("");
        toast.success("Assessment assigned successfully");
      },
    });
  };

  const resetForm = () => {
    setConfig({ title: "", role: "", seniority: "", documentIds: [], jobDescription: "" });
    setSelectedDocIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Assessment Engine</h1>
          <p className="text-muted-foreground">Manage organization evaluations and AI-driven benchmarks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" onClick={() => refreshAssessments()} className="rounded-xl border-2 h-11 w-11">
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          </Button>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} className="rounded-xl font-bold px-6 h-11 bg-slate-900 text-white hover:bg-slate-800">
              <Sparkles className="h-4 w-4 mr-2" /> New Assessment
            </Button>
          )}
        </div>
      </div>

      {showCreateForm && (
        <Card className="rounded-2xl border-2 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-slate-50/50 border-b-2 py-5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black tracking-tight text-slate-900">Evaluation Configurator</CardTitle>
                <CardDescription className="font-semibold text-slate-500">Define the core logic for your AI assessment.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">1. Knowledge Base</Label>
                <div className="h-[300px] overflow-y-auto border-2 rounded-xl p-2 bg-white shadow-inner">
                  {documents.length > 0 ? documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                      <Checkbox
                        id={doc.id}
                        checked={selectedDocIds.includes(doc.id)}
                        className="h-5 w-5 rounded-md border-2"
                        onCheckedChange={(checked) => {
                          setSelectedDocIds(prev => checked ? [...prev, doc.id] : prev.filter(id => id !== doc.id));
                        }}
                      />
                      <label htmlFor={doc.id} className="text-sm font-bold cursor-pointer truncate text-slate-700">{doc.filename}</label>
                    </div>
                  )) : <p className="text-sm text-slate-400 font-medium py-20 text-center">No reference documents found.</p>}
                </div>
              </div>

              <div className="space-y-8">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">2. Target Parameters</Label>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700">Assessment Title</Label>
                    <Input placeholder="e.g. Full Stack Engineer - Q3" className="h-12 rounded-xl border-2 font-bold focus-visible:ring-slate-900" onChange={e => setConfig({ ...config, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Role</Label>
                      <Select onValueChange={v => setConfig({ ...config, role: v })}>
                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold"><SelectValue placeholder="Select Role" /></SelectTrigger>
                        <SelectContent className="rounded-xl border-2 font-bold"><SelectItem value="Backend Developer">Backend Developer</SelectItem><SelectItem value="Frontend Developer">Frontend Developer</SelectItem><SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700">Seniority</Label>
                      <Select onValueChange={v => setConfig({ ...config, seniority: v })}>
                        <SelectTrigger className="h-12 rounded-xl border-2 font-bold"><SelectValue placeholder="Select Level" /></SelectTrigger>
                        <SelectContent className="rounded-xl border-2 font-bold"><SelectItem value="Junior">Junior</SelectItem><SelectItem value="Mid-Level">Mid-Level</SelectItem><SelectItem value="Senior">Senior</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]">
                  {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2" /> Initializing...</> : <><Sparkles className="h-5 w-5 mr-2" /> Generate Assessment</>}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAssessmentsLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-slate-900 mb-4" /><p className="font-black tracking-widest text-xs uppercase text-slate-400">Syncing Registry</p></div>
        ) : assessments.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"><FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" /><p className="text-slate-500 font-bold">No assessments configured.</p></div>
        ) : assessments.map((a: any) => (
          <Card key={a.id} className="rounded-2xl border-2 hover:border-slate-900 transition-all shadow-sm bg-white overflow-hidden group">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors"><FileText className="h-6 w-6" /></div>
                <Badge className={cn("rounded-lg border-2 px-3 py-1 text-[10px] font-black uppercase tracking-tighter", getStatusStyles(a.status))}>{a.status}</Badge>
              </div>
              <div>
                <h4 className="font-black text-xl leading-tight text-slate-900">{a.title}</h4>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest"><Briefcase className="h-3 w-3 mr-1" /> {a.role}</span>
                  <span className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest"><Calendar className="h-3 w-3 mr-1" /> {new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-xs" onClick={() => navigate(`/admin/assessments/view/${a.id}`)}><Eye className="h-4 w-4 mr-2" /> View</Button>
                {a.status === 'READY' && <Button variant="outline" className="flex-1 rounded-xl border-2 font-bold text-xs" onClick={() => { setTargetAssessment(a); setShowAssignDialog(true); }}><UserPlus className="h-4 w-4 mr-2" /> Assign</Button>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-md p-0 bg-white border-2 border-slate-900 shadow-2xl rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 bg-slate-50 border-b-2">
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter">Delegate Assessment</DialogTitle>
            <DialogDescription className="font-semibold text-slate-500">Assigning <span className="text-slate-900 font-bold">"{targetAssessment?.title}"</span> to a candidate.</DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Search Candidate Registry</Label>
              <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-14 justify-between bg-white border-2 rounded-xl px-4 hover:border-slate-900 transition-all font-bold">
                    {selectedCandidateId ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border-2"><AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">{candidates.find(c => c.id.toString() === selectedCandidateId)?.name?.charAt(0)}</AvatarFallback></Avatar>
                        <span className="truncate">{candidates.find(c => c.id.toString() === selectedCandidateId)?.name}</span>
                      </div>
                    ) : <span className="text-slate-400">Select candidate...</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[395px] p-0 border-2 border-slate-900 rounded-xl shadow-2xl bg-white overflow-hidden z-[100]" 
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <Command className="bg-white">
                    <CommandInput placeholder="Search name or email..." className="h-12 border-b font-bold" />
                    <CommandList className="bg-white">
                      <CommandEmpty className="p-4 text-xs font-bold text-slate-400 uppercase text-center bg-white">No results found.</CommandEmpty>
                      <CommandGroup className="bg-white">
                        {candidates.map((candidate: any) => (
                          <CommandItem
                            key={candidate.id}
                            value={candidate.name}
                            onSelect={() => { setSelectedCandidateId(candidate.id.toString()); setIsComboOpen(false); }}
                            className="flex items-center gap-3 p-3 cursor-pointer aria-selected:bg-slate-50 transition-colors"
                          >
                            <Avatar className="h-9 w-9 border-2 shadow-sm"><AvatarFallback className="bg-slate-100 text-slate-900 font-black text-xs">{candidate.name[0]}</AvatarFallback></Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-slate-900 leading-none">{candidate.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 mt-1">{candidate.email}</span>
                            </div>
                            <Check className={cn("ml-auto h-4 w-4 text-slate-900", selectedCandidateId === candidate.id.toString() ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
              <Button onClick={handleAssign} disabled={assignMutation.isPending || !selectedCandidateId} className="flex-[2] h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg">
                {assignMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="h-4 w-4 mr-2" />} Finalize Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}