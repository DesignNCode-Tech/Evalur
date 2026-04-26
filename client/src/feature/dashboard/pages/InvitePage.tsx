import { useState } from "react";
import { useInvite } from "../hooks/useInvite";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function InviteForm() {
  const { mutate, isPending } = useInvite();

  const [role, setRole] = useState("STAFF");
  const [seniorityLevel, setSeniorityLevel] = useState("JUNIOR");
  const [inviteLink, setInviteLink] = useState("");

  const handleInvite = () => {
    mutate(
      { role, seniorityLevel },
      {
        onSuccess: (data) => {
          setInviteLink(data.inviteLink);

          toast.success("Invite link generated", {
            description: "You can copy and share it",
          });
        },
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);

    toast.success("Link copied", {
      description: "Invite link copied to clipboard",
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-white text-black rounded-xl">
      
      {/* HEADER */}
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-black">
          Invite Member
        </CardTitle>
      </CardHeader>

      
      <CardContent className="space-y-6">

     
        <div className="space-y-2">
          <Label className="text-base font-medium text-black">
            Role
          </Label>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-black [&>span]:text-black">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent className="bg-white text-black border rounded-lg shadow-lg">
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="MANAGER">
                Manager
              </SelectItem>
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="STAFF">
                Staff
              </SelectItem>
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="CANDIDATE">
                Candidate
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        
        <div className="space-y-2">
          <Label className="text-base font-medium text-black">
            Seniority Level
          </Label>

          <Select value={seniorityLevel} onValueChange={setSeniorityLevel}>
            <SelectTrigger className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-black [&>span]:text-black">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>

            <SelectContent className="bg-white text-black border rounded-lg shadow-lg">
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="JUNIOR">
                Junior
              </SelectItem>
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="MID">
                Mid
              </SelectItem>
              <SelectItem className="py-3 px-4 text-black hover:bg-gray-100" value="SENIOR">
                Senior
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleInvite}
          disabled={isPending}
          className="w-full h-12 text-base bg-black text-white rounded-lg hover:bg-gray-900"
        >
          {isPending ? "Generating..." : "Generate Invite Link"}
        </Button>

        {/* INVITE LINK DISPLAY */}
        {inviteLink && (
          <div className="space-y-2 pt-2">
            <Label className="text-black">Invite Link</Label>

            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="bg-gray-100 text-black"
              />

              <Button
                onClick={handleCopy}
                className="bg-black text-white"
              >
                Copy
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}