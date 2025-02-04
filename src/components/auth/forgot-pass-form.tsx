import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/apiAuth";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ForgotPassForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    try {
      LoginSchema.parse({ email });
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
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await forgotPassword(email);

      if (user) {
        toast.success(
          `An email has been sent to ${email}. Please check your inbox.`,
        );
      } else {
        toast.error(`No user with email ${email} found.`);
      }
    } catch (error) {
      console.error("An error occurred", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
        <Button
          type="submit"
          variant="primary"
          disabled={!isButtonEnabled}
          className="w-full"
        >
          Reset Password
        </Button>

        <Link className="flex justify-center" to="/login">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 opacity-80"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Button>
        </Link>
      </div>
    </form>
  );
}
