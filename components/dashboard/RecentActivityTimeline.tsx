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
    color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
  },
  questao_editada: {
    icon: Edit3,
    href: "/questoes",
    badge: "Questões",
    color: "text-gold-400 bg-gold-950/60 border-gold-500/30"
  },
  questao_excluida: {
    icon: Trash2,
    href: "/questoes",
    badge: "Questões",
    color: "text-rose-400 bg-rose-950/60 border-rose-500/30"
  },
  prova_gerada: {
    icon: Award,
    href: "/provas",
    badge: "Histórico",
    color: "text-indigo-400 bg-indigo-950/60 border-indigo-500/30"
  },
  prova_excluida: {
    icon: Trash2,
    href: "/provas",
    badge: "Histórico",
    color: "text-rose-400 bg-rose-950/60 border-rose-500/30"
  }
};

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-slate-400">
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
          color: "text-slate-400 bg-navy-850 border-navy-700"
        };
        const Icon = config.icon;

        return (
          <Link
            key={activity.id}
            href={config.href}
            className="group flex items-start gap-3 rounded-2xl border border-navy-700 bg-navy-850/40 p-3.5 shadow-xs transition hover:border-gold-500/40 hover:bg-navy-850"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.color}`}>
              <Icon className="h-4.5 w-4.5 transition group-hover:scale-110" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-100 transition group-hover:text-gold-400">
                  {activity.titulo}
                </p>
                <span className="hidden sm:inline-block rounded-md border border-navy-700 bg-navy-900 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                  {config.badge}
                </span>
              </div>
              {activity.descricao && (
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {activity.descricao}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="text-[11px] font-medium text-slate-400">
                {formatTimeAgo(activity.created_at)}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-gold-400" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
