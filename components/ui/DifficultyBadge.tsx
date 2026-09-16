interface DifficultyBadgeProps {
  difficulty: "Fácil" | "Média" | "Difícil" | "Mista" | string;
  size?: "sm" | "md";
  className?: string;
}

export function DifficultyBadge({
  difficulty,
  size = "md",
  className = ""
}: DifficultyBadgeProps) {
  const normalized = difficulty?.trim();

  let colorClasses =
    "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";

  if (normalized === "Fácil") {
    colorClasses =
      "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-500/30 dark:text-emerald-300";
  } else if (normalized === "Média") {
    colorClasses =
      "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-500/30 dark:text-amber-300";
  } else if (normalized === "Difícil") {
    colorClasses =
      "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-500/30 dark:text-rose-300";
  } else if (normalized === "Mista" || normalized === "Personalizada") {
    colorClasses =
      "bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/60 dark:border-sky-500/30 dark:text-sky-300";
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClasses} ${colorClasses} ${className}`}
    >
      {difficulty}
    </span>
  );
}

