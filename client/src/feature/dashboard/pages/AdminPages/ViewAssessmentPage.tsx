"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useCompleteAssessment } from "@/feature/dashboard/hooks/useAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, 
  Loader2, 
  HelpCircle, 
  Code2, 
  Clock, 
  BrainCircuit, 
  CheckCircle2,
  Trophy,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ViewAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useCompleteAssessment(id!);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-slate-900 opacity-20" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing Protocol...</p>
      </div>
    );
  }

  const { mcqs = [], codingTasks = [] } = assessment?.content || {};

  return (
    /* 
       FLEX FIX: Ensure the main container is a flex column 
       to prevent any horizontal squashing.
    */
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Navigation Header */}
      <div className="flex flex-row items-center justify-between w-full">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="group rounded-xl hover:bg-slate-100 font-bold border-2 border-transparent hover:border-slate-200 transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Button>
        <div className="flex flex-row items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID: {id}</span>
            <Badge className="bg-green-50 text-green-700 border-2 border-green-100 px-4 py-1 rounded-lg uppercase text-[9px] font-black tracking-tighter">
                {assessment.status}
            </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="w-full rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-col space-y-3">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                {assessment.title}
              </h1>
              <div className="flex flex-row items-center gap-4">
                  <Badge variant="secondary" className="rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest bg-slate-100 text-slate-600 border-none">
                      {assessment.role}
                  </Badge>
                  <Separator orientation="vertical" className="h-4 bg-slate-200" />
                  <div className="flex flex-row items-center gap-2 text-slate-500 text-sm font-bold">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      {assessment.seniority} Difficulty
                  </div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl flex flex-col items-center justify-center shrink-0 min-w-[140px] shadow-xl">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Items</span>
                <span className="text-3xl font-black text-white tracking-tighter mt-1">
                  {mcqs.length + codingTasks.length}
                </span>
            </div>
        </CardContent>
      </Card>

      {/* 
          TABS FLEX FIX: 
          Forcing the Tabs component to be a flex container with 100% width.
      */}
      <div className="flex flex-col w-full items-stretch"> 
        <Tabs defaultValue="mcqs" className="w-full flex flex-col space-y-8">
          <div className="flex flex-row justify-start">
            <TabsList className="flex flex-row h-14 bg-slate-100 rounded-xl p-1 border-2 border-slate-200">
              <TabsTrigger value="mcqs" className="rounded-lg px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                <HelpCircle className="h-4 w-4 mr-2" /> Objective MCQs
              </TabsTrigger>
              <TabsTrigger value="coding" className="rounded-lg px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                <Code2 className="h-4 w-4 mr-2" /> Algorithmic Tasks
              </TabsTrigger>
            </TabsList>
          </div>

          {/* MCQs Section */}
          <TabsContent value="mcqs" className="flex flex-col w-full space-y-6 m-0 p-0 outline-none border-none">
            {mcqs.map((q: any, idx: number) => (
              <Card key={idx} className="flex flex-col w-full border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b-2 p-8 flex flex-col">
                  <div className="flex flex-row justify-between items-start gap-4">
                    <div className="flex flex-row gap-5">
                      <div className="flex items-center justify-center h-12 w-12 shrink-0 rounded-xl bg-slate-900 text-white font-black text-lg shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col">
                          <CardTitle className="text-xl font-bold text-slate-900 leading-snug">{q.question}</CardTitle>
                          <div className="mt-3 flex flex-row items-center gap-4">
                              <span className="flex flex-row items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <Clock className="h-3 w-3" /> ~{q.timeEstimateMinutes} MINS
                              </span>
                              <Badge className="bg-white border-2 border-slate-200 text-slate-500 font-black text-[9px] uppercase px-2 py-0">
                                  {q.difficulty}
                              </Badge>
                          </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 flex flex-col">
                  {/* Grid of options - using flex wrap for responsiveness */}
                  <div className="flex flex-wrap md:flex-row gap-4 w-full">
                    {q.options.map((opt: string, i: number) => (
                      <div 
                        key={i} 
                        className={cn(
                          "relative p-5 rounded-xl border-2 transition-all duration-200 flex flex-row items-center justify-between",
                          "w-full md:w-[calc(50%-0.5rem)]", // Flexbox equivalent of grid-cols-2
                          i === q.correctOptionIndex 
                            ? "border-green-500 bg-green-50/30 text-green-900 ring-2 ring-green-500/10" 
                            : "border-slate-100 bg-white text-slate-600"
                        )}
                      >
                        <span className="font-bold text-sm pr-4">{opt}</span>
                        <div className="flex items-center">
                          {i === q.correctOptionIndex ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                          ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-slate-100 shrink-0" />
                          )}
                        </div>
                        {i === q.correctOptionIndex && (
                            <div className="absolute -top-3 right-4 bg-green-600 text-[8px] text-white font-black px-2 py-0.5 rounded uppercase tracking-[0.1em] shadow-sm">KEY SOLUTION</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-0 flex">
                  <div className="w-full p-6 bg-slate-50 rounded-xl border-2 border-slate-100 flex flex-col">
                    <div className="flex flex-row items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      <BrainCircuit className="h-4 w-4 text-slate-900" /> AI Pedagogical Logic
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {q.explanation}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          {/* Coding Section */}
          <TabsContent value="coding" className="flex flex-col w-full space-y-10 m-0 p-0 outline-none border-none">
            {codingTasks.map((task: any, idx: number) => (
              <Card key={idx} className="flex flex-col w-full border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-900 p-10 text-white relative flex flex-col">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <Code2 className="h-40 w-40" />
                  </div>
                  <div className="relative z-10 flex flex-col space-y-6">
                    <div className="flex flex-row items-center gap-3">
                        <div className="h-1 bg-slate-500 w-12 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-xs">ALGORITHMIC TASK {idx + 1}</span>
                    </div>
                    <div className="flex flex-row justify-between items-start gap-4">
                      <div className="flex flex-col space-y-2">
                          <h3 className="text-3xl font-black tracking-tighter leading-none">{task.title}</h3>
                          <p className="text-slate-400 leading-relaxed max-w-4xl text-lg font-medium">{task.description}</p>
                      </div>
                      <Badge className="bg-slate-800 text-slate-300 border-none rounded-lg px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] shrink-0">
                          {task.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-10 flex flex-col space-y-10">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
                        <AlertCircle className="h-4 w-4" /> Technical Constraints
                    </div>
                    <div className="p-6 bg-amber-50/30 rounded-xl border-2 border-amber-100 font-bold text-amber-900 text-sm leading-relaxed whitespace-pre-wrap">
                      {task.constraints}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col flex-1 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Starter Template</Label>
                      <ScrollArea className="h-[400px] w-full rounded-xl border-2 border-slate-100 bg-slate-900 p-6 shadow-inner">
                        <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                          {task.initialCode}
                        </pre>
                      </ScrollArea>
                    </div>

                    <div className="flex flex-col flex-1 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-green-600 ml-1">Optimized Reference</Label>
                      <ScrollArea className="h-[400px] w-full rounded-xl border-2 border-green-100 bg-[#0d1117] p-6 shadow-inner">
                        <pre className="text-xs text-green-400 font-mono leading-relaxed">
                          {task.solutionTemplate}
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={cn("block mb-2 font-bold", className)}>{children}</span>;
}