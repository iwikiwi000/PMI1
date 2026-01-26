import { Navigate } from "react-router-dom";
import { useAuthStore } from "../storage/authStorage";

export default function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/cameras" replace />;
  }

  return children;
}
