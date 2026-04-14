import { useMutation } from "@tanstack/react-query";
import { registerOrganization } from "../api/organizationRegister";

export const useOrganizationRegister = () => {
  return useMutation({
    mutationFn: registerOrganization,
  });
};