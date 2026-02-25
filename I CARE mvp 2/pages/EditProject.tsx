
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, NGO } from '../types';

interface EditProjectProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  ngos: NGO[];
}

const EditProject: React.FC<EditProjectProps> = ({ projects, setProjects, ngos }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="p-20 text-center font-black">Project Not Found</div>;

  const [formData, setFormData] = useState<Project>({ ...project });
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleSave = () => {
    setProjects(prev => prev.map(p => p.id === id ? formData : p));
    navigate('/admin');
  };

  const handleMultiImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        const urls = Array.from(files).map(f => URL.createObjectURL(f as Blob));
        setFormData({ ...formData, images: [...formData.images, ...urls].slice(0, 5) });
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput && formData.images.length < 5) {
        setFormData({ ...formData, images: [...formData.images, imageUrlInput] });
        setImageUrlInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 md:p-20 font-inter">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-12">
            <button onClick={() => navigate('/admin')} className="p-4 bg-white rounded-3xl shadow-sm border border-gray-100 text-gray-400 active:scale-95 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Edit Relief Operation</h1>
        </div>

        <div className="bg-white rounded-[60px] p-12 shadow-sm border border-gray-100 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Beneficiary Institution</label>
                    <select value={formData.ngoId} onChange={e => setFormData({...formData, ngoId: e.target.value})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black appearance-none">
                        {ngos.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Status & Priority</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black appearance-none">
                        <option value="active">Active Operation</option>
                        <option value="urgent">Urgent Intervention</option>
                        <option value="completed">Completed / Goal Reached</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Project Title (English)</label>
                <input type="text" value={formData.title.en} onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black text-xl" />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Operation Gallery (X/5)</label>
                <div className="grid grid-cols-5 gap-4">
                    {formData.images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border group">
                            <img src={img} className="w-full h-full object-cover" alt="" />
                            <button onClick={() => setFormData({...formData, images: formData.images.filter((_, idx)=>idx!==i)})} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3}/></svg></button>
                        </div>
                    ))}
                    {formData.images.length < 5 && (
                        <label className="aspect-square bg-white border-4 border-dashed border-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-50">
                            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleMultiImage} />
                        </label>
                    )}
                </div>
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Add Image by URL..." 
                        className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-xs" 
                        value={imageUrlInput}
                        onChange={e => setImageUrlInput(e.target.value)}
                    />
                    <button onClick={addImageUrl} className="bg-gray-900 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest">Add URL</button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Detailed Description (English)</label>
                <textarea value={formData.description.en} onChange={e => setFormData({...formData, description: {...formData.description, en: e.target.value}})} className="w-full p-8 bg-gray-50 rounded-[44px] h-64 outline-none font-black text-sm leading-relaxed" />
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Relief Target (ETB)</label>
                    <input type="number" value={formData.goalAmount} onChange={e => setFormData({...formData, goalAmount: Number(e.target.value)})} className="w-full p-6 bg-gray-50 rounded-[28px] outline-none font-black text-xl text-[#02A95C]" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Current Progress (ETB)</label>
                    <input type="number" value={formData.raisedAmount} onChange={e => setFormData({...formData, raisedAmount: Number(e.target.value)})} className="w-full p-6 bg-gray-100 rounded-[28px] outline-none font-black text-xl" />
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={handleSave} className="flex-1 py-6 bg-[#02A95C] text-white font-black rounded-[32px] uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">Publish Operation Update</button>
                <button onClick={() => navigate('/admin')} className="px-10 py-6 bg-gray-100 text-gray-400 font-black rounded-[32px] uppercase tracking-widest text-xs">Cancel</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
