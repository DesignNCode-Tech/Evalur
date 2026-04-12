import axios from "axios";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
  organizationName?: string;
}) => {
  const res = await axios.post(
    "http://localhost:8080/auth/register",
    data,
    {
      withCredentials: true,
    }
  );

  return res.data;
};