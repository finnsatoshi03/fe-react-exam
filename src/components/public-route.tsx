import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/apiAuth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
