import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import { FolderKanban, Users, Calendar, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const formattedDate = project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently';

  return (
    <TiltCard className="group p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
              <FolderKanban size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">{project?.workspaceName || 'Workspace'}</p>
              <h3 className="text-base font-bold text-white tracking-tight">{project?.projectName || 'Untitled Project'}</h3>
            </div>
          </div>
          <span className="rounded-full border border-zinc-700/80 bg-zinc-800/90 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
            {project?.status || 'Active'}
          </span>
        </div>

        <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
          {project?.description || 'No description provided yet.'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1">
            <Users size={13} className="text-zinc-500" />
            {project?.members?.length || 0} members
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1">
            <Calendar size={13} className="text-zinc-500" />
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <Link
          to={`/projects/${project?._id}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Details <ArrowRight size={13} />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(project)}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 btn-interaction hover:bg-zinc-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(project)}
            className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-400 btn-interaction hover:text-rose-400 hover:bg-zinc-800"
          >
            Delete
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
