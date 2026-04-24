import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Globe, LogOut, Clock, Loader2 } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../ui/Button';

const ActiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);

  const fetchSessions = async () => {
    try {
      const response = await authService.getSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeAll = async () => {
    if (!window.confirm('Are you sure you want to log out from all other devices?')) return;
    setRevoking(true);
    try {
      await authService.revokeAllSessions();
      await fetchSessions();
    } catch (error) {
      alert('Failed to revoke sessions');
    } finally {
      setRevoking(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Active Sessions</h4>
        {sessions.length > 1 && (
          <button 
            onClick={handleRevokeAll}
            disabled={revoking}
            className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline disabled:opacity-50"
          >
            {revoking ? 'Logging out...' : 'Log out from all other devices'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`p-6 border ${session.isCurrent ? 'border-primary-600 bg-primary-50/5 dark:bg-primary-900/5' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]'} flex items-center justify-between group transition-all`}
          >
            <div className="flex items-center gap-6">
              <div className={`p-4 ${session.isCurrent ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'} rounded-none`}>
                {session.device.includes('Mobile') ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-black tracking-tight">{session.device}</p>
                  {session.isCurrent && (
                    <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 uppercase tracking-widest leading-none">
                      This Device
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {session.ip}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(session.lastActive).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSessions;
