export default function TaskFilters({ filters, onFilterChange, onClear }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <select name="status" value={filters.status} onChange={onFilterChange} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
        <option value="">All Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select name="priority" value={filters.priority} onChange={onFilterChange} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select name="project" value={filters.project} onChange={onFilterChange} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
        <option value="">All Projects</option>
        <option value="Personal">Personal</option>
      </select>
      <select name="assignedUser" value={filters.assignedUser} onChange={onFilterChange} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
        <option value="">All Users</option>
        <option value="me">Me</option>
      </select>
      <button onClick={onClear} className="md:col-span-2 xl:col-span-1 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
        Clear Filters
      </button>
    </div>
  );
}
