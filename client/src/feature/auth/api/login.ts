import axios from "axios";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post("http://localhost:8080/auth/login", data);
  return res.data;
};