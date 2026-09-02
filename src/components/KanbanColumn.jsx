import TaskCard from './TaskCard';

export default function KanbanColumn({ title, tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="flex min-h-[200px] w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-sm text-slate-400">{tasks.length}</span>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}
