
import React, { useState } from 'react';
import { Project, NGO } from '../types';

interface DonationModalProps {
  t: any;
  project?: Project;
  ngos: NGO[];
  onClose: () => void;
  onConfirm: (amount: number, type: 'one-time' | 'recurring', ngoId: string) => void;
  serviceFeeRate: number;
}

const DonationModal: React.FC<DonationModalProps> = ({ t, project, ngos, onClose, onConfirm, serviceFeeRate }) => {
  const [amount, setAmount] = useState<number>(100);
  const [donateType, setDonateType] = useState<'one-time' | 'recurring'>('one-time');
  const [selectedNgoId, setSelectedNgoId] = useState<string>(project?.ngoId || ngos[0]?.id || '');
  
  const serviceFee = amount * serviceFeeRate;
  const total = amount + serviceFee;
  const presets = [50, 100, 200, 500, 1000];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-white rounded-[44px] overflow-hidden animate-slide-up shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full"></div>

        <div className="p-8 pt-10 overflow-y-auto scrollbar-hide">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{t.confirmDonation}</h3>
            <button 
              onClick={onClose} 
              className="p-2.5 bg-gray-100 text-gray-400 rounded-full hover:bg-gray-200 active:scale-90 transition-all"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="bg-gray-100 p-1 rounded-3xl flex gap-1 mb-8 shadow-inner">
            <button 
              onClick={() => setDonateType('one-time')}
              className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${donateType === 'one-time' ? 'bg-white text-[#02A95C] shadow-md' : 'text-gray-400'}`}
            >
              {t.oneTime}
            </button>
            <button 
              onClick={() => setDonateType('recurring')}
              className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${donateType === 'recurring' ? 'bg-white text-[#02A95C] shadow-md' : 'text-gray-400'}`}
            >
              {t.monthly}
            </button>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t.recipientInst}</label>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-2 px-2 pb-2">
              {ngos.filter(n => !n.isSuspended).map(ngo => (
                <button 
                  key={ngo.id} 
                  onClick={() => setSelectedNgoId(ngo.id)}
                  className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-[32px] border-2 transition-all ${selectedNgoId === ngo.id ? 'border-[#02A95C] bg-[#02A95C]/5' : 'border-gray-50 bg-white'}`}
                >
                  <div className="relative">
                    <img src={ngo.logo} className="w-10 h-10 rounded-2xl object-cover" alt="" />
                    {selectedNgoId === ngo.id && (
                      <div className="absolute -top-1 -right-1 bg-[#02A95C] text-white rounded-full p-0.5 shadow-sm">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase truncate w-20 text-center ${selectedNgoId === ngo.id ? 'text-[#02A95C]' : 'text-gray-400'}`}>{ngo.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">{t.amountEtb}</label>
            <div className="bg-gray-900 rounded-[32px] p-8 text-center shadow-xl shadow-gray-200">
              <div className="flex items-center justify-center gap-2">
                <span className="text-gray-500 font-black text-2xl uppercase">ETB</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full text-5xl font-black text-white bg-transparent outline-none text-center"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2 mt-6">
              {presets.map(p => (
                <button 
                  key={p} 
                  onClick={() => setAmount(p)}
                  className={`shrink-0 px-8 py-4 rounded-2xl text-xs font-black border-2 transition-all ${amount === p ? 'bg-[#02A95C] border-[#02A95C] text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-[40px] p-8 space-y-5 mb-10 border border-gray-100">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>{t.supportGift}</span>
              <span className="text-gray-900">{amount.toLocaleString()} ETB</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>{t.serviceFeeLabel} ({(serviceFeeRate * 100).toFixed(1)}%)</span>
              <span className="text-gray-400">+{serviceFee.toFixed(2)} ETB</span>
            </div>
            <div className="border-t border-gray-200 pt-6 flex justify-between items-end">
              <span className="font-black text-gray-900 text-xs uppercase tracking-[0.2em]">{t.finalTotal}</span>
              <div className="text-right leading-none">
                <span className="font-black text-[#02A95C] text-4xl tracking-tighter">{total.toFixed(2)}</span>
                <span className="text-[10px] font-black text-[#02A95C] ml-1.5 uppercase">ETB</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onConfirm(amount, donateType, selectedNgoId)}
            className="w-full py-6 bg-[#02A95C] text-white rounded-[32px] font-black text-lg shadow-2xl shadow-[#02A95C]/20 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {t.confirmPay}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 py-2 text-gray-400 font-black text-[10px] uppercase tracking-widest text-center"
          >
            {t.goBack}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
