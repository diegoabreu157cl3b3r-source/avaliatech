import { ExamGeneratorForm } from "@/components/exams/ExamGeneratorForm";

export default function GerarProvaPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Geração automática</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Gerar Prova</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Informe os dados, escolha os filtros e a quantidade. O AvaliaTech seleciona questões compatíveis, embaralha alternativas, cria as versões A e B e gera os gabaritos automaticamente.
        </p>
      </section>
      <ExamGeneratorForm />
    </div>
  );
}
