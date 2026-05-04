"use client";

import { useState } from "react";
// Import your custom hooks
import {
  useAssessments,
  useLibraryDocuments,
  useCandidates,
  useGenerateAssessment,
  useAssignAssessment
} from "@/feature/dashboard/hooks/useAssessment";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MoreVertical,
  Send,
  Loader2,
  RefreshCw,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AssessmentRequest } from "@/feature/dashboard/api/assessmentApi";
import { useNavigate } from "react-router-dom";

export default function AssessmentsPage() {
  // UI State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isComboOpen, setIsComboOpen] = useState(false);

  const navigate = useNavigate();

  // Selection State
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

  // --- 1. DATA SYNC (USING CUSTOM HOOKS) ---
  const {
    data: assessments = [],
    isFetching: isSyncing,
    isLoading: isAssessmentsLoading,
    refetch: refreshAssessments
  } = useAssessments();

  const { data: documents = [] } = useLibraryDocuments();
  const { data: candidates = [], isLoading: isCandidatesLoading } = useCandidates();

  // --- 2. ACTIONS (USING CUSTOM MUTATIONS) ---
  const generateMutation = useGenerateAssessment();
  const assignMutation = useAssignAssessment();

  // --- 3. HANDLERS ---
  const handleGenerate = () => {
    if (!config.title || !config.role || !config.seniority || selectedDocIds.length === 0) {
      toast.error("Please fill all fields and select at least one document");
      return;
    }

    generateMutation.mutate(
      { ...config, documentIds: selectedDocIds },
      {
        onSuccess: () => {
          setShowCreateForm(false);
          resetForm();
        },
      }
    );
  };

  const handleAssign = () => {
    if (!selectedCandidateId || !targetAssessment) return;

    // Convert string IDs to numbers for Spring Boot Long compatibility
    assignMutation.mutate(
      {
        assessmentId: Number(targetAssessment.id),
        candidateIds: [Number(selectedCandidateId)],
      },
      {
        onSuccess: () => {
          setShowAssignDialog(false);
          setSelectedCandidateId("");
        },
      }
    );
  };

  const resetForm = () => {
    setConfig({ title: "", role: "", seniority: "", documentIds: [], jobDescription: "" });
    setSelectedDocIds([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Assessments</h1>
          <p className="text-gray-500 mt-2">Manage organization evaluations with AI intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refreshAssessments()} className="rounded-full">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          </Button>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg px-6 rounded-full">
              <Sparkles className="h-4 w-4 mr-2" /> New Assessment
            </Button>
          )}
        </div>
      </div>

      {/* Creation Form Card */}
      {showCreateForm && (
        <Card className="border-blue-200 shadow-xl bg-blue-50/20 overflow-hidden border-2">
          <CardHeader className="bg-white border-b py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Evaluation Configuration</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} className="text-gray-400">Cancel</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label className="text-base font-bold">1. Knowledge Base</Label>
                <div className="max-h-[240px] overflow-y-auto border-2 rounded-xl p-4 bg-white shadow-inner scrollbar-hide">
                  {documents.length > 0 ? documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center space-x-3 py-2.5 border-b last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors">
                      <Checkbox
                        id={doc.id}
                        checked={selectedDocIds.includes(doc.id)}
                        onCheckedChange={(checked) => {
                          setSelectedDocIds(prev => checked ? [...prev, doc.id] : prev.filter(id => id !== doc.id));
                        }}
                      />
                      <label htmlFor={doc.id} className="text-sm font-medium cursor-pointer truncate text-gray-700">{doc.filename}</label>
                    </div>
                  )) : <p className="text-sm text-gray-400 italic py-4 text-center">No documents found.</p>}
                </div>
              </div>

              <div className="space-y-6">
                <Label className="text-base font-bold">2. Job Parameters</Label>
                <div className="space-y-4">
                  <Input placeholder="Internal Assessment Title (e.g. Java Intern Q3)" className="bg-white h-12" onChange={e => setConfig({ ...config, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Select onValueChange={v => setConfig({ ...config, role: v })}>
                      <SelectTrigger className="bg-white h-12"><SelectValue placeholder="Target Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                        <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                        <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={v => setConfig({ ...config, seniority: v })}>
                      <SelectTrigger className="bg-white h-12"><SelectValue placeholder="Seniority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleGenerate} disabled={generateMutation.isPending} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg shadow-md shadow-blue-100 rounded-xl">
                  {generateMutation.isPending ? <><Loader2 className="animate-spin mr-2" /> Waking up Gemini...</> : "Generate AI Evaluation"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Section */}
      <div className="space-y-4">
        {isAssessmentsLoading ? (
          <div className="flex flex-col items-center py-20 gap-4 opacity-50">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Syncing Dashboard...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium">No active assessments found in your organization.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {assessments.map((a: any) => (
              <Card key={a.id} className="hover:border-blue-500 transition-all shadow-sm border-2 group bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                      <FileText className="h-7 w-7 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 tracking-tight">{a.title}</h4>
                      <div className="flex gap-4 text-xs text-gray-400 font-semibold mt-1">
                        <span className="flex items-center gap-1 uppercase tracking-wider"><Briefcase className="h-3 w-3" /> {a.role}</span>
                        <span className="flex items-center gap-1 uppercase tracking-wider"><Calendar className="h-3 w-3" /> {new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <Badge variant={a.status === 'READY' ? 'default' : 'secondary'} className={cn(
                      "px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border-2",
                      a.status === 'READY' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                    )}>
                      {a.status}
                    </Badge>

                    {a.status === 'READY' && (
                      <Button size="sm" variant="outline" onClick={() => { setTargetAssessment(a); setShowAssignDialog(true); }} className="rounded-full border-blue-100 hover:bg-blue-50 hover:text-blue-700 font-bold px-5">
                        <UserPlus className="h-4 w-4 mr-2" /> Assign
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-900"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                    {a.status === 'READY' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/assessments/view/${a.id}`)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-2" /> View
                        </Button>

                       
                      </>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Professional Searchable Assign Modal */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <div className="bg-blue-600 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                <UserPlus className="h-6 w-6" />
                Assign Evaluation
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm mt-1 leading-relaxed">
                Inviting a candidate to take the <span className="font-bold underline text-white">"{targetAssessment?.title}"</span> assessment.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8 bg-white">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Search Candidate</Label>

              <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full h-16 justify-between bg-gray-50/50 border-2 border-gray-100 hover:border-blue-400 transition-all px-4 rounded-2xl"
                  >
                    {selectedCandidateId ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-blue-600 text-white font-bold">
                            {candidates.find(c => c.id.toString() === selectedCandidateId)?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-gray-900 leading-none">
                            {candidates.find(c => c.id.toString() === selectedCandidateId)?.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase">
                            {candidates.find(c => c.id.toString() === selectedCandidateId)?.seniorityLevel}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-medium">Search by name or email...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-30" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[415px] p-0 shadow-2xl border-none rounded-2xl overflow-hidden" align="start">
                  <Command className="border-none">
                    <CommandInput placeholder="Type to search..." className="h-12" />
                    <CommandList className="max-h-[320px]">
                      <CommandEmpty className="p-6 text-center text-gray-400 italic">No candidates found.</CommandEmpty>
                      <CommandGroup>
                        {candidates.map((candidate: any) => (
                          <CommandItem
                            key={candidate.id}
                            value={candidate.name}
                            onSelect={() => {
                              setSelectedCandidateId(candidate.id.toString());
                              setIsComboOpen(false);
                            }}
                            className="flex items-center justify-between py-4 px-5 cursor-pointer aria-selected:bg-blue-50"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">
                                  {candidate.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900 leading-none">{candidate.name}</span>
                                <span className="text-[10px] text-gray-400 font-semibold mt-1">{candidate.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="text-[9px] uppercase font-black tracking-tighter py-0.5">
                                {candidate.seniorityLevel}
                              </Badge>
                              <Check
                                className={cn(
                                  "h-4 w-4 text-blue-600",
                                  selectedCandidateId === candidate.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="ghost"
                className="flex-1 h-14 font-bold text-gray-400 hover:text-gray-900 rounded-2xl"
                onClick={() => setShowAssignDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={assignMutation.isPending || !selectedCandidateId}
                className="flex-[2] h-14 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest shadow-lg shadow-green-50 rounded-2xl transition-transform active:scale-95"
              >
                {assignMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                Finalize
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}