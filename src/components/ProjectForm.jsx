import { useEffect, useState } from 'react';

const initialForm = {
  projectName: '',
  description: '',
  workspaceName: '',
  members: '',
  status: 'Active',
};

export default function ProjectForm({ initialValues, onSubmit, isSubmitting, submitLabel, error }) {
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
    onSubmit({
      ...form,
      members: form.members.split(',').map((item) => item.trim()).filter(Boolean),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Project Name</label>
        <input name="projectName" value={form.projectName} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" required />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Workspace Name</label>
        <input name="workspaceName" value={form.workspaceName} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Members</label>
        <input name="members" value={form.members} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none" placeholder="Comma separated member emails" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-300">Status</label>
        <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none">
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Archived">Archived</option>
        </select>
      </div>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-400 disabled:opacity-70">
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
