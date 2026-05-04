"use client";

import { useState, useEffect } from "react";
import type { AssessmentRequest } from "@/feature/dashboard/api/assessmentApi";
import assessmentService from "@/feature/dashboard/api/assessmentApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  UserPlus, 
  Calendar, 
  MoreVertical, 
  Send, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function AssessmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data State
  const [assessments, setAssessments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  
  // Selection State
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [targetAssessment, setTargetAssessment] = useState<any>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");

  // Form State
  const [config, setConfig] = useState<AssessmentRequest>({
    title: "",
    role: "",
    seniority: "",
    documentIds: [],
    jobDescription: "",
  });

  // Initial Data Fetch
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsSyncing(true);
    try {
      const [assessList, docList, memberList] = await Promise.all([
        assessmentService.getAssessments(),
        assessmentService.getLibraryDocuments(),
        assessmentService.getOrgMembers()
      ]);
      
      setAssessments(assessList);
      setDocuments(docList);
      // Filter members to only show Candidates for assignment
      setCandidates(memberList.filter((m: any) => m.role === "CANDIDATE"));
    } catch (error) {
      toast.error("Failed to sync with Evalur backend");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerate = async () => {
    if (!config.title || !config.role || !config.seniority || selectedDocIds.length === 0) {
      toast.error("Please provide a title, role, seniority, and at least one document");
      return;
    }

    setIsGenerating(true);
    try {
      await assessmentService.generateAssessment({ 
        ...config, 
        documentIds: selectedDocIds 
      });
      
      toast.success("AI Pipeline triggered successfully!");
      setShowCreateForm(false);
      resetForm();
      loadDashboardData(); // Refresh list to show 'GENERATING' status
    } catch (error) {
      toast.error("Generation request failed. Check server logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCandidateId || !targetAssessment) return;

    try {
      await assessmentService.assignAssessment({
        assessmentId: targetAssessment.id,
        candidateIds: [selectedCandidateId]
      });
      
      toast.success(`Assigned to candidate successfully`);
      setShowAssignDialog(false);
      setSelectedCandidateId("");
      loadDashboardData();
    } catch (error) {
      toast.error("Assignment failed. Candidate might already be assigned.");
    }
  };

  const resetForm = () => {
    setConfig({ title: "", role: "", seniority: "", documentIds: [], jobDescription: "" });
    setSelectedDocIds([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Assessments</h1>
          <p className="text-gray-500 mt-2">Manage AI-driven evaluations for your organization</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
            <Sparkles className="h-4 w-4 mr-2" /> New Assessment
          </Button>
        )}
      </div>

      {/* Generation Form */}
      {showCreateForm && (
        <Card className="border-blue-200 shadow-xl bg-blue-50/20 overflow-hidden">
          <CardHeader className="bg-white border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Assessment Configuration</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Knowledge Base */}
              <div className="space-y-4">
                <Label className="text-base">1. Knowledge Base Selection</Label>
                <div className="max-h-[240px] overflow-y-auto border-2 rounded-xl p-4 bg-white shadow-inner">
                  {documents.length > 0 ? documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center space-x-3 py-2 border-b last:border-0">
                      <Checkbox 
                        id={doc.id} 
                        checked={selectedDocIds.includes(doc.id)}
                        onCheckedChange={(checked) => {
                          setSelectedDocIds(prev => checked ? [...prev, doc.id] : prev.filter(id => id !== doc.id));
                        }}
                      />
                      <label htmlFor={doc.id} className="text-sm font-medium leading-none cursor-pointer truncate">
                        {doc.filename}
                      </label>
                    </div>
                  )) : <p className="text-sm text-gray-400 italic">No documents uploaded yet.</p>}
                </div>
                <div className="space-y-2">
                  <Label>Job Description (Context for AI)</Label>
                  <Textarea 
                    placeholder="Paste the JD here to help Gemini tailor the questions..." 
                    className="h-24 bg-white"
                    onChange={e => setConfig({...config, jobDescription: e.target.value})}
                  />
                </div>
              </div>

              {/* Right Column: Parameters */}
              <div className="space-y-5">
                <Label className="text-base">2. Evaluation Parameters</Label>
                <div className="space-y-2">
                  <Label>Internal Assessment Title</Label>
                  <Input 
                    placeholder="e.g. Senior Java Engineer - Q3 Hiring" 
                    className="bg-white"
                    onChange={e => setConfig({...config, title: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Role</Label>
                    <Select onValueChange={v => setConfig({...config, role: v})}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Select Role" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                        <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                        <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Seniority</Label>
                    <Select onValueChange={v => setConfig({...config, seniority: v})}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Level" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg mt-4"
                >
                  {isGenerating ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : "Start Generation"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Available Evaluations</h2>
          {isSyncing && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>
        
        {assessments.length === 0 && !isSyncing ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No assessments found for your organization.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {assessments.map((a: any) => (
              <Card key={a.id} className="hover:border-blue-400 transition-all cursor-default group shadow-sm">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{a.title}</h4>
                      <div className="flex gap-4 text-sm text-gray-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {a.role}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={a.status === 'READY' ? 'default' : 'secondary'} className={
                      a.status === 'READY' ? 'bg-green-100 text-green-700 border-green-200' : 
                      a.status === 'GENERATING' ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse' : 'bg-red-100 text-red-700'
                    }>
                      {a.status}
                    </Badge>
                    
                    {a.status === 'READY' && (
                      <Button size="sm" variant="outline" onClick={() => { setTargetAssessment(a); setShowAssignDialog(true); }}>
                        <UserPlus className="h-4 w-4 mr-2" /> Assign
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-gray-400"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Assessment</DialogTitle>
            <DialogDescription>Distribute "{targetAssessment?.title}" to a verified organization member.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Select Candidate</Label>
              <Select onValueChange={setSelectedCandidateId}>
                <SelectTrigger><SelectValue placeholder="Choose from members..." /></SelectTrigger>
                <SelectContent>
                  {candidates.map((m: any) => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name} ({m.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssign} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-xl">
              <Send className="h-4 w-4 mr-2" /> Finalize Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}