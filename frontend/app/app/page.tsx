"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-sm sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/70">
        <div className="text-xl font-bold tracking-tight">HR-Pulse <span className="text-blue-600">.</span></div>
        <div className="space-x-4">
          <button onClick={() => router.push("/login")} className="px-4 py-2 text-sm font-medium hover:text-blue-600 transition-colors">Log in</button>
          <button onClick={() => router.push("/Signup")} className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
            Sign up
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
            Projet-11 • Simplon Academy
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Pipeline Intelligente & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Conteneurisation Native
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Moderniser le recrutement en transformant des données textuelles brutes en une base de connaissances structurée via l'IA Azure et le MLOps.
          </p>
        </section>

        {/* Project Description Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
            <h3 className="text-xl font-bold mb-4">L'Objectif</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Extraire automatiquement des compétences clés (NER) via <strong>Azure AI Language</strong> et prédire les fourchettes salariales pour aider les recruteurs à rester compétitifs sur le marché.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Stack Technique</h3>
            <div className="flex flex-wrap gap-2">
              {["Terraform", "Azure SQL", "FastAPI", "Docker", "uv", "OpenTelemetry", "NextJS"].map((tech) => (
                <span key={tech} className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow Image Placeholder */}
        <div className="mb-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 aspect-video flex items-center justify-center text-zinc-400 italic">
          <img src="/Users/lait-zet/Desktop/HR-Pulse-cloud-IA-Devops/frontend/app/public/Screenshot 2026-02-25 at 3.05.43 AM.png" alt="" />
        </div>

        {/* Technical Roadmap */}
        <section className="space-y-12">
          <h2 className="text-3xl font-bold text-center">Roadmap du Projet</h2>
          <div className="grid gap-6">
            {[
              { title: "Phase 1: Infrastructure", desc: "Provisioning automatique via Terraform & Azure Backend." },
              { title: "Phase 2: Data & AI", desc: "Nettoyage Jobs.csv et extraction NER avec Azure AI Language." },
              { title: "Phase 3: Module Predictor", desc: "Modélisation ML pour l'estimation des salaires." },
              { title: "Phase 4: Conteneurisation", desc: "Dockerisation et orchestration via Docker Compose & Terraform." },
              { title: "Phase 5: Observabilité", desc: "Traces distribuées avec OpenTelemetry et Jaeger." }
            ].map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold">{phase.title}</h4>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 py-10 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        <p>© 2026 HR-Pulse - Développé par Yassine Ennaya - Simplon Academy</p>
      </footer>
    </div>
  );
}