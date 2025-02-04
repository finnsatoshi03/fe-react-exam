import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function LoginForm() {
  return (
    <form className="w-full">
      <div className="mx-auto max-w-lg space-y-6 rounded-lg bg-white px-6 py-4 md:px-8 md:py-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="name" placeholder="Username or Email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password" />
        </div>
        <Button variant="primary" size="default" className="w-full">
          Login
        </Button>

        <p className="text-center text-slate-400">Forgot Password?</p>
      </div>
    </form>
  );
}
