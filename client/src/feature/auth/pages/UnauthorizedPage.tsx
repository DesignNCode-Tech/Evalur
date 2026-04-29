import { Link } from "react-router-dom";

export const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};