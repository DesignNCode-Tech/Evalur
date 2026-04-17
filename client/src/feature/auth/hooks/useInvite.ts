import { useMutation } from "@tanstack/react-query";
import { sendInvite } from "../api/invite";

export const useInvite = () => {
  return useMutation({
    mutationFn: sendInvite,
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Invite failed");
    },
  });
};