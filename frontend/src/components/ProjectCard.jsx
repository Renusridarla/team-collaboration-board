import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{project.workspaceName || 'Workspace'}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{project.projectName}</h3>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
          {project.status}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {project.description || 'No description provided yet.'}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
        <div className="rounded-full bg-slate-800 px-3 py-1">{project.members?.length || 0} members</div>
        <div className="rounded-full bg-slate-800 px-3 py-1">{new Date(project.createdAt).toLocaleDateString()}</div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/projects/${project._id}`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
          View
        </Link>
        <button onClick={() => onEdit(project)} className="rounded-lg bg-cyan-500/15 px-3 py-2 text-sm text-cyan-300 transition hover:bg-cyan-500/25">
          Edit
        </button>
        <button onClick={() => onDelete(project)} className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-500/25">
          Delete
        </button>
      </div>
    </div>
  );
}
