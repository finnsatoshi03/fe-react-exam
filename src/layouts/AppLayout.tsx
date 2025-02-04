import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export default function AppLayout() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col">
      <Navbar />
      <div className="grid flex-1">
        <main className="w-full bg-zinc-50 px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
