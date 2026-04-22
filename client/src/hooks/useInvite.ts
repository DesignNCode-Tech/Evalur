import { useMutation } from "@tanstack/react-query";
import { sendInvite } from "../api/ApiInvite";
import { toast } from "sonner";

export const useInvite = () => {
  return useMutation({
    mutationFn: sendInvite,

    onSuccess: (data) => {
      toast.success("Invite created successfully", {
        description: "Invite link generated",
      });

      console.log("Invite:", data.inviteLink);
    },

    onError: () => {
      toast.error("Invite failed", {
        description: "Something went wrong",
      });
    },
  });
};