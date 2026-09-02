export default function StatusBadge({ status }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const map = {
    'To Do': 'bg-slate-700 text-slate-200',
    'In Progress': 'bg-cyan-500/15 text-cyan-300',
    Completed: 'bg-emerald-500/15 text-emerald-300',
  };

  return <span className={`${base} ${map[status] || map['To Do']}`}>{status}</span>;
}
