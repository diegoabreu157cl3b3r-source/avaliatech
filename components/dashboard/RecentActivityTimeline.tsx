import Link from "next/link";
import { FileText, PlusCircle, Edit3, Trash2, Award, ChevronRight } from "lucide-react";
import type { AtividadeRecente } from "@/services/dashboard-service";

interface RecentActivityTimelineProps {
  activities: AtividadeRecente[];
}

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 0) {
      return new Date(dateStr).toLocaleDateString("pt-BR");
    }

    if (diffInSeconds < 60) return "agora mesmo";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `há ${days} ${days === 1 ? "dia" : "dias"}`;
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return dateStr;
  }
}

const activityConfig = {
  questao_criada: {
    icon: PlusCircle,
    href: "/questoes",
    badge: "Questões",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800"
  },
  questao_editada: {
    icon: Edit3,
    href: "/questoes",
    badge: "Questões",
    color: "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800"
  },
  questao_excluida: {
    icon: Trash2,
    href: "/questoes",
    badge: "Questões",
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800"
  },
  prova_gerada: {
    icon: Award,
    href: "/provas",
    badge: "Histórico",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800"
  },
  prova_excluida: {
    icon: Trash2,
    href: "/provas",
    badge: "Histórico",
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800"
  }
};

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Nenhuma atividade registrada recentemente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = activityConfig[activity.tipo] || {
          icon: FileText,
          href: "/dashboard",
          badge: "Painel",
          color: "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        };
        const Icon = config.icon;

        return (
          <Link
            key={activity.id}
            href={config.href}
            className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs transition hover:border-brand-300 hover:bg-slate-50/80 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/80"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.color}`}>
              <Icon className="h-4.5 w-4.5 transition group-hover:scale-110" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 transition group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-400">
                  {activity.titulo}
                </p>
                <span className="hidden sm:inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {config.badge}
                </span>
              </div>
              {activity.descricao && (
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {activity.descricao}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {formatTimeAgo(activity.created_at)}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-600 dark:group-hover:text-brand-400" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
