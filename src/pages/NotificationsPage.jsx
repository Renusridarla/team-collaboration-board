import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try { const res = await api.get('/notifications'); setNotifications(res.data || []); } catch (e) {}
  };

  const markRead = async (id) => { try { await api.patch(`/notifications/${id}/read`); load(); } catch (e) {} };
  const del = async (id) => { try { await api.delete(`/notifications/${id}`); load(); } catch (e) {} };

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-4 animate-fade-in">
        {notifications.length === 0 && <div className="text-sm text-zinc-400">No notifications</div>}
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n._id} className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{n.title}</div>
                  <div className="text-xs text-zinc-400">{n.message}</div>
                </div>
                <div className="text-xs text-zinc-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-3 flex gap-2">
                {!n.isRead && <button onClick={() => markRead(n._id)} className="text-xs text-zinc-300">Mark read</button>}
                <button onClick={() => del(n._id)} className="text-xs text-zinc-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
