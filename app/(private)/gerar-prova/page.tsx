import { Suspense } from "react";
import { ExamGeneratorForm } from "@/components/exams/ExamGeneratorForm";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GerarProvaPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">Geração automática</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">Gerar Prova</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Informe os dados, escolha os filtros e a quantidade. O AvaliaTech seleciona questões compatíveis, embaralha alternativas, cria as versões A e B e gera os gabaritos automaticamente.
        </p>
      </section>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ExamGeneratorForm />
      </Suspense>
    </div>
  );
}

