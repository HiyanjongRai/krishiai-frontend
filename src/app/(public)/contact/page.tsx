import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-xl mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-extrabold text-[#1F2937]">Contact KrishiAI</h1>
        <form className="space-y-4">
          <Input label="Your Name" placeholder="Ram Thapa" />
          <Input label="Email Address" type="email" placeholder="ram@example.com" />
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#4B5563]">Message</label>
            <textarea rows={4} className="w-full rounded-xl border border-[#E5E7EB] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8F5E9]" placeholder="How can we help you?" />
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
