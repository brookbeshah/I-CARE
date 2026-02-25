
import React, { useState, useMemo } from 'react';
import { Project, NGO, Language } from '../types';
import { Link } from 'react-router-dom';
import DonationModal from '../components/DonationModal';
import { PLACEHOLDER_IMAGE } from '../constants';

interface HomeProps {
  t: any;
  userPhone: string;
  projects: Project[];
  ngos: NGO[];
  onLogoClick: () => void;
  lang: Language;
  onDonate: (id: string, amount: number, type: 'one-time' | 'recurring', ngoId: string) => Promise<any>;
  serviceFeeRate: number;
}

const Home: React.FC<HomeProps> = ({ t, userPhone, projects, ngos, onLogoClick, lang, onDonate, serviceFeeRate }) => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Emergency', 'Health', 'Education', 'Water'];

  const featuredProjects = useMemo(() => projects.filter(p => p.isFeatured && p.status !== 'completed'), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = (p.title[lang] || p.title.en).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const isVisible = p.status !== 'completed';
      return matchesSearch && matchesCategory && isVisible;
    });
  }, [projects, searchQuery, activeCategory, lang]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div className="px-5 pt-6 pb-24 bg-white min-h-screen">
      <header className="flex flex-col mb-8">
        <div className="flex justify-between items-center mb-6">
          <div onClick={onLogoClick} className="cursor-pointer select-none active:scale-95 transition-transform">
            <h1 className="text-2xl font-black text-[#02A95C] flex items-center gap-1.5">
              <span className="p-2 bg-[#02A95C] text-white rounded-xl leading-none shadow-lg">I</span> Care
            </h1>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="mb-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{t.welcome}</p>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Telebirr: {userPhone}</h2>
        </div>

        <button 
          onClick={() => setShowDonateModal(true)}
          className="w-full bg-[#02A95C] text-white py-4 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all"
        >
          {t.donate}
        </button>
      </header>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
        <section className="mb-10">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-1">{t.featuredOperations}</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
            {featuredProjects.map(project => (
              <Link 
                key={project.id} 
                to={`/project/${project.id}`}
                className="shrink-0 w-72 h-44 relative rounded-[32px] overflow-hidden shadow-lg active:scale-[0.97] transition-transform"
              >
                <img 
                  src={project.images[0] || PLACEHOLDER_IMAGE} 
                  onError={handleImageError}
                  className="w-full h-full object-cover" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[8px] font-black text-[#02A95C] uppercase tracking-widest mb-1">{t.topPriority}</p>
                  <h4 className="text-white font-black text-sm tracking-tight line-clamp-1">{project.title[lang] || project.title.en}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">{t.browseNgos}</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {ngos.filter(n => !n.isSuspended).map(ngo => (
            <Link key={ngo.id} to={`/ngo/${ngo.id}`} className="shrink-0 flex flex-col items-center gap-2 group active:scale-90 transition-transform">
              <div className="w-16 h-16 rounded-3xl p-1 bg-white border border-gray-100 shadow-sm group-hover:border-[#02A95C] transition-all">
                <img 
                  src={ngo.logo || PLACEHOLDER_IMAGE} 
                  onError={handleImageError}
                  loading="lazy" 
                  className="w-full h-full object-cover rounded-2xl" 
                  alt={ngo.name} 
                />
              </div>
              <span className="text-[9px] font-black text-gray-500 group-hover:text-[#02A95C] uppercase truncate w-16 text-center">{ngo.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="relative mb-8">
        <input 
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-[28px] py-5 px-14 text-sm text-gray-900 shadow-sm focus:ring-4 focus:ring-[#02A95C]/10 outline-none transition-all placeholder-gray-400 font-semibold"
        />
        <svg className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5 mb-8 pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border active:scale-95 ${activeCategory === cat ? 'bg-gray-900 border-gray-900 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-[#02A95C] hover:text-[#02A95C]'}`}
          >
            {cat === 'All' ? t.allProjects : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-[36px] overflow-hidden shadow-sm border border-gray-50 flex flex-col group active:scale-[0.97] transition-all">
            <Link to={`/project/${project.id}`} className="relative h-44 w-full overflow-hidden block">
              <img 
                src={project.images[0] || PLACEHOLDER_IMAGE} 
                onError={handleImageError}
                loading="lazy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt={project.title[lang]} 
              />
              {project.status === 'urgent' && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-widest">{t.topPriority}</div>
              )}
            </Link>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="font-bold text-gray-900 text-[11px] mb-2 line-clamp-2 h-8 leading-snug">{project.title[lang] || project.title.en}</h4>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-[#02A95C] font-black">{Math.round((project.raisedAmount / project.goalAmount) * 100)}%</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{t.target}</span>
                </div>
                <Link 
                  to={`/project/${project.id}`}
                  className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-[#02A95C] hover:text-white hover:border-[#02A95C] transition-all block text-center shadow-sm"
                >
                    {t.details}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDonateModal && (
        <DonationModal 
          t={t}
          ngos={ngos}
          onClose={() => setShowDonateModal(false)}
          onConfirm={async (amount, type, ngoId) => {
            const success = await onDonate('GENERAL', amount, type, ngoId);
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

export default Home;
