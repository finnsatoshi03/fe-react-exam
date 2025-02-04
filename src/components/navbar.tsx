import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

const NavItem = ({ children }: { children: ReactNode }) => (
  <li className="flex items-center gap-1">
    {children} <ChevronDown className="size-3" />
  </li>
);

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between gap-4 bg-zinc-800 px-6 py-4 text-white">
      <h1 className="text-xl font-bold md:text-3xl">
        Exam <span className="text-blue-400">track</span>
      </h1>
      <ul className="flex gap-8 text-sm">
        <NavItem>My Request</NavItem>
        <NavItem>Administration Tools</NavItem>
        <NavItem>My Account</NavItem>
      </ul>
    </nav>
  );
}
