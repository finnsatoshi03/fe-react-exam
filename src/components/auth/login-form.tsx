import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-hot-toast";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { login } from "../../services/apiAuth";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;
    if (isLoginDisabled && lockoutCountdown > 0) {
      timerId = setInterval(() => {
        setLockoutCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setIsLoginDisabled(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isLoginDisabled, lockoutCountdown]);

  // for validation
  useEffect(() => {
    try {
      LoginSchema.parse({ email, password });
      setEmailError("");
      setIsButtonEnabled(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailErrorMessage = error.errors.find(
          (e) => e.path[0] === "email",
        )?.message;

        setEmailError(emailErrorMessage || "");
        setIsButtonEnabled(false);
      }
    }
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Resetter
    setLoginError("");

    try {
      const user = await login(email, password);

      if (user) {
        toast.success(`Welcome, ${user.username}! Login Successful!`);
        setLoginAttempts(0);
        setIsLoginDisabled(false);
        setLockoutCountdown(0);

        navigate("/dashboard");
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsLoginDisabled(true);
          setLockoutCountdown(300); // 5 minutes (300 seconds)
          setLoginError(
            "Maximum login attempts reached. Please try again in 5 minutes.",
          );
        } else {
          toast.error("Invalid email or password.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="w-full">
        <div className="mx-auto max-w-xs space-y-6 rounded-lg bg-white px-6 py-4 sm:max-w-lg md:px-8 md:py-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`mt-1 ${emailError ? "border-red-500" : ""}`}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1"
            />
          </div>

          {loginError && (
            <div className="text-center text-sm text-red-500">
              {loginError}
              {isLoginDisabled && lockoutCountdown > 0 && (
                <div>
                  Time remaining: {Math.floor(lockoutCountdown / 60)} minutes{" "}
                  {lockoutCountdown % 60} seconds
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!isButtonEnabled || isLoginDisabled}
            className="w-full"
          >
            Login
          </Button>

          <Link to="/forgot-password">
            <p className="text-center text-slate-400">Forgot Password?</p>
          </Link>
        </div>
      </form>
    </>
  );
}
