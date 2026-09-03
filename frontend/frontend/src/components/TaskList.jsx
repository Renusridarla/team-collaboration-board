import TaskCard from './TaskCard';

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}
