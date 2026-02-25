
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { NGO, Project, Language } from '../types';
import DonationModal from '../components/DonationModal';

interface NGOLandingProps {
  t: any;
  ngos: NGO[];
  projects: Project[];
  lang: Language;
  onDonate: (id: string, amount: number, type: 'one-time' | 'recurring', ngoId: string) => Promise<any>;
  serviceFeeRate: number;
}

const NGOLanding: React.FC<NGOLandingProps> = ({ t, ngos, projects, lang, onDonate, serviceFeeRate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonateModal, setShowDonateModal] = useState(false);
  
  const ngo = ngos.find(n => n.id === id);
  const ngoProjects = projects.filter(p => p.ngoId === id);

  if (!ngo) return <div className="p-20 text-center font-bold">Institution Not Found</div>;

  return (
    <div className="pb-32 bg-white min-h-screen">
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white/95 backdrop-blur shadow-xl p-3.5 rounded-2xl border border-gray-100 text-gray-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="relative h-72 rounded-b-[60px] overflow-hidden shadow-2xl">
        <img src={ngo.coverImage || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1000'} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute -bottom-10 left-10 p-2 bg-white rounded-[40px] shadow-2xl border-4 border-white">
          <img src={ngo.logo} className="w-24 h-24 rounded-[32px] object-cover" alt="" />
        </div>
      </div>
      
      <div className="mt-16 px-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
              {ngo.name}
              {ngo.isVerified && (
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              )}
            </h1>
            <p className="text-[11px] font-black text-[#02A95C] uppercase tracking-[0.3em] mt-3">{t.verified} • Est. {new Date(ngo.joinedDate).getFullYear()}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 leading-relaxed font-medium mb-10">{ngo.description}</p>
        
        <div className="grid grid-cols-2 gap-5 mb-12">
          <div className="bg-gray-50 rounded-[40px] p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-black text-gray-900">{ngoProjects.length}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">{t.activeOperations}</p>
          </div>
          <div className="bg-gray-50 rounded-[40px] p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-black text-[#02A95C] truncate px-2">{ngo.totalRaised.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">{t.etbImpact}</p>
          </div>
        </div>

        <section className="pb-10">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 ml-2">{t.allProjects}</h3>
            <div className="space-y-6">
            {ngoProjects.map(project => (
                <Link to={`/project/${project.id}`} key={project.id} className="block bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-50 p-5 group hover:border-[#02A95C] transition-all">
                <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden shrink-0 shadow-lg">
                        <img src={project.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex-1">
                    <h4 className="font-black text-sm text-gray-900 leading-snug mb-3 line-clamp-2 tracking-tight">{project.title[lang] || project.title.en}</h4>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#02A95C] uppercase tracking-widest">{Math.round((project.raisedAmount/project.goalAmount)*100)}% {t.funded}</span>
                        <svg className="w-5 h-5 text-gray-200 group-hover:text-[#02A95C] transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </section>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-8 max-w-[450px] mx-auto z-40">
        <button 
          onClick={() => setShowDonateModal(true)}
          className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-[#02A95C]/30 uppercase tracking-[0.2em] active:scale-95 transition-all"
        >
          {t.donateToNgo}
        </button>
      </div>

      {showDonateModal && (
        <DonationModal 
          t={t}
          ngos={ngos}
          project={{
            id: 'GENERAL',
            ngoId: ngo.id,
            title: { en: `General Support for ${ngo.name}`, am: `${ngo.name} አጠቃላይ ድጋፍ`, or: `Gumaacha ${ngo.name}`, ti: `ን${ngo.name} ሓፈሻዊ ደገፍ` } as any,
            description: { en: 'Your donation will be used where it is needed most within our organization.' } as any,
            goalAmount: 0,
            raisedAmount: 0,
            images: [ngo.logo],
            category: 'Emergency',
            isFeatured: false,
            donorsCount: 0,
            status: 'active'
          }}
          onClose={() => setShowDonateModal(false)}
          onConfirm={async (amount, type, ngoId) => {
            const success = await onDonate('GENERAL', amount, type, ngoId);
            if (success) setShowDonateModal(false);
          }}
          serviceFeeRate={serviceFeeRate}
        />
      )}
    </div>
  );
};

export default NGOLanding;
