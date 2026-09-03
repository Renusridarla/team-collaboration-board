import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const markRead = async (id) => {
    try { await api.patch(`/notifications/${id}/read`); load(); } catch (e) {}
  };

  const del = async (id) => {
    try { await api.delete(`/notifications/${id}`); load(); } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="relative rounded-full border border-zinc-800 p-2 text-zinc-300 hover:bg-zinc-800">
        <Bell size={18} />
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-zinc-700 border border-zinc-600 px-1.5 py-0.5 text-xs text-white">{unreadCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-white">Notifications</div>
            <button onClick={() => { setOpen(false); }} className="text-xs text-zinc-400">Close</button>
          </div>
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {notifications.length === 0 && <div className="text-sm text-zinc-400">No notifications</div>}
            {notifications.map(n => (
              <div key={n._id} className={`rounded-md p-2 ${n.isRead ? 'bg-zinc-800' : 'bg-zinc-800/60'}`}>
                <div className="flex justify-between">
                  <div className="text-sm text-white">{n.title}</div>
                  <div className="text-xs text-zinc-400">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-zinc-300">{n.message}</div>
                <div className="mt-2 flex gap-2">
                  {!n.isRead && <button onClick={() => markRead(n._id)} className="text-xs text-zinc-300">Mark read</button>}
                  <button onClick={() => del(n._id)} className="text-xs text-zinc-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
