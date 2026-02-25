
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NGO, Donation, Project, Broadcast, Language } from '../types';
import { PLACEHOLDER_IMAGE } from '../constants';

const StatCard = ({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: string }) => (
  <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100 flex items-start gap-6">
    <div className="text-4xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-gray-900 my-1 tracking-tighter">{value}</p>
      <p className="text-[10px] text-[#02A95C] font-bold">{sub}</p>
    </div>
  </div>
);

const AdminModal = ({ title, children, onClose }: { title: string, children?: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
    <div 
      className="bg-white rounded-[60px] w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-up border border-gray-100 flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
       <div className="p-12 border-b border-gray-50 flex justify-between items-center">
         <div className="flex items-center gap-6">
           <button onClick={onClose} className="p-3.5 bg-gray-50 rounded-[22px] text-gray-400 hover:text-gray-900 active:scale-90 transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <h3 className="font-black text-2xl text-gray-900 tracking-tighter">{title}</h3>
         </div>
       </div>
       <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
         {children}
       </div>
    </div>
  </div>
);

interface AdminDashboardProps {
  t: any;
  ngos: NGO[];
  setNgos: React.Dispatch<React.SetStateAction<NGO[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  broadcasts: Broadcast[];
  setBroadcasts: React.Dispatch<React.SetStateAction<Broadcast[]>>;
  donations: Donation[];
  serviceFeeRate: number;
  setServiceFeeRate: (val: number) => void;
  maxDonation: number;
  setMaxDonation: (val: number) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  t, ngos, setNgos, projects, setProjects, broadcasts, setBroadcasts, donations, serviceFeeRate, setServiceFeeRate, 
  maxDonation, setMaxDonation, onLogout 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'reporting' | 'ngos' | 'projects' | 'broadcast' | 'settings'>('reporting');
  const [showAddNgo, setShowAddNgo] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  
  // Reporting state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // New NGO state
  const [newNgo, setNewNgo] = useState<Partial<NGO>>({ name: '', logo: '', telebirrMerchantId: '', isVerified: true });
  const [ngoLogoUrl, setNgoLogoUrl] = useState('');

  // New Project state
  const [newProject, setNewProject] = useState<Partial<Project>>({ title: { en: '', am: '', or: '', ti: '' }, description: { en: '', am: '', or: '', ti: '' }, ngoId: '', goalAmount: 0, images: [] });
  const [projectImageUrl, setProjectImageUrl] = useState('');

  // New Broadcast state
  const [newBroadcast, setNewBroadcast] = useState<Partial<Broadcast>>({ title: { en: '', am: '', or: '', ti: '' }, message: { en: '', am: '', or: '', ti: '' }, type: 'info' });

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      if (!startDate && !endDate) return true;
      const dDate = new Date(d.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      return dDate >= start && dDate <= (end + 86400000);
    });
  }, [donations, startDate, endDate]);

  const exportToExcel = () => {
    const headers = ['ID', 'Date', 'Donor Phone', 'NGO', 'Amount', 'Fee', 'Total'];
    const csvContent = [headers.join(','), ...filteredDonations.map(d => [d.id, new Date(d.date).toLocaleString(), d.donorPhone, ngos.find(n => n.id === d.ngoId)?.name, d.amount, d.serviceFee, d.total].join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `icare_report_${Date.now()}.csv`;
    link.click();
  };

  const createNgo = () => {
    const finalLogo = ngoLogoUrl || newNgo.logo || PLACEHOLDER_IMAGE;
    if (!newNgo.name) return;
    const ngo: NGO = {
      id: `ngo-${Date.now()}`,
      name: newNgo.name,
      licenseNo: newNgo.licenseNo || 'CH-0000',
      description: newNgo.description || '',
      logo: finalLogo,
      telebirrMerchantId: newNgo.telebirrMerchantId,
      isVerified: true,
      isSuspended: false,
      isFeatured: false,
      totalRaised: 0,
      joinedDate: new Date().toISOString()
    };
    setNgos(prev => [...prev, ngo]);
    setShowAddNgo(false);
    setNewNgo({ name: '', logo: '' });
    setNgoLogoUrl('');
  };

  const launchProject = () => {
    if (!newProject.title?.en || !newProject.ngoId) return;
    const finalImages = newProject.images?.length ? newProject.images : [PLACEHOLDER_IMAGE];
    const p: Project = {
      id: `p-${Date.now()}`,
      ngoId: newProject.ngoId,
      title: newProject.title as any,
      description: newProject.description as any,
      goalAmount: newProject.goalAmount || 1000,
      raisedAmount: 0,
      images: finalImages,
      category: 'Emergency',
      isFeatured: false,
      donorsCount: 0,
      status: 'active'
    };
    setProjects(prev => [...prev, p]);
    setShowAddProject(false);
    setNewProject({ title: { en: '', am: '', or: '', ti: '' }, images: [] });
    setProjectImageUrl('');
  };

  const archiveProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p));
  };

  const deleteProject = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this relief project? This action cannot be undone.")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const sendBroadcast = () => {
    if (!newBroadcast.title?.en) return;
    const b: Broadcast = {
      id: `b-${Date.now()}`,
      title: newBroadcast.title as any,
      message: newBroadcast.message as any,
      date: new Date().toISOString(),
      type: newBroadcast.type || 'info',
      isPinned: false
    };
    setBroadcasts(prev => [b, ...prev]);
    setNewBroadcast({ title: { en: '', am: '', or: '', ti: '' }, message: { en: '', am: '', or: '', ti: '' }, type: 'info' });
  };

  const deleteBroadcast = (id: string) => {
    if (confirm("Permanently delete this broadcast?")) {
      setBroadcasts(prev => prev.filter(b => b.id !== id));
    }
  };

  const togglePinBroadcast = (id: string) => {
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, isPinned: !b.isPinned } : b));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file as Blob));
  };

  const handleMultiImage = (e: React.ChangeEvent<HTMLInputElement>, setter: (urls: string[]) => void, current: string[]) => {
    const files = e.target.files;
    if (files) {
        const urls = Array.from(files).map(f => URL.createObjectURL(f as Blob));
        setter([...current, ...urls].slice(0, 5));
    }
  };

  const addProjectImageByUrl = () => {
    if (projectImageUrl && (newProject.images || []).length < 5) {
        setNewProject({...newProject, images: [...(newProject.images || []), projectImageUrl]});
        setProjectImageUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-inter">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-gray-900 p-10 flex flex-col text-white shadow-2xl relative z-10">
        <div className="flex items-center gap-4 mb-16">
           <span className="p-3 bg-[#02A95C] text-white rounded-[22px] font-black text-2xl shadow-lg leading-none">IC</span>
           <h2 className="font-black text-2xl tracking-tighter uppercase leading-none">Admin OS</h2>
        </div>
        
        <nav className="flex md:flex-col gap-3 flex-1 overflow-x-auto md:overflow-visible scrollbar-hide">
          {['reporting', 'ngos', 'projects', 'broadcast', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none text-left px-8 py-5 rounded-[28px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#02A95C] text-white shadow-2xl' : 'text-gray-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-10 py-5 border-2 border-red-900/30 text-red-500 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-red-900/10 transition-all">Sign Out</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 md:p-16 max-w-7xl overflow-y-auto bg-gray-50/20 scrollbar-hide">
        <div className="flex justify-between items-center mb-16">
          <h3 className="text-5xl font-black text-gray-900 capitalize tracking-tighter">{activeTab}</h3>
          <div className="flex gap-4">
             {activeTab === 'reporting' && (
               <button onClick={exportToExcel} className="bg-gray-900 text-white px-10 py-4 rounded-[28px] font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                 Export Excel
               </button>
             )}
             {activeTab === 'ngos' && (
               <button onClick={() => setShowAddNgo(true)} className="bg-gray-900 text-white px-10 py-4 rounded-[28px] font-black text-[11px] uppercase tracking-widest shadow-2xl">+ New Institution</button>
             )}
             {activeTab === 'projects' && (
               <button onClick={() => setShowAddProject(true)} className="bg-[#02A95C] text-white px-10 py-4 rounded-[28px] font-black text-[11px] uppercase tracking-widest shadow-2xl">+ Launch Relief</button>
             )}
          </div>
        </div>

        {activeTab === 'reporting' && (
          <div className="space-y-12">
            <div className="bg-white p-10 rounded-[44px] shadow-sm border border-gray-100 flex flex-wrap gap-8 items-end">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">From Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-50 p-4 rounded-2xl border-none outline-none font-black text-sm" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">To Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-50 p-4 rounded-2xl border-none outline-none font-black text-sm" />
                </div>
                {(startDate || endDate) && (
                    <button onClick={() => {setStartDate(''); setEndDate('');}} className="text-[10px] font-black text-red-500 uppercase tracking-widest pb-4">Clear</button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <StatCard title="Total Collected" value={`${filteredDonations.reduce((a,d)=>a+d.amount,0).toLocaleString()} ETB`} sub="Base Donations" icon="💰" />
               <StatCard title="Fee Revenue" value={`${filteredDonations.reduce((a,d)=>a+d.serviceFee,0).toLocaleString()} ETB`} sub={`Rate: ${(serviceFeeRate*100).toFixed(1)}%`} icon="⚡" />
               <StatCard title="Active NGO count" value={ngos.length.toString()} sub="Verified Partners" icon="🏢" />
            </div>

            {/* High Fidelity Transaction List - Added based on user screenshot */}
            <div className="bg-white rounded-[56px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                    <h4 className="font-black text-2xl text-gray-900 tracking-tighter uppercase">Recent Activity</h4>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredDonations.length} Successful Transfers</span>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-50">
                                <th className="px-10 py-6">Date & Time</th>
                                <th className="px-10 py-6">Recipient (Project/NGO)</th>
                                <th className="px-10 py-6">Donation Amount</th>
                                <th className="px-10 py-6">Payer Phone</th>
                                <th className="px-10 py-6 text-right">Fee ({(serviceFeeRate * 100).toFixed(1)}%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDonations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No matching transactions found</td>
                                </tr>
                            ) : (
                                filteredDonations.map(d => {
                                    const project = projects.find(p => p.id === d.projectId);
                                    const ngo = ngos.find(n => n.id === d.ngoId);
                                    return (
                                        <tr key={d.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <p className="font-bold text-gray-900 text-sm tracking-tight">{new Date(d.date).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(d.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{project ? project.title.en : ngo?.name || 'Institutional Support'}</p>
                                                <p className="text-[10px] text-[#02A95C] font-black uppercase tracking-widest">{ngo?.name}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="font-black text-gray-900 text-sm">{d.amount.toLocaleString()}</span>
                                                <span className="text-[9px] font-black text-gray-400 ml-1.5">ETB</span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span className="font-mono text-xs text-gray-500 font-bold tracking-wider">{d.donorPhone}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className="text-[11px] font-black text-[#02A95C] bg-[#02A95C]/5 px-3 py-1.5 rounded-xl">{d.serviceFee.toFixed(2)} ETB</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'ngos' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {ngos.map(ngo => (
              <div key={ngo.id} className="bg-white p-10 rounded-[56px] shadow-sm border border-gray-100 flex items-center gap-8 hover:border-[#02A95C] transition-all">
                <img src={ngo.logo || PLACEHOLDER_IMAGE} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} className="w-20 h-20 rounded-[28px] object-cover shadow-sm border" alt="" />
                <div className="flex-1">
                  <h4 className="font-black text-2xl text-gray-900 tracking-tight leading-none mb-2">{ngo.name}</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Merchant: {ngo.telebirrMerchantId || 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => navigate(`/admin/edit-ngo/${ngo.id}`)} className="px-6 py-3 text-[10px] font-black text-blue-600 bg-blue-50 rounded-2xl uppercase">Edit Page</button>
                  <button onClick={() => setNgos(prev => prev.map(n => n.id === ngo.id ? {...n, isSuspended: !n.isSuspended} : n))} className={`px-6 py-3 text-[10px] font-black rounded-2xl uppercase transition-all ${ngo.isSuspended ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {ngo.isSuspended ? 'Resume' : 'Suspend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-[56px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
             {projects.map(p => (
                 <div key={p.id} className="p-8 flex items-center gap-8 hover:bg-gray-50 transition-colors group">
                   <div className="w-20 h-20 rounded-[32px] overflow-hidden shadow-lg shrink-0">
                        <img src={p.images[0] || PLACEHOLDER_IMAGE} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                   </div>
                   <div className="flex-1">
                     <h5 className="font-black text-xl text-gray-900 tracking-tight leading-none mb-1">{p.title.en} {p.isArchived && <span className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded-full uppercase ml-2 tracking-widest">Archived</span>}</h5>
                     <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{ngos.find(n => n.id === p.ngoId)?.name}</p>
                   </div>
                   <div className="flex gap-2">
                        <button 
                            onClick={() => archiveProject(p.id)} 
                            title={p.isArchived ? "Unarchive" : "Archive (Mute Donations)"}
                            className={`p-4 rounded-3xl transition-all ${p.isArchived ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-300 hover:text-blue-500'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </button>
                        <button 
                            onClick={() => deleteProject(p.id)} 
                            title="Permanently Delete Project"
                            className="p-4 bg-gray-100 text-gray-300 rounded-3xl hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <button onClick={() => setProjects(prev => prev.map(proj => proj.id === p.id ? {...proj, isFeatured: !proj.isFeatured} : proj))} className={`p-4 rounded-3xl ${p.isFeatured ? 'bg-[#02A95C]/10 text-[#02A95C]' : 'bg-gray-50 text-gray-300'}`}>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </button>
                        <button onClick={() => navigate(`/admin/edit-project/${p.id}`)} className="p-4 bg-gray-50 text-gray-400 rounded-3xl hover:text-blue-600 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={3} strokeLinecap="round"/></svg>
                        </button>
                   </div>
                 </div>
               ))}
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {/* Create New Broadcast */}
            <div className="bg-white p-12 rounded-[70px] shadow-sm border border-gray-100 flex flex-col">
                <h4 className="text-3xl font-black mb-10 tracking-tighter uppercase">New Announcement</h4>
                <div className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Channel Type</label>
                          <select value={newBroadcast.type} onChange={e => setNewBroadcast({...newBroadcast, type: e.target.value as any})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black appearance-none border border-transparent focus:border-[#02A95C] transition-all">
                              <option value="info">General Info</option>
                              <option value="urgent">Urgent Alert</option>
                              <option value="success">Success Story</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Title (EN)</label>
                          <input type="text" placeholder="Summary" value={newBroadcast.title?.en} onChange={e => setNewBroadcast({...newBroadcast, title: {...newBroadcast.title as any, en: e.target.value}})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black border border-transparent focus:border-[#02A95C] transition-all" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Message Content (EN)</label>
                      <textarea value={newBroadcast.message?.en} onChange={e => setNewBroadcast({...newBroadcast, message: {...newBroadcast.message as any, en: e.target.value}})} placeholder="Write your announcement details here..." className="w-full p-6 bg-gray-50 rounded-[28px] h-48 outline-none font-black text-sm border border-transparent focus:border-[#02A95C] transition-all" />
                  </div>
                  <button onClick={sendBroadcast} className="w-full py-6 bg-gray-900 text-white font-black rounded-[32px] uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all hover:bg-[#02A95C]">Blast to all Users</button>
                </div>
            </div>

            {/* Manage Existing Broadcasts */}
            <div className="bg-white p-12 rounded-[70px] shadow-sm border border-gray-100 flex flex-col">
                <h4 className="text-3xl font-black mb-10 tracking-tighter uppercase">History & Controls</h4>
                <div className="space-y-4 overflow-y-auto scrollbar-hide flex-1 max-h-[600px] pr-2">
                  {broadcasts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[44px] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Sent Broadcasts</p>
                    </div>
                  ) : (
                    broadcasts.map(b => (
                      <div key={b.id} className={`p-6 rounded-[40px] border flex flex-col gap-4 relative group transition-all ${b.isPinned ? 'bg-[#02A95C]/5 border-[#02A95C]/20 ring-1 ring-[#02A95C]/20' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}>
                        {b.isPinned && (
                          <div className="absolute top-4 right-14 bg-[#02A95C] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                            PINNED
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-black text-gray-900 text-sm tracking-tight leading-tight mb-1">{b.title.en}</h5>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(b.date).toLocaleDateString()} • {b.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => togglePinBroadcast(b.id)}
                              title={b.isPinned ? "Unpin Message" : "Pin Message to Top"}
                              className={`p-2 rounded-xl transition-all ${b.isPinned ? 'text-[#02A95C] bg-white' : 'text-gray-400 hover:text-[#02A95C] hover:bg-white'}`}
                            >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                            </button>
                            <button 
                              onClick={() => deleteBroadcast(b.id)}
                              title="Delete Broadcast"
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                            >
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3">{b.message.en}</p>
                      </div>
                    ))
                  )}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-3xl bg-white p-16 rounded-[70px] shadow-sm border border-gray-100">
              <h4 className="text-3xl font-black mb-12 tracking-tighter uppercase">Platform Master Controls</h4>
              <div className="space-y-16">
                 <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Service Fee Adjust (2.5% - 5.5%)</label>
                    <div className="flex items-center gap-12">
                      <input 
                        type="range" min="2.5" max="5.5" step="0.1" 
                        value={serviceFeeRate * 100}
                        onChange={(e) => setServiceFeeRate(Number(e.target.value) / 100)}
                        className="flex-1 h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#02A95C]"
                      />
                      <div className="text-center p-8 bg-gray-50 rounded-[44px] min-w-[160px]">
                        <span className="text-6xl font-black text-[#02A95C] tracking-tighter">{(serviceFeeRate * 100).toFixed(1)}</span>
                        <span className="text-xl font-black text-gray-300 ml-2">%</span>
                      </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-8">
                    <div className="p-8 bg-gray-50 rounded-[44px]">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Max Single Donation (ETB)</label>
                        <input type="number" value={maxDonation} onChange={e => setMaxDonation(Number(e.target.value))} className="w-full bg-white p-4 rounded-2xl outline-none font-black text-sm text-center" />
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>

      {/* Onboard NGO Partner */}
      {showAddNgo && (
        <AdminModal title="Onboard Institutional Partner" onClose={() => setShowAddNgo(false)}>
           <div className="space-y-6">
              <div className="flex gap-8 items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {(ngoLogoUrl || newNgo.logo) ? <img src={ngoLogoUrl || newNgo.logo} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} className="w-full h-full object-cover" alt="" /> : <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2}/></svg>}
                  </div>
                  <div className="flex-1 space-y-3">
                      <label className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all block text-center">
                          Upload Local File
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, url => setNewNgo({...newNgo, logo: url}))} />
                      </label>
                      <input 
                        type="text" 
                        placeholder="Or Paste Image URL..." 
                        value={ngoLogoUrl}
                        onChange={(e) => setNgoLogoUrl(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-[11px]" 
                      />
                  </div>
              </div>
              <input type="text" placeholder="Institution Name" className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black" value={newNgo.name} onChange={e => setNewNgo({...newNgo, name: e.target.value})} />
              <input type="text" placeholder="Telebirr Merchant ID" className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black" value={newNgo.telebirrMerchantId} onChange={e => setNewNgo({...newNgo, telebirrMerchantId: e.target.value})} />
              <textarea placeholder="Organizational Statement..." className="w-full p-6 bg-gray-50 rounded-[28px] h-32 outline-none font-black text-sm" value={newNgo.description} onChange={e => setNewNgo({...newNgo, description: e.target.value})} />
              <button onClick={createNgo} className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl">Verify & Launch Institution</button>
           </div>
        </AdminModal>
      )}

      {/* Launch New Relief Project */}
      {showAddProject && (
        <AdminModal title="Launch New Relief Project" onClose={() => setShowAddProject(false)}>
           <div className="space-y-6">
              <select className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black appearance-none" value={newProject.ngoId} onChange={e => setNewProject({...newProject, ngoId: e.target.value})}>
                <option value="">Select Beneficiary NGO</option>
                {ngos.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
              <input type="text" placeholder="Project Title (EN)" className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black" value={newProject.title?.en} onChange={e => setNewProject({...newProject, title: {...newProject.title as any, en: e.target.value}})} />
              <textarea placeholder="Relief Project Description (Describe the impact...)" className="w-full p-6 bg-gray-50 rounded-[28px] h-32 outline-none font-black text-sm" value={newProject.description?.en} onChange={e => setNewProject({...newProject, description: {...newProject.description as any, en: e.target.value}})} />
              
              <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Operation Gallery (X/5)</label>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                      {(newProject.images || []).map((img, i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner relative group">
                              <img src={img || PLACEHOLDER_IMAGE} onError={(e) => e.currentTarget.src = PLACEHOLDER_IMAGE} className="w-full h-full object-cover" alt="" />
                              <button onClick={() => setNewProject({...newProject, images: (newProject.images || []).filter((_,idx)=>idx!==i)})} className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} strokeLinecap="round" /></svg>
                              </button>
                          </div>
                      ))}
                      {(newProject.images || []).length < 5 && (
                          <label className="aspect-square bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                              <input type="file" multiple className="hidden" accept="image/*" onChange={e => handleMultiImage(e, urls => setNewProject({...newProject, images: urls}), newProject.images || [])} />
                          </label>
                      )}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Add Image by URL..." 
                      value={projectImageUrl}
                      onChange={(e) => setProjectImageUrl(e.target.value)}
                      className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-[11px]" 
                    />
                    <button onClick={addProjectImageByUrl} className="bg-gray-900 text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest">Add URL</button>
                  </div>
              </div>
              <input type="number" placeholder="Target Goal (ETB)" className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black" value={newProject.goalAmount || ''} onChange={e => setNewProject({...newProject, goalAmount: Number(e.target.value)})} />
              <button onClick={launchProject} className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl">Broadcast & Start Raising</button>
           </div>
        </AdminModal>
      )}
    </div>
  );
};

export default AdminDashboard;
