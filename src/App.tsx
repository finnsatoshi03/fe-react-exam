import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dasboard";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="dashboard" />} />
        {/* EMPLYEE DTR */}
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        {/* public route */}
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </BrowserRouter>
  );
}
