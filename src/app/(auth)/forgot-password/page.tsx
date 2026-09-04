import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8faf7]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Reset Password</h2>
          <p className="text-xs text-slate-500">We'll send you a password recovery link</p>
        </div>
        <form className="space-y-4">
          <Input label="Email Address" type="email" placeholder="yourname@domain.com" />
          <Button className="w-full">Send Reset Link</Button>
        </form>
        <p className="text-center text-xs text-slate-500">
          <Link href="/" className="text-emerald-700 hover:underline">Return to Home &amp; Sign In</Link>
        </p>
      </div>
    </div>
  );
}
