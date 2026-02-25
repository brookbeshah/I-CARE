
import React, { useState } from 'react';
import { Donation, Subscription, Project, NGO, Language } from '../types';
import { useNavigate } from 'react-router-dom';

interface MyDonationsProps {
  t: any;
  donations: Donation[];
  subscriptions: Subscription[];
  projects: Project[];
  ngos: NGO[];
  onCancelSub: (id: string) => void;
  lang: Language;
}

const MyDonations: React.FC<MyDonationsProps> = ({ t, donations, subscriptions, projects, ngos, onCancelSub, lang }) => {
  const navigate = useNavigate();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  return (
    <div className="px-5 pt-8 pb-24 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-gray-50 rounded-2xl text-gray-900 active:scale-90 transition-all border border-gray-100 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">{t.myDonations}</h1>
      </div>

      {subscriptions.length > 0 && (
        <section className="mb-10">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t.manageSubscription}</h3>
          <div className="space-y-4">
            {subscriptions.map(sub => {
              const project = projects.find(p => p.id === sub.projectId);
              const ngo = ngos.find(n => n.id === sub.ngoId);
              const displayName = project ? project.title[lang] : ngo?.name;

              return (
                <div key={sub.id} className="bg-[#02A95C]/5 border border-[#02A95C]/10 p-6 rounded-[32px] group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      {ngo && <img src={ngo.logo} className="w-8 h-8 rounded-xl object-cover border border-[#02A95C]/20" alt="" />}
                      <h4 className="font-black text-gray-900 text-sm tracking-tight truncate max-w-[150px]">{displayName}</h4>
                    </div>
                    <span className="bg-[#02A95C] text-white text-[9px] px-3 py-1 rounded-full font-black uppercase shadow-sm">{t.activeStatus}</span>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-xl font-black text-[#02A95C]">{sub.amount.toLocaleString()} ETB / {t.monthly}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{t.nextPayment}: {new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedSub(sub)}
                      className="bg-white text-[#02A95C] text-[10px] font-black px-5 py-2.5 rounded-2xl shadow-sm border border-[#02A95C]/10 uppercase tracking-widest active:scale-95 transition-all"
                    >
                      {t.manage}
                    </button>
                  </div>
                  {/* Subtle background decoration */}
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-8xl pointer-events-none transform rotate-12">
                    💚
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t.donationHistory}</h3>
        {donations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm font-bold opacity-60 uppercase tracking-widest">{t.noGifts}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map(donation => {
              const project = projects.find(p => p.id === donation.projectId);
              const ngo = ngos.find(n => n.id === donation.ngoId);
              const displayName = project ? project.title[lang] : ngo?.name || 'General Support';

              return (
                <div 
                  key={donation.id} 
                  onClick={() => setSelectedDonation(donation)}
                  className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 flex justify-between items-center group active:scale-[0.98] transition-all cursor-pointer hover:border-[#02A95C]"
                >
                  <div className="flex flex-col gap-1">
                    <h4 className="font-black text-gray-900 text-xs truncate max-w-[180px] tracking-tight">{displayName}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">{donation.amount.toLocaleString()} ETB</p>
                    <p className="text-[9px] text-[#02A95C] font-black uppercase tracking-widest">{donation.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedDonation && (
        <ReceiptModal 
          t={t} 
          donation={selectedDonation} 
          project={projects.find(p => p.id === selectedDonation.projectId)}
          ngo={ngos.find(n => n.id === selectedDonation.ngoId)}
          onClose={() => setSelectedDonation(null)} 
        />
      )}

      {selectedSub && (
        <SubscriptionManageModal
          t={t}
          sub={selectedSub}
          project={projects.find(p => p.id === selectedSub.projectId)}
          ngo={ngos.find(n => n.id === selectedSub.ngoId)}
          onCancel={() => {
            onCancelSub(selectedSub.id);
            setSelectedSub(null);
            alert(t.cancelSuccess);
          }}
          onClose={() => setSelectedSub(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

const SubscriptionManageModal = ({ t, sub, project, ngo, onCancel, onClose, lang }: { t: any, sub: Subscription, project?: Project, ngo?: NGO, onCancel: () => void, onClose: () => void, lang: Language }) => {
  const displayName = project ? project.title[lang] : ngo?.name;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-[56px] w-full max-w-sm overflow-hidden animate-slide-up shadow-2xl p-10 flex flex-col gap-8" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-20 h-20 bg-[#02A95C]/10 text-[#02A95C] rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{t.subDetails}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">{t.recurringSub}</p>
        </div>

        <div className="space-y-6 border-y border-gray-50 py-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl">
             <img src={ngo?.logo} className="w-12 h-12 rounded-2xl object-cover border border-white" alt="" />
             <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.ngoInstitution}</p>
                <p className="font-black text-gray-900 text-sm truncate">{displayName}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-2xl border border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.amountEtb}</p>
                <p className="font-black text-gray-900 text-lg">{sub.amount.toLocaleString()}</p>
             </div>
             <div className="p-4 rounded-2xl border border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.nextPayment}</p>
                <p className="font-black text-gray-900 text-lg">{new Date(sub.nextPaymentDate).toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onCancel} 
            className="w-full bg-red-50 text-red-600 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
          >
            {t.cancel} Subscription
          </button>
          <button onClick={onClose} className="w-full bg-gray-900 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({ t, donation, project, ngo, onClose }: { t: any, donation: Donation, project?: Project, ngo?: NGO, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
    <div className="bg-white rounded-[48px] w-full max-w-sm overflow-hidden animate-slide-up shadow-2xl p-10 flex flex-col gap-8" onClick={e => e.stopPropagation()}>
      <div className="text-center">
        <div className="w-16 h-16 bg-[#02A95C]/10 text-[#02A95C] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{t.receipt}</h3>
      </div>

      <div className="space-y-6 border-y border-gray-100 py-8 text-left">
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.transactionId}</span>
            <span className="text-[10px] font-black text-gray-900">{donation.id}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.date}</span>
            <span className="text-xs font-black text-gray-900">{new Date(donation.date).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.beneficiary}</span>
            <span className="text-xs font-black text-gray-900 text-right max-w-[150px] truncate">{ngo?.name}</span>
        </div>
        <div className="pt-4 flex justify-between items-end border-t border-dashed border-gray-100">
             <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{t.grossTotal}</span>
             <div className="text-right">
                <p className="text-2xl font-black text-[#02A95C] tracking-tighter">{donation.total.toFixed(2)}</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.includesFee.replace('{fee}', donation.serviceFee.toFixed(2))}</p>
             </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
        {t.close}
      </button>
    </div>
  </div>
);

export default MyDonations;
