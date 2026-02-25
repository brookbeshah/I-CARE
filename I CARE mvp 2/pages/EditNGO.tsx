
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NGO } from '../types';

interface EditNGOProps {
  ngos: NGO[];
  setNgos: React.Dispatch<React.SetStateAction<NGO[]>>;
}

const EditNGO: React.FC<EditNGOProps> = ({ ngos, setNgos }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ngo = ngos.find(n => n.id === id);

  if (!ngo) return <div className="p-20 text-center font-black">NGO Not Found</div>;

  const [formData, setFormData] = useState<NGO>({ ...ngo });
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [coverUrlInput, setCoverUrlInput] = useState('');

  const handleSave = () => {
    setNgos(prev => prev.map(n => n.id === id ? formData : n));
    navigate('/admin');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: URL.createObjectURL(file as Blob) });
    }
  };

  const applyLogoUrl = () => {
    if (logoUrlInput) {
        setFormData({ ...formData, logo: logoUrlInput });
        setLogoUrlInput('');
    }
  };

  const applyCoverUrl = () => {
    if (coverUrlInput) {
        setFormData({ ...formData, coverImage: coverUrlInput });
        setCoverUrlInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 md:p-20 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
            <button onClick={() => navigate('/admin')} className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 text-gray-400 active:scale-95 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Edit Institution Data</h1>
        </div>

        <div className="bg-white rounded-[60px] p-12 shadow-sm border border-gray-100 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Institution Logo</label>
                    <div className="flex items-center gap-6">
                        <img src={formData.logo} className="w-24 h-24 rounded-[32px] object-cover border-4 border-gray-50 shadow-sm" alt="" />
                        <div className="flex-1 space-y-2">
                            <label className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer block text-center">
                                Upload File
                                <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'logo')} />
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Logo URL" 
                                    className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold text-[10px]" 
                                    value={logoUrlInput}
                                    onChange={e => setLogoUrlInput(e.target.value)}
                                />
                                <button onClick={applyLogoUrl} className="bg-gray-100 text-gray-600 px-3 rounded-xl text-[8px] font-black uppercase">Apply</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Merchant Account</label>
                    <input type="text" value={formData.telebirrMerchantId} onChange={e => setFormData({...formData, telebirrMerchantId: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black text-sm" placeholder="Merchant ID" />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Cover Image</label>
                <div className="relative h-48 rounded-[32px] overflow-hidden group">
                    <img src={formData.coverImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                        <label className="bg-white text-gray-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer">
                            Upload Cover
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'coverImage')} />
                        </label>
                    </div>
                </div>
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Or Paste Cover Image URL..." 
                        className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-xs" 
                        value={coverUrlInput}
                        onChange={e => setCoverUrlInput(e.target.value)}
                    />
                    <button onClick={applyCoverUrl} className="bg-gray-900 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest">Apply URL</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Display Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black text-lg" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">License Number</label>
                    <input type="text" value={formData.licenseNo} onChange={e => setFormData({...formData, licenseNo: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black text-lg" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Institutional Bio</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-8 bg-gray-50 rounded-[44px] h-48 outline-none font-black text-sm leading-relaxed" />
            </div>

            <div className="flex gap-4">
                <button onClick={handleSave} className="flex-1 py-6 bg-[#02A95C] text-white font-black rounded-[32px] uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">Synchronize All Changes</button>
                <button onClick={() => navigate('/admin')} className="px-10 py-6 bg-gray-100 text-gray-400 font-black rounded-[32px] uppercase tracking-widest text-xs">Discard</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditNGO;
