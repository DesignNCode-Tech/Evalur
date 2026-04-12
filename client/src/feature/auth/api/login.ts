import axios from "axios";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    "http://localhost:8080/auth/login",
    data,
    {
      withCredentials: true, // IMPORTANT for cookies
    }
  );

  return response.data;
};