import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="" />}>
          {/* EMPLYEE DTR */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
