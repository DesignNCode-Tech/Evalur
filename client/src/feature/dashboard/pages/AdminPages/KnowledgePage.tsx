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
  FileUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ingest Knowledge</h1>
          <p className="text-gray-500 mt-2 text-lg">Upload technical documentation to train your evaluation AI</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => refetch()} className="rounded-full h-12 w-12 border-2">
          <RefreshCw className={cn("h-5 w-5 text-gray-400", isFetching && "animate-spin")} />
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50 transition-all group relative overflow-hidden rounded-[2rem]">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Upload Docs</h3>
                <p className="text-sm text-gray-500 mt-1">PDF, TXT, or Markdown</p>
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
                className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-bold h-12 rounded-xl"
              >
                {uploadMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <FileUp className="mr-2 h-4 w-4" />}
                Select File
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-gray-50/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-blue-600" />
              <h4 className="font-bold text-gray-900">Storage Stats</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Documents</span>
                <span className="font-bold text-gray-900">{documents.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[45%]" />
              </div>
            </div>
          </Card>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search knowledge base..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 transition-all text-base"
            />
          </div>

          <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <div className="bg-white p-2">
              {isLoading ? (
                <div className="py-20 text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600 opacity-20" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Knowledge Vault...</p>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-20 text-center text-gray-400 italic">
                  No documents found in the current organization.
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredDocs.map((doc: any) => (
                    <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                          <FileText className="h-6 w-6 text-gray-500 group-hover:text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 leading-tight">{doc.filename}</span>
                          <span className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Processed: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-black text-[10px] uppercase">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Vectorized
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
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