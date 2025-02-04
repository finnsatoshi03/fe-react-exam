import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" }),
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // for validation
  useEffect(() => {
    try {
      LoginSchema.parse({ email, password });
      setEmailError("");
      setIsButtonEnabled(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set specific error messages
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
      const response = await fetch(
        `http://localhost:8000/users?email=${email}&password=${password}`,
      );
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        alert(`Welcome, ${user.username}! Login Successful!`);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        console.log("newAttempts", newAttempts);

        if (newAttempts >= 3) {
          setIsLoginDisabled(true);
          setLoginError(
            "Maximum login attempts reached. Please try again later.",
          );
        } else {
          setLoginError("Invalid email or password.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred. Please try again.");
    }
  };

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setIsLoginDisabled(false);
    setLoginError("");
  };

  return (
    <>
      <form onSubmit={handleLogin} className="w-full">
        <div className="mx-auto max-w-lg space-y-6 rounded-lg bg-white px-6 py-4 md:px-8 md:py-6">
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
              {/* remove if not needed (for dev purpose, can change to timer) */}
              {isLoginDisabled && (
                <button
                  type="button"
                  onClick={resetLoginAttempts}
                  className="ml-2 text-blue-500 underline"
                >
                  Reset
                </button>
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

          <p className="text-center text-slate-400">Forgot Password?</p>
        </div>
      </form>
    </>
  );
}
