// components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loginStatus } = useContext(authContext);

  if (!loginStatus) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;