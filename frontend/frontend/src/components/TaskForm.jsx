import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: '',
  priority: 'Medium',
  status: 'To Do',
  deadline: '',
};

export default function TaskForm({ initialValues, projects, onSubmit, isSubmitting, submitLabel, error }) {
  const [form, setForm] = useState(initialValues || initialForm);

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" required />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Description</label>
        <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Project</label>
        <select name="projectId" value={form.projectId} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" required>
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>{project.projectName}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Assign To</label>
        <input name="assignedTo" value={form.assignedTo} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" placeholder="User ID or email" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-300">Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Deadline</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" />
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-400 disabled:opacity-70">
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
