"use client";

import React from "react";

/**
 * Ilustração vetorial sutil para o cabeçalho do Dashboard (Hero).
 * Representa documentos de avaliação, caneta de correção e notas acadêmicas
 * nas cores oficiais da marca (Azul-Marinho e Dourado), totalmente transparente e adaptável.
 */
export function HeroAssessmentIllustration({ className = "h-20 w-36" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="heroSheetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Folha de Fundo (Versão B) */}
      <rect
        x="62"
        y="12"
        width="65"
        height="70"
        rx="8"
        transform="rotate(6 62 12)"
        className="fill-navy-850 stroke-navy-700/80 dark:fill-navy-850 dark:stroke-navy-700"
        strokeWidth="1.5"
      />
      <line x1="78" y1="26" x2="115" y2="30" className="stroke-slate-400/40" strokeWidth="2" strokeLinecap="round" />
      <line x1="77" y1="36" x2="110" y2="40" className="stroke-slate-400/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="46" x2="105" y2="50" className="stroke-slate-400/30" strokeWidth="2" strokeLinecap="round" />

      {/* Folha Principal (Versão A) */}
      <rect
        x="28"
        y="10"
        width="68"
        height="74"
        rx="8"
        transform="rotate(-4 28 10)"
        className="fill-navy-900 stroke-navy-700 dark:fill-navy-900 dark:stroke-navy-700"
        strokeWidth="1.5"
      />

      {/* Cabeçalho da Prova na Folha Principal */}
      <rect x="36" y="18" width="18" height="6" rx="3" className="fill-gold-500/20 stroke-gold-500/40" strokeWidth="1" />
      <circle cx="40" cy="21" r="1.5" className="fill-gold-400" />
      <line x1="58" y1="21" x2="88" y2="19" className="stroke-slate-400/60" strokeWidth="2" strokeLinecap="round" />

      {/* Linhas de Questões com Checkmarks */}
      <circle cx="40" cy="33" r="2.5" className="stroke-emerald-500" strokeWidth="1.2" fill="none" />
      <line x1="47" y1="33" x2="86" y2="30" className="stroke-slate-400/50" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="47" y1="40" x2="78" y2="38" className="stroke-slate-400/30" strokeWidth="1.5" strokeLinecap="round" />

      <circle cx="41" cy="49" r="2.5" className="stroke-gold-400" strokeWidth="1.2" fill="none" />
      <line x1="48" y1="49" x2="87" y2="46" className="stroke-slate-400/50" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="48" y1="56" x2="74" y2="54" className="stroke-slate-400/30" strokeWidth="1.5" strokeLinecap="round" />

      <circle cx="42" cy="65" r="2.5" className="stroke-sky-500" strokeWidth="1.2" fill="none" />
      <line x1="49" y1="65" x2="84" y2="62" className="stroke-slate-400/50" strokeWidth="1.8" strokeLinecap="round" />

      {/* Selo Dourado de Avaliação "A+" */}
      <circle cx="98" cy="42" r="13" className="fill-navy-900 stroke-gold-500/60" strokeWidth="2" />
      <circle cx="98" cy="42" r="10" fill="url(#heroGoldGrad)" />
      <path
        d="M95 44L97.5 39L100 44M96 43H99"
        stroke="#FFFFFF"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M102 40V44M100 42H104"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Caneta Dourada */}
      <g transform="translate(112, 14) rotate(32)">
        <rect x="0" y="0" width="7" height="42" rx="3.5" className="fill-gold-500" />
        <path d="M0 38L3.5 47L7 38Z" className="fill-gold-600" />
        <circle cx="3.5" cy="46" r="1" fill="#1E293B" />
        <rect x="1.5" y="4" width="4" height="6" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
      </g>

      {/* Faíscas sutis */}
      <path d="M22 28L24 24L26 28L30 30L26 32L24 36L22 32L18 30Z" className="fill-gold-400/40" />
      <path d="M138 60L139.5 57L141 60L144 61.5L141 63L139.5 66L138 63L135 61.5Z" className="fill-gold-400/30" />
    </svg>
  );
}

/**
 * Empty state para Quando não há questões cadastradas.
 */
export function EmptyQuestionsIllustration({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" className="fill-navy-850/60 stroke-navy-750/80 stroke-dashed" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Prancheta */}
      <rect x="22" y="16" width="36" height="48" rx="6" className="fill-navy-900 stroke-navy-700" strokeWidth="1.5" />
      {/* Clip da prancheta */}
      <rect x="32" y="12" width="16" height="8" rx="3" className="fill-gold-500/20 stroke-gold-500" strokeWidth="1.5" />
      {/* Linhas de texto simuladas */}
      <line x1="28" y1="28" x2="52" y2="28" className="stroke-slate-400/40" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="36" x2="48" y2="36" className="stroke-slate-400/30" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="44" x2="42" y2="44" className="stroke-slate-400/30" strokeWidth="2" strokeLinecap="round" />
      {/* Ícone de Adicionar Central */}
      <circle cx="50" cy="52" r="10" className="fill-gold-500 stroke-navy-900" strokeWidth="2" />
      <path d="M50 48V56M46 52H54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Empty state para Quando não há disciplinas.
 */
export function EmptyDisciplinesIllustration({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" className="fill-navy-850/60 stroke-navy-750/80 stroke-dashed" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Livros Empilhados */}
      <rect x="20" y="46" width="40" height="10" rx="3" className="fill-navy-900 stroke-navy-700" strokeWidth="1.5" />
      <rect x="24" y="34" width="36" height="10" rx="3" className="fill-navy-900 stroke-gold-500/60" strokeWidth="1.5" />
      <rect x="28" y="22" width="32" height="10" rx="3" className="fill-navy-900 stroke-navy-700" strokeWidth="1.5" />
      
      {/* Marcador dourado no livro do meio */}
      <path d="M52 34V46L55 43L58 46V34H52Z" className="fill-gold-500" />
      
      {/* Linhas de lombada */}
      <line x1="25" y1="51" x2="32" y2="51" className="stroke-slate-400/40" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="29" y1="39" x2="36" y2="39" className="stroke-gold-400/60" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="33" y1="27" x2="40" y2="27" className="stroke-slate-400/40" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Empty state para Atividades Recentes.
 */
export function EmptyActivitiesIllustration({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" className="fill-navy-850/60 stroke-navy-750/80 stroke-dashed" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Relógio / Linha do Tempo */}
      <circle cx="40" cy="40" r="22" className="fill-navy-900 stroke-navy-700" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="16" className="fill-navy-850/50 stroke-navy-750" strokeWidth="1" />
      {/* Ponteiros */}
      <path d="M40 28V40L48 44" className="stroke-gold-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="40" r="2.5" className="fill-gold-500" />
      {/* Marcadores de horas */}
      <circle cx="40" cy="22" r="1.5" className="fill-slate-400/60" />
      <circle cx="58" cy="40" r="1.5" className="fill-slate-400/60" />
      <circle cx="40" cy="58" r="1.5" className="fill-slate-400/60" />
      <circle cx="22" cy="40" r="1.5" className="fill-slate-400/60" />
    </svg>
  );
}

/**
 * Empty state para Provas Recentes.
 */
export function EmptyExamsIllustration({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" className="fill-navy-850/60 stroke-navy-750/80 stroke-dashed" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Folha Versão B atrás */}
      <rect x="30" y="16" width="30" height="42" rx="4" transform="rotate(8 30 16)" className="fill-navy-850 stroke-navy-700" strokeWidth="1.5" />
      {/* Folha Versão A frente */}
      <rect x="20" y="20" width="32" height="44" rx="4" className="fill-navy-900 stroke-navy-700" strokeWidth="1.5" />
      {/* Badge A */}
      <rect x="24" y="24" width="8" height="6" rx="2" className="fill-gold-500/20 stroke-gold-500/60" strokeWidth="1" />
      {/* Linhas */}
      <line x1="24" y1="36" x2="44" y2="36" className="stroke-slate-400/40" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="42" x2="40" y2="42" className="stroke-slate-400/30" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="48" x2="46" y2="48" className="stroke-slate-400/30" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ícone de Estrela/Sparkle de IA */}
      <path d="M50 48L52 43L57 41L52 39L50 34L48 39L43 41L48 43Z" className="fill-gold-400 stroke-navy-900" strokeWidth="1" />
    </svg>
  );
}

