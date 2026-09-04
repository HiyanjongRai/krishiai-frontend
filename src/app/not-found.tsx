import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <span className="text-5xl font-black text-emerald-600">404</span>
      <h2 className="text-2xl font-extrabold text-slate-900">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md">The page you are looking for does not exist or has moved.</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
