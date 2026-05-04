// pages/admin/CandidatesPage.tsx
import { useInvite } from '@/feature/dashboard/hooks/useInvite';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Loader2,
  Mail,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: "pending" | "in_progress" | "completed";
  score?: number;
}

export default function CandidatesPage() {
  const { mutateAsync, isPending } = useInvite();
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "John Doe", email: "john@example.com", status: "completed", score: 85 },
    { id: "2", name: "Alice Smith", email: "alice@example.com", status: "pending" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "in_progress" },
    { id: "4", name: "Sarah Williams", email: "sarah@example.com", status: "completed", score: 92 },
    { id: "5", name: "Mike Brown", email: "mike@example.com", status: "pending" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvite = async () => {
    if (!selectedAssessment) {
      toast.error("Please select an assessment");
      return;
    }

    try {
      const res = await mutateAsync({
        role: "CANDIDATE",
        seniorityLevel: "JUNIOR",
      });

      setInviteLink(res.inviteLink);
      toast.success("Invite link generated!");
    } catch (err) {
      toast.error("Failed to generate link");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span>;
      case "in_progress":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Pending</span>;
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>
        
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Candidate
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Candidate</DialogTitle>
              <DialogDescription>
                Generate an invite link for the candidate
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Assessment</Label>
                <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose assessment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Assessment</SelectItem>
                    <SelectItem value="backend">Backend Assessment</SelectItem>
                    <SelectItem value="fullstack">Full Stack Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!inviteLink ? (
                <Button
                  onClick={handleGenerateInvite}
                  disabled={isPending || !selectedAssessment}
                  className="w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Generate Invite Link
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">Invite Link</p>
                    <code className="text-xs bg-white p-2 rounded block break-all border">
                      {inviteLink}
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCopy} variant="outline" className="flex-1">
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowInviteDialog(false);
                setInviteLink("");
                setSelectedAssessment("");
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {candidate.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {candidate.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(candidate.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {candidate.score ? (
                    <span className="font-semibold text-gray-900">{candidate.score}%</span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No candidates found
          </div>
        )}
      </div>
    </div>
  );
}