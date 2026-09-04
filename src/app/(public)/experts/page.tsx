import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { sampleExperts } from "@/data/experts";
import { ExpertCard } from "@/components/expert/expert-card";
import Link from "next/link";

export default function ExpertsDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        {/* Top Header & Invitation Banner */}
        <div className="bg-gradient-to-br from-[#0f3d26] to-[#166534] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/10">
              Agronomists & Scientists Network
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Are you an agricultural specialist?
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Join KrishiAI as a verified advisor. Review field diagnostic cases, provide expert prescriptions, and guide farmers with trusted knowledge.
            </p>
          </div>
          <Link
            href="/expert-register"
            className="px-6 py-3.5 bg-white text-[#166534] hover:bg-emerald-50 font-bold text-sm rounded-xl transition-all shadow-md self-start sm:self-auto shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Apply as KrishiAI Expert</span>
            <span>→</span>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Verified Agricultural Experts</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified professionals ready to assist with crop diseases, soil health, and farm planning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleExperts.map((exp) => (
            <Link key={exp.id} href={`/experts/${exp.id}`}>
              <ExpertCard name={exp.name} role={exp.role} rating={exp.rating} avatarUrl={exp.avatarUrl} />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
