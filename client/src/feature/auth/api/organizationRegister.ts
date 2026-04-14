import axios from "axios";

export const registerOrganization = async (data: any) => {
  const res = await axios.post("http://localhost:8080/auth/org-register", {
    name: data.organizationName,
    domain: data.domain,
    email: data.email,
    password: data.password,
  });

  return res.data;
};