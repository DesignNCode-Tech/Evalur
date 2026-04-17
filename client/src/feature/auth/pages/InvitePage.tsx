import { useState } from "react";
import { useInvite } from "../hooks/useInvite";

export default function InvitePage() {
  const { mutate, data, isPending } = useInvite();

  const [role, setRole] = useState("STAFF");
  const [seniorityLevel, setSeniorityLevel] = useState("JUNIOR");

  const handleInvite = () => {
    mutate({
      role,
      seniorityLevel,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "20px",
          }}
        >
          Generate Invite Link
        </h2>

        {/* Role Dropdown */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="STAFF">STAFF</option>
          <option value="MANAGER">MANAGER</option>
          <option value="CANDIDATE">CANDIDATE</option>
        </select>

        {/* Seniority Dropdown */}
        <select
          value={seniorityLevel}
          onChange={(e) => setSeniorityLevel(e.target.value)}
          style={inputStyle}
        >
          <option value="JUNIOR">JUNIOR</option>
          <option value="MID">MID</option>
          <option value="SENIOR">SENIOR</option>
        </select>

        {/* Button */}
        <button
          onClick={handleInvite}
          disabled={isPending}
          style={{
            width: "100%",
            background: "#000",
            color: "#fff",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {isPending ? "Generating..." : "Generate Invite"}
        </button>

        {/* Show Invite Link */}
        {data?.inviteLink && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "bold" }}>Invite Link:</p>

            <input
              value={data.inviteLink}
              readOnly
              style={inputStyle}
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(data.inviteLink);
                alert("Copied!");
              }}
              style={{
                width: "100%",
                marginTop: "10px",
                background: "#4caf50",
                color: "#fff",
                padding: "8px",
                borderRadius: "6px",
                border: "none",
              }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  color: "#000",
  background: "#fff",
};