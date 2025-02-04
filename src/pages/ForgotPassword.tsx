import ForgotPassForm from "../components/auth/forgot-pass-form";
import Footer from "../components/footer";

export default function ForgotPassword() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-8 bg-zinc-100">
      <h1 className="text-3xl font-bold text-blue-600 md:text-5xl">
        Forgot Password
      </h1>
      <ForgotPassForm />
      <Footer />
    </div>
  );
}
