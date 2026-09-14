export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl border border-navy-700/50 bg-navy-850 ${className}`} />;
}

