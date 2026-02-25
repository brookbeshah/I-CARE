
import React from 'react';
import { Project, Language, Broadcast } from '../types';
import { useNavigate } from 'react-router-dom';

interface NotificationsProps {
  t: any;
  projects: Project[];
  lang: Language;
  broadcasts: Broadcast[];
}

const Notifications: React.FC<NotificationsProps> = ({ t, projects, lang, broadcasts }) => {
  const navigate = useNavigate();
  const completedProjects = projects.filter(p => p.status === 'completed');

  const sortedBroadcasts = [...broadcasts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="px-5 pt-8 pb-24 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-gray-50 rounded-2xl text-gray-900 border border-gray-100 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">{t.notifications}</h1>
      </div>

      <div className="space-y-8">
        {sortedBroadcasts.length > 0 && (
            <section className="space-y-4">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">{t.officialUpdates}</h2>
                {sortedBroadcasts.map(b => (
                    <div key={b.id} className={`p-6 rounded-[32px] border flex flex-col gap-3 shadow-sm relative ${b.type === 'urgent' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'} ${b.isPinned ? 'ring-2 ring-orange-200' : ''}`}>
                        {b.isPinned && (
                            <div className="absolute -top-3 left-6 bg-orange-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                Pinned
                            </div>
                        )}
                        <div className="flex justify-between items-start">
                            <h4 className="font-black text-gray-900 text-sm tracking-tight">{b.title[lang] || b.title.en}</h4>
                            <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(b.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed">{b.message[lang] || b.message.en}</p>
                    </div>
                ))}
            </section>
        )}

        <section className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">{t.completedTitle}</h2>
            
            {completedProjects.length === 0 && sortedBroadcasts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                 <p className="text-gray-400 text-sm font-bold opacity-60">{t.noUpdates}</p>
              </div>
            ) : (
              completedProjects.map(project => (
                <div key={project.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                   <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-md">
                          <img src={project.images[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm tracking-tight">{project.title[lang] || project.title.en}</h4>
                        <span className="bg-[#02A95C]/10 text-[#02A95C] text-[9px] px-3 py-1 rounded-full font-black uppercase">{t.activeStatus}</span>
                      </div>
                   </div>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed">This humanitarian operation has successfully reached its funding target thanks to your support!</p>
                   <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{project.donorsCount} Contributors</span>
                      <span className="text-[10px] font-black text-[#02A95C] uppercase">{project.goalAmount.toLocaleString()} ETB Raised</span>
                   </div>
                </div>
              ))
            )}
        </section>
      </div>
    </div>
  );
};

export default Notifications;
