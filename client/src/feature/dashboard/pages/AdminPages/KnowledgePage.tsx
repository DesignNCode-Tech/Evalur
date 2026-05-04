"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Upload,
  FileText,
  Trash2,
  Database,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/providers/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "markdown" | "github";
  size: number;
  pages?: number;
  chunks?: number;
  uploadDate: string;
  status: "processing" | "completed" | "failed";
  error?: string;
  url?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "failed";
}

export default function KnowledgeBasePage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [processingGithub, setProcessingGithub] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChunks: 0,
    storageUsed: "0 MB",
  });

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/knowledge/documents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Mock data for development
      setDocuments([
        {
          id: "1",
          name: "Company_Architecture_Guide.pdf",
          type: "pdf",
          size: 2516582,
          pages: 45,
          chunks: 128,
          uploadDate: new Date().toISOString(),
          status: "completed",
        },
        {
          id: "2",
          name: "API_Documentation.md",
          type: "markdown",
          size: 159744,
          chunks: 32,
          uploadDate: new Date(Date.now() - 86400000).toISOString(),
          status: "completed",
        },
        {
          id: "3",
          name: "Coding_Standards.pdf",
          type: "pdf",
          size: 1048576,
          pages: 28,
          chunks: 76,
          uploadDate: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/knowledge/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({
          totalDocuments: documents.length,
          totalChunks: documents.reduce((acc, doc) => acc + (doc.chunks || 0), 0),
          storageUsed: "4.2 MB",
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".markdown")
    );

    if (validFiles.length === 0) {
      toast.error("Please upload PDF or Markdown files only");
      return;
    }

    setUploading(true);
    const newProgress: UploadProgress[] = validFiles.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading",
    }));
    setUploadProgress(newProgress);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name ? { ...p, progress: 30 } : p
          )
        );

        const response = await fetch("/api/knowledge/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name ? { ...p, progress: 60, status: "processing" } : p
          )
        );

        const result = await response.json();
        await pollProcessingStatus(result.documentId, file.name);

        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name
              ? { ...p, progress: 100, status: "completed" }
              : p
          )
        );

        toast.success(`${file.name} uploaded and processed successfully`);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadProgress((prev) =>
          prev.map((p) =>
            p.fileName === file.name
              ? { ...p, status: "failed" }
              : p
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress([]);
      fetchDocuments();
      fetchStats();
    }, 2000);
  };

  const pollProcessingStatus = async (documentId: string, fileName: string): Promise<void> => {
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const response = await fetch(`/api/knowledge/documents/${documentId}/status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "completed") {
          return;
        } else if (data.status === "failed") {
          throw new Error(data.error || "Processing failed");
        }
      }
      
      attempts++;
      
      setUploadProgress((prev) =>
        prev.map((p) =>
          p.fileName === fileName
            ? { ...p, progress: Math.min(60 + attempts * 2, 95) }
            : p
        )
      );
    }
    
    throw new Error("Processing timeout");
  };

  const handleGithubImport = async () => {
    if (!githubUrl) {
      toast.error("Please enter a GitHub repository URL");
      return;
    }

    const githubRegex = /^https?:\/\/github\.com\/[\w-]+\/[\w-]+/;
    if (!githubRegex.test(githubUrl)) {
      toast.error("Invalid GitHub repository URL");
      return;
    }

    setProcessingGithub(true);
    
    try {
      const response = await fetch("/api/knowledge/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ url: githubUrl }),
      });

      if (!response.ok) throw new Error("Failed to import repository");

      const result = await response.json();
      toast.success(`Repository imported successfully. Processed ${result.fileCount} files.`);
      setGithubUrl("");
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error("Error importing GitHub repo:", error);
      toast.error("Failed to import repository");
    } finally {
      setProcessingGithub(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/knowledge/documents/${selectedDocument.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete document");

      toast.success(`${selectedDocument.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
      fetchStats();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      "application/pdf": [".pdf"],
      "text/markdown": [".md", ".markdown"],
    },
    disabled: uploading,
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Upload company documentation to power AI-generated assessments
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="upload">📄 Upload Files</TabsTrigger>
          <TabsTrigger value="github">🐙 GitHub Import</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload PDF or Markdown files containing your company's internal knowledge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors
                  ${isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                  }
                  ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to select files
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, Markdown (Max 50MB per file)
                </p>
              </div>

              {uploadProgress.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">Uploading Files</h4>
                  {uploadProgress.map((progress) => (
                    <div key={progress.fileName} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {progress.status === "processing" && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          {progress.status === "completed" && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          {progress.status === "failed" && (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          {progress.fileName}
                        </span>
                        <span className="text-muted-foreground">
                          {progress.progress}%
                        </span>
                      </div>
                      <Progress value={progress.progress} />
                      <p className="text-xs text-muted-foreground">
                        {progress.status === "uploading" && "Uploading file..."}
                        {progress.status === "processing" && "Chunking & creating embeddings..."}
                        {progress.status === "completed" && "Complete!"}
                        {progress.status === "failed" && "Upload failed"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import from GitHub
              </CardTitle>
              <CardDescription>
                Import your company's repositories. The AI will analyze README, docs, and code structure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://github.com/company/repository"
                    className="pl-9"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    disabled={processingGithub}
                  />
                </div>
                <Button
                  onClick={handleGithubImport}
                  disabled={processingGithub || !githubUrl}
                >
                  {processingGithub ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </>
                  )}
                </Button>
              </div>

              {processingGithub && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cloning repository and processing files...</span>
                    <span className="text-muted-foreground">This may take a few minutes</span>
                  </div>
                  <Progress value={65} />
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">How it works:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• The repository is cloned and analyzed</li>
                  <li>• README, docs, and code comments are extracted</li>
                  <li>• Content is chunked and converted to embeddings</li>
                  <li>• Stored in pgvector for semantic search</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Documents</CardTitle>
          <CardDescription>
            {documents.length} document(s) available for assessment generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <p className="text-sm text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {doc.type === "pdf" ? (
                          <FileText className="h-4 w-4 text-red-500" />
                        ) : doc.type === "github" ? (
                          <Upload className="h-4 w-4 text-gray-700" />
                        ) : (
                          <FileCode className="h-4 w-4 text-blue-500" />
                        )}
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.type === "pdf" ? "PDF" : doc.type === "github" ? "GitHub" : "Markdown"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                    <TableCell>{doc.chunks || 0}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(doc.uploadDate), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(doc.status)}
                        <span className="text-sm capitalize">{doc.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.name}"?
              This action cannot be undone. The document and its embeddings will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}