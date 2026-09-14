import { Suspense } from "react";
import { ExamGeneratorForm } from "@/components/exams/ExamGeneratorForm";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GerarProvaPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-navy-700 bg-navy-900 p-5 sm:p-6 shadow-soft transition text-slate-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-400">Geração inteligente</p>
        <h1 className="mt-1 text-2xl font-black text-slate-100">Gerar Prova</h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-400">
          Informe os dados, escolha os filtros e a quantidade. O AvaliaTech seleciona questões compatíveis, embaralha alternativas, cria as versões A e B e gera os gabaritos automaticamente.
        </p>
      </section>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ExamGeneratorForm />
      </Suspense>
    </div>
  );
}

