import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function GuestOnly({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}
