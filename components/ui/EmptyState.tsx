import { FileQuestion } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-navy-700 bg-navy-900 p-8 text-center transition">
      <FileQuestion className="mx-auto h-10 w-10 text-slate-500" />
      <h3 className="mt-4 text-lg font-black text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

