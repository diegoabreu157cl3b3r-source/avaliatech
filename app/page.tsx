import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Shuffle } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Autenticação segura", description: "JWT em cookie httpOnly, bcrypt e rotas protegidas." },
  { icon: FileText, title: "Banco de questões", description: "CRUD completo, filtros, busca e paginação." },
  { icon: Shuffle, title: "Provas A/B", description: "Alternativas embaralhadas e gabarito recalculado." },
  { icon: CheckCircle2, title: "PDF profissional", description: "Prova A, gabarito A, prova B e gabarito B." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-brand-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-brand-900 dark:text-white">
      <section className="container-app flex min-h-screen flex-col justify-center py-10">
        <div className="max-w-3xl">
          <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 dark:border-white/20 dark:bg-white/10 dark:text-brand-100">
            Plataforma acadêmica para professores
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
            AvaliaTech
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-200">
            Crie questões, filtre seu banco, gere provas automaticamente em duas versões e exporte tudo em PDF com gabarito confiável.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/cadastro" className="inline-flex items-center justify-center rounded-2xl bg-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-brand-100">
              Começar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-800 transition hover:bg-white/70 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
              Entrar
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10 dark:shadow-none">
                <Icon className="h-8 w-8 text-brand-700 dark:text-brand-100" />
                <h2 className="mt-4 font-bold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
