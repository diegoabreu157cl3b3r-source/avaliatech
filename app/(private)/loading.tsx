export default function PrivateLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Carregando página">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-xl bg-navy-800/80" />
          <div className="h-4 w-64 rounded-lg bg-navy-850/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-xl bg-navy-800/80" />
          <div className="h-9 w-32 rounded-xl bg-navy-800/80" />
        </div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-navy-800 bg-navy-900/60 p-4" />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="h-72 rounded-2xl border border-navy-800 bg-navy-900/60 p-6" />
    </div>
  );
}
