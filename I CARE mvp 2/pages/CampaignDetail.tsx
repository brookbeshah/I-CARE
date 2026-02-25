
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project, NGO, Language } from '../types';
import DonationModal from '../components/DonationModal';

interface CampaignDetailProps {
  t: any;
  projects: Project[];
  ngos: NGO[];
  lang: Language;
  onDonate: (id: string, amount: number, type: 'one-time' | 'recurring', ngoId: string) => Promise<any>;
  serviceFeeRate: number;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ t, projects, ngos, lang, onDonate, serviceFeeRate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const project = projects.find(p => p.id === id);
  if (!project) return <div className="p-20 text-center font-bold">Project not found</div>;
  const ngo = ngos.find(n => n.id === project.ngoId);

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

      <div className="relative h-[400px] rounded-b-[60px] overflow-hidden shadow-2xl">
        <img src={project.images[activeImage]} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2.5">
          {project.images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${activeImage === i ? 'bg-[#02A95C] w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="px-8 pt-10">
        <div className="flex items-center gap-5 mb-8">
          <img src={ngo?.logo} className="w-16 h-16 rounded-[24px] border-4 border-gray-50 shadow-sm object-cover" alt="" />
          <div>
            <Link to={`/ngo/${ngo?.id}`} className="font-black text-gray-900 text-xl flex items-center gap-2 tracking-tighter">
              {ngo?.name}
              {ngo?.isVerified && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              )}
            </Link>
            <span className="text-[10px] text-[#02A95C] font-black uppercase tracking-[0.2em]">{t.partnerOrg}</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">{project.title[lang] || project.title.en}</h1>
        
        <div className="bg-gray-50 p-8 rounded-[44px] border border-gray-100 mb-10 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.impactRaised}</p>
                <span className="text-3xl font-black text-[#02A95C]">{project.raisedAmount.toLocaleString()}</span>
                <span className="text-xs font-black text-[#02A95C] ml-1.5 uppercase tracking-wider">ETB</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{t.target}: {project.goalAmount.toLocaleString()}</span>
          </div>
          <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-4 border border-gray-100 p-0.5">
            <div 
              className="h-full bg-[#02A95C] rounded-full shadow-lg shadow-[#02A95C]/20" 
              style={{ width: `${Math.min(100, (project.raisedAmount / project.goalAmount) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 font-bold">{project.donorsCount} {t.topDonors}</p>
            <p className="text-[11px] font-black text-[#02A95C] uppercase tracking-widest">{Math.round((project.raisedAmount / project.goalAmount) * 100)}% {t.funded}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t.theOperation}</h3>
          <p className="text-gray-600 leading-relaxed font-medium">{project.description[lang] || project.description.en}</p>
        </div>

        <section className="mb-10">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{t.recentDonors}</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[32px] border border-gray-100">
                <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center text-xs font-black text-gray-300 shadow-sm">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900 tracking-tight">{t.verifiedGift}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.successTransfer}</p>
                </div>
                <span className="font-black text-[#02A95C]">{(5000 / i).toLocaleString()} ETB</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-8 max-w-[450px] mx-auto z-40">
        <button 
          onClick={() => setShowDonateModal(true)}
          className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-[#02A95C]/30 uppercase tracking-[0.2em] active:scale-95 transition-all"
        >
          {t.donate}
        </button>
      </div>

      {showDonateModal && (
        <DonationModal 
          t={t}
          project={project}
          ngos={ngos}
          onClose={() => setShowDonateModal(false)}
          onConfirm={async (amount, type, ngoId) => {
            const success = await onDonate(project.id, amount, type, ngoId);
            if (success) {
              setShowDonateModal(false);
            }
          }}
          serviceFeeRate={serviceFeeRate}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
