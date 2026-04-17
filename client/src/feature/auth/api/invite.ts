import axios from "axios";

export const sendInvite = async (data: any) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:8081/api/v1/org/invite",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};