import Link from "next/link";
import { Plus, FileText, Edit3, CheckCircle2, Trash2 } from "lucide-react";
import type { AtividadeRecente } from "@/services/dashboard-service";
import { EmptyActivitiesIllustration } from "./DashboardIllustrations";

interface RecentActivityTimelineProps {
  activities: AtividadeRecente[];
}

function formatTimelineTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (isToday) {
      return `Hoje, ${timeStr}`;
    }

    if (isYesterday) {
      return `Ontem, ${timeStr}`;
    }

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  } catch {
    return dateStr;
  }
}

const activityConfig = {
  questao_criada: {
    icon: Plus,
    bg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    label: "Questão adicionada",
    href: "/questoes"
  },
  questao_editada: {
    icon: Edit3,
    bg: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
    label: "Questão editada",
    href: "/questoes"
  },
  questao_excluida: {
    icon: Trash2,
    bg: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    label: "Questão excluída",
    href: "/questoes"
  },
  prova_gerada: {
    icon: FileText,
    bg: "bg-gold-500/20 text-gold-400 border border-gold-500/30",
    label: "Prova gerada",
    href: "/provas"
  },
  prova_excluida: {
    icon: Trash2,
    bg: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    label: "Prova excluída",
    href: "/provas"
  }
};

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <EmptyActivitiesIllustration className="h-16 w-16 mb-2" />
        <p className="text-xs font-semibold text-slate-200">Nenhuma atividade recente</p>
        <p className="mt-0.5 text-[11px] text-slate-400 max-w-[200px]">
          Suas ações no sistema aparecerão listadas aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-1">
      {activities.slice(0, 4).map((activity) => {
        const config = activityConfig[activity.tipo] || {
          icon: CheckCircle2,
          bg: "bg-gold-500/20 text-gold-400 border border-gold-500/30",
          label: "Ação no sistema",
          href: "/dashboard"
        };
        const Icon = config.icon;

        return (
          <Link
            key={activity.id}
            href={config.href}
            className="group flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-xl transition hover:bg-navy-850/60"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-100 group-hover:text-gold-400 transition">
                  {config.label}
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {activity.descricao || activity.titulo}
                </p>
              </div>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400 font-medium">
              {formatTimelineTime(activity.created_at)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
