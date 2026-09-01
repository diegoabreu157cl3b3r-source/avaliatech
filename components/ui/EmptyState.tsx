import { FileQuestion } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center transition dark:border-slate-800 dark:bg-slate-900">
      <FileQuestion className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
      <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

