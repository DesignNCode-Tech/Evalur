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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 opacity-20" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Decrypting AI Content...</p>
      </div>
    );
  }

  const { mcqs = [], codingTasks = [] } = assessment?.content || {};

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" onClick={() => navigate(-1)} className="group rounded-full hover:bg-blue-50">
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Assessment ID: {id}</span>
            <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-1 rounded-full uppercase text-[10px] font-black">
                {assessment.status}
            </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase">{assessment.title}</h1>
          <div className="flex items-center gap-4">
              <Badge variant="secondary" className="rounded-md px-3 py-1 font-bold">{assessment.role}</Badge>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  {assessment.seniority} Difficulty
              </div>
          </div>
        </div>
        <Card className="bg-blue-50 border-none px-6 py-4 rounded-2xl flex flex-col items-center shrink-0">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Items</span>
            <span className="text-2xl font-black text-blue-900">{mcqs.length + codingTasks.length}</span>
        </Card>
      </div>

      <Tabs defaultValue="mcqs" className="w-full flex flex-col gap-8">
        {/* Navigation Tabs - Explicitly centered/left aligned wrapper */}
        <div className="flex justify-start">
          <TabsList className="h-16 inline-flex items-center rounded-[1.5rem] bg-gray-100 p-1.5 text-muted-foreground">
            <TabsTrigger value="mcqs" className="rounded-xl px-8 py-3 font-black uppercase text-xs tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
              <HelpCircle className="h-4 w-4 mr-2" /> MCQs
            </TabsTrigger>
            <TabsTrigger value="coding" className="rounded-xl px-8 py-3 font-black uppercase text-xs tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
              <Code2 className="h-4 w-4 mr-2" /> Coding
            </TabsTrigger>
          </TabsList>
        </div>

        {/* MCQs Section */}
        <TabsContent value="mcqs" className="m-0 space-y-6 outline-none w-full">
          {mcqs.map((q: any, idx: number) => (
            <Card key={idx} className="border-none shadow-xl shadow-gray-200/50 rounded-[2rem] overflow-hidden w-full">
              <CardHeader className="bg-gray-50/50 border-b p-8">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-2xl bg-blue-600 text-white font-black">
                      {idx + 1}
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold leading-tight text-gray-900">{q.question}</CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-2">
                            <Clock className="h-3 w-3" /> ~{q.timeEstimateMinutes} min estimate
                        </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="uppercase text-[9px] font-black tracking-widest border-gray-300 shrink-0">
                    {q.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {q.options.map((opt: string, i: number) => (
                    <div 
                      key={i} 
                      className={cn(
                        "relative p-5 rounded-2xl border-2 transition-all duration-300",
                        i === q.correctOptionIndex 
                          ? "border-green-500 bg-green-50/50 text-green-900 shadow-sm" 
                          : "border-gray-100 bg-white text-gray-600"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold pr-4">{opt}</span>
                        {i === q.correctOptionIndex ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-100 shrink-0" />
                        )}
                      </div>
                      {i === q.correctOptionIndex && (
                          <div className="absolute -top-3 right-4 bg-green-600 text-[8px] text-white font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">Correct Answer</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <div className="w-full p-6 bg-blue-50/50 rounded-[1.5rem] border-2 border-blue-100/50">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" /> AI Logic & Explanation
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">
                      {q.explanation}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Coding Tasks Section */}
        <TabsContent value="coding" className="m-0 space-y-10 outline-none w-full">
          {codingTasks.map((task: any, idx: number) => (
            <Card key={idx} className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden w-full">
              <div className="bg-slate-950 p-10 text-white relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <Code2 className="h-32 w-32" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="h-1 bg-blue-500 w-12 rounded-full" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Coding Task {idx + 1}</span>
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter">{task.title}</h3>
                      <p className="text-slate-400 leading-relaxed max-w-2xl text-lg">{task.description}</p>
                  </div>
                  <Badge className="bg-blue-600 text-white border-none rounded-lg px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] shrink-0">
                      {task.difficulty}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-10 space-y-10 bg-white">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
                      <AlertCircle className="h-3 w-3" /> Logic Constraints
                  </div>
                  <div className="p-6 bg-amber-50/50 rounded-2xl border-2 border-amber-100/50 text-amber-900 text-sm leading-relaxed whitespace-pre-wrap italic">
                    {task.constraints}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Starter Template</Label>
                    <ScrollArea className="h-[300px] w-full rounded-2xl border-2 border-slate-100 bg-slate-900 p-6">
                      <pre className="text-xs text-blue-300 font-mono leading-relaxed">
                        {task.initialCode}
                      </pre>
                    </ScrollArea>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-green-600 ml-2">Ideal Solution</Label>
                    <ScrollArea className="h-[300px] w-full rounded-2xl border-2 border-green-100 bg-[#0d1117] p-6">
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
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={cn("block mb-2", className)}>{children}</span>;
}