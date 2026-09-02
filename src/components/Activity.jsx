export default function Activity({ item }) {
  return (
    <div className="py-3 border-b border-slate-800">
      <div className="text-sm text-slate-400">{item.userId?.name || 'User'} • {new Date(item.createdAt).toLocaleString()}</div>
      <div className="mt-1 text-sm text-white">{item.description || `${item.action} ${item.entityType || ''}`}</div>
    </div>
  );
}
