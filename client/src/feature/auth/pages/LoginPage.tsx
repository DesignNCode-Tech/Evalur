import React from "react";

export const LoginPage = () => {
  const user = {
    name: "John",
    email: "john@example.com",
    role: "ADMIN", // ✅ IMPORTANT
  };

  React.useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true"); // optional
  }, []);

  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
};