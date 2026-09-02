export default function StatCard({ title, value, change, accentClass = 'bg-cyan-500/10 text-cyan-300' }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${accentClass}`}>{change}</span>
      </div>
    </div>
  );
}
