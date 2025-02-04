import { User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../services/apiAuth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { User } from "../../lib/types";

export function UserAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 items-center gap-2 px-3 text-white hover:bg-zinc-700"
        >
          <UserIcon className="size-4" />
          <span>{user.username}</span>
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          {/* User Info */}
          <div className="flex items-start gap-3 border-b pb-3">
            <div className="rounded-full bg-zinc-100 p-2">
              <UserIcon className="size-6 text-zinc-600" />
            </div>
            <div className="flex flex-col">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start px-2 hover:bg-zinc-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
