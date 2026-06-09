import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();

  console.log("is auth",isAuth)

  if (loading) return <p>Loading...</p>; // 🔥 important

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;