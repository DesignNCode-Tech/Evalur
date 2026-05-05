"use client";

import { useState, useRef } from "react";
import { useLibraryDocuments, useUploadDocument } from "@/feature/dashboard/hooks/useAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UploadCloud, 
  FileText, 
  Database, 
  Search, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Loader2,
  FileUp,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function KnowledgePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: documents = [], isLoading, isFetching, refetch } = useLibraryDocuments();
  const uploadMutation = useUploadDocument();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const filteredDocs = documents.filter((doc: any) => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Knowledge Ingestion</h1>
          <p className="text-muted-foreground mt-1">Refine your evaluation AI with technical documentation and context.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetch()} 
            className="rounded-xl border-2 h-11 w-11 transition-all active:scale-95"
          >
            <RefreshCw className={cn("h-4 w-4 text-slate-500", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Upload & Stats Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 border-slate-200 bg-white shadow-sm overflow-hidden rounded-2xl transition-all">
            <CardHeader className="bg-slate-50/50 border-b-2 py-5">
              <CardTitle className="text-lg font-bold text-slate-900">Upload Source</CardTitle>
              <CardDescription className="font-medium">Supports PDF, TXT, or Markdown</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-full aspect-square max-w-[180px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group hover:border-slate-900 transition-colors cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-slate-900 transition-colors mb-2" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">Drop File</span>
              </div>
              
              <Input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                accept=".pdf,.txt,.md"
              />
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-12 rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                {uploadMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <FileUp className="mr-2 h-4 w-4" />}
                Select Document
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-slate-200 shadow-sm bg-slate-900 p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-5 w-5 text-slate-300" />
              <h4 className="font-bold text-white uppercase tracking-widest text-xs">Knowledge Volume</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black tracking-tighter">{documents.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Vectors</p>
                </div>
                <Badge className="bg-slate-800 text-slate-300 border-none font-bold">45% Capacity</Badge>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[45%] transition-all duration-1000" />
              </div>
            </div>
          </Card>
        </div>

        {/* Knowledge Base Registry */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search knowledge base..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white border-2 border-slate-200 rounded-xl focus:border-slate-900 transition-all text-base font-medium"
            />
          </div>

          <Card className="border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <div className="p-2">
              {isLoading ? (
                <div className="py-24 text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-slate-900 opacity-20" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Vault...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-24 text-center">
                  <FileText className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic text-sm">No protocols found in current registry.</p>
                </div>
              ) : (
                <div className="divide-y-2 divide-slate-50">
                  {filteredDocs.map((doc: any) => (
                    <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-lg leading-tight">{doc.filename}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-black text-[10px] uppercase tracking-tighter px-3 py-1 rounded-lg">
                          <CheckCircle2 className="h-3 w-3 mr-1.5" /> Vectorized
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}