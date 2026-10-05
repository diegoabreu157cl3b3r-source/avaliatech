import { Suspense } from "react";
import { ExamGeneratorForm } from "@/components/exams/ExamGeneratorForm";
import { Skeleton } from "@/components/ui/Skeleton";

export default function GerarProvaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Gerar prova</h1>
        <p className="mt-1 text-sm text-slate-400">
          Monte uma nova avaliação em poucos passos com versões A e B e gabaritos automáticos.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ExamGeneratorForm />
      </Suspense>
    </div>
  );
}
