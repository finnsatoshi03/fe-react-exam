import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col">
      <div className="grid flex-1">
        <main className="mx-auto w-full max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
