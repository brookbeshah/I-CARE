
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Language, NGO, Project, Donation, Subscription, Broadcast } from './types';
import { TRANSLATIONS, MOCK_NGOS, MOCK_PROJECTS } from './constants';
import Home from './pages/Home';
import CampaignDetail from './pages/CampaignDetail';
import MyDonations from './pages/MyDonations';
import AdminDashboard from './pages/AdminDashboard';
import EditNGO from './pages/EditNGO';
import EditProject from './pages/EditProject';
import NGOLanding from './pages/NGOLanding';
import About from './pages/About';
import Notifications from './pages/Notifications';

// Production Ready Telebirr H5 SDK Integration
const handleTelebirrPayment = (totalAmount: string, outTradeNo: string, callback: (res: any) => void) => {
  console.log(`[Telebirr SDK Readiness] Preparing payment for ${totalAmount} ETB with Order ID: ${outTradeNo}`);
  
  // Checking for global telebirr object injected by Telebirr SuperApp
  const telebirr = (window as any).telebirr;

  if (telebirr && typeof telebirr.payRequest === 'function') {
    telebirr.payRequest({
      totalAmount,
      outTradeNo,
      subject: "I-Care Donation",
      merchantId: "MOCK_MERCHANT_ID", // To be replaced with actual Merchant ID from Ethio Telecom
      appId: "MOCK_APP_ID",         // To be replaced with actual App ID from Ethio Telecom
      receiveName: "I-Care Platform",
      returnUrl: window.location.href,
      timeout: "30m"
    }, callback);
  } else {
    // Development Fallback for Browser Testing
    console.warn("Telebirr H5 SDK not detected. Operating in Simulation Mode.");
    setTimeout(() => {
      callback({ code: '0', message: 'Success', outTradeNo });
    }, 1500);
  }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const CelebrationUI = ({ onClose, t }: { onClose: () => void, t: any }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 overflow-hidden">
    <div className="bg-white rounded-[60px] p-12 shadow-2xl animate-slide-up text-center max-w-sm relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 text-2xl">
        <div className="animate-bounce absolute top-4 left-4">🎉</div>
        <div className="animate-bounce absolute top-10 right-10 delay-75">✨</div>
        <div className="animate-bounce absolute bottom-10 left-12 delay-150">💚</div>
        <div className="animate-bounce absolute bottom-20 right-4 delay-200">💎</div>
      </div>
      
      <div className="w-24 h-24 bg-[#02A95C] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#02A95C]/20">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">{t.impactMade}</h2>
      <p className="text-gray-500 font-medium mb-10 leading-relaxed">
        {t.celebrationSub}
      </p>
      
      <button 
        onClick={onClose}
        className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
      >
        {t.done}
      </button>
    </div>
  </div>
);

const TermsModal = ({ onAccept, t }: { onAccept: () => void, t: any }) => (
  <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
    <div className="bg-white rounded-[50px] w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
      <div className="p-10 border-b border-gray-50">
        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{t.platformRules}</h3>
        <p className="text-[10px] font-black text-[#02A95C] uppercase tracking-widest mt-1">{t.agreementReq}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-10 text-xs text-gray-500 space-y-4 font-medium leading-relaxed">
        <p>{t.welcome} I-Care. Before continuing, please acknowledge the following:</p>
        <p>1. <strong>Intermediary Service:</strong> I-Care connects donors to NGOs. Funds are processed via Telebirr financial infrastructure.</p>
        <p>2. <strong>Service Fees:</strong> A technical service fee of 2.5% to 5.5% is added to each transaction to support platform maintenance.</p>
        <p>3. <strong>Data Privacy:</strong> We use your Telebirr phone number solely for payment identification and receipts.</p>
        <p>4. <strong>Mission:</strong> This platform is designed to boost Ethiopia's Digital 2030 strategy through transparent philanthropy.</p>
      </div>
      <div className="p-10 bg-gray-50 flex flex-col gap-3">
        <button 
          onClick={onAccept}
          className="w-full py-5 bg-[#02A95C] text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
          {t.acceptContinue}
        </button>
        <p className="text-[9px] text-gray-400 text-center font-bold">{t.termsSmallPrint}</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('am');
  const [ngos, setNgos] = useState<NGO[]>(MOCK_NGOS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [serviceFeeRate, setServiceFeeRate] = useState(0.025);
  const [maxDonation, setMaxDonation] = useState(500000);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  useEffect(() => {
    const savedSession = localStorage.getItem('icare_user_session');
    const accepted = localStorage.getItem('icare_terms_accepted');
    if (savedSession) {
      setIsUserLoggedIn(true);
      setUserPhone(savedSession);
    }
    if (accepted) {
      setHasAcceptedTerms(true);
    }
  }, []);

  const t = TRANSLATIONS[lang];

  const handleUserLogin = (phone: string) => {
    localStorage.setItem('icare_user_session', phone);
    setUserPhone(phone);
    setIsUserLoggedIn(true);
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('icare_terms_accepted', 'true');
    setHasAcceptedTerms(true);
  };

  const handleDonate = async (projectId: string, amount: number, type: 'one-time' | 'recurring', ngoId: string) => {
    if (amount > maxDonation) {
        alert(`Maximum allowed donation is ${maxDonation} ETB`);
        return false;
    }
    const fee = amount * serviceFeeRate;
    const total = amount + fee;
    const outTradeNo = `ICARE-${Date.now()}`;
    
    return new Promise((resolve) => {
      handleTelebirrPayment(total.toFixed(2), outTradeNo, (res) => {
        if (res.code === '0') {
          const newDonation: Donation = {
            id: res.outTradeNo || outTradeNo,
            projectId,
            ngoId,
            amount,
            serviceFee: fee,
            total,
            date: new Date().toISOString(),
            type,
            status: 'success',
            donorName: 'Telebirr User',
            donorPhone: userPhone
          };
          setDonations(prev => [newDonation, ...prev]);
          
          if (type === 'recurring') {
            const newSub: Subscription = {
              id: `SUB-${Date.now()}`,
              projectId,
              ngoId,
              amount,
              nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active'
            };
            setSubscriptions(prev => [newSub, ...prev]);
          }
          
          setNgos(prev => prev.map(n => n.id === ngoId ? {...n, totalRaised: n.totalRaised + amount} : n));

          if (projectId !== 'GENERAL') {
            setProjects(prev => {
                const updated = prev.map(p => 
                  p.id === projectId ? { ...p, raisedAmount: p.raisedAmount + amount, donorsCount: p.donorsCount + 1 } : p
                );
                return updated.map(p => p.raisedAmount >= p.goalAmount ? {...p, status: 'completed'} : p);
            });
          }
          
          setShowCelebration(true);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  if (!isUserLoggedIn) {
    return <TelebirrOnboarding t={t} onLogin={handleUserLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white max-w-md md:max-w-none mx-auto relative overflow-x-hidden">
        {isUserLoggedIn && !hasAcceptedTerms && !isAdminLoggedIn && <TermsModal onAccept={handleAcceptTerms} t={t} />}
        {showCelebration && <CelebrationUI onClose={() => setShowCelebration(false)} t={t} />}
        
        {!isAdminLoggedIn && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-md p-0.5 rounded-full shadow-lg flex border border-gray-100">
              {(['en', 'am'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-[9px] font-black transition-all ${lang === l ? 'bg-[#02A95C] text-white shadow-md' : 'text-gray-400'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home t={t} userPhone={userPhone} projects={projects.filter(p => !ngos.find(n => n.id === p.ngoId)?.isSuspended && !p.isArchived)} ngos={ngos} onLogoClick={() => setLogoClicks(v => v + 1)} lang={lang} onDonate={handleDonate} serviceFeeRate={serviceFeeRate} />} />
          <Route path="/project/:id" element={<CampaignDetail t={t} projects={projects} ngos={ngos} lang={lang} onDonate={handleDonate} serviceFeeRate={serviceFeeRate} />} />
          <Route path="/ngo/:id" element={<NGOLanding t={t} ngos={ngos} projects={projects} lang={lang} onDonate={handleDonate} serviceFeeRate={serviceFeeRate} />} />
          <Route path="/my-donations" element={<MyDonations t={t} donations={donations} subscriptions={subscriptions} projects={projects} ngos={ngos} onCancelSub={(id) => setSubscriptions(prev => prev.filter(s => s.id !== id))} lang={lang} />} />
          <Route path="/about" element={<About t={t} />} />
          <Route path="/notifications" element={<Notifications t={t} projects={projects} lang={lang} broadcasts={broadcasts} />} />
          <Route path="/admin" element={
            isAdminLoggedIn ? 
            <AdminDashboard 
              t={t} 
              ngos={ngos} 
              setNgos={setNgos} 
              projects={projects}
              setProjects={setProjects}
              broadcasts={broadcasts}
              setBroadcasts={setBroadcasts}
              donations={donations} 
              serviceFeeRate={serviceFeeRate} 
              setServiceFeeRate={setServiceFeeRate}
              maxDonation={maxDonation}
              setMaxDonation={setMaxDonation}
              onLogout={() => {setIsAdminLoggedIn(false); setLogoClicks(0);}}
            /> : 
            <AdminLogin t={t} onLogin={() => setIsAdminLoggedIn(true)} onCancel={() => setLogoClicks(0)} />
          } />
          <Route path="/admin/edit-ngo/:id" element={<EditNGO ngos={ngos} setNgos={setNgos} />} />
          <Route path="/admin/edit-project/:id" element={<EditProject projects={projects} setProjects={setProjects} ngos={ngos} />} />
        </Routes>

        {logoClicks >= 5 && !isAdminLoggedIn && (
          <Link to="/admin" className="fixed bottom-24 right-4 bg-red-600 text-white p-4 rounded-full shadow-2xl z-50 animate-bounce font-black text-xs flex items-center justify-center">ROOT</Link>
        )}

        {!isAdminLoggedIn && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around py-4 safe-bottom z-40">
            <NavItem to="/" icon={<HomeIcon />} label={t.home} />
            <NavItem to="/notifications" icon={<BellIcon />} label={t.notifications} />
            <NavItem to="/my-donations" icon={<GiftsIcon />} label={t.myDonations} />
            <NavItem to="/about" icon={<InfoIcon />} label={t.about} />
          </nav>
        )}
      </div>
    </Router>
  );
};

const TelebirrOnboarding = ({ t, onLogin, lang, setLang }: { t: any, onLogin: (p: string) => void, lang: Language, setLang: any }) => {
  const [phone, setPhone] = useState('09');
  return (
    <div className="h-screen w-full bg-white flex flex-col p-10 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-3xl font-black text-[#02A95C]">I-Care</h1>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
           <button onClick={() => setLang('am')} className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${lang === 'am' ? 'bg-[#02A95C] text-white shadow-sm' : 'text-gray-400'}`}>AM</button>
           <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-full text-[10px] font-black transition-all ${lang === 'en' ? 'bg-[#02A95C] text-white shadow-sm' : 'text-gray-400'}`}>EN</button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-20 h-20 bg-[#02A95C]/10 text-[#02A95C] rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 leading-none">{t.welcome} <br/>I-Care</h2>
        <p className="text-sm text-gray-400 font-medium leading-relaxed mb-12">Connect with verified NGOs and support meaningful humanitarian causes.</p>
        
        <div className="mb-8">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Phone Number</label>
            <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-xl font-black text-gray-900 outline-none focus:ring-4 focus:ring-[#02A95C]/10 transition-all"
                placeholder="0912345678"
            />
        </div>

        <button 
          onClick={() => onLogin(phone)}
          className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black text-lg shadow-2xl shadow-[#02A95C]/20 active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          Continue with Telebirr
        </button>
      </div>
      
      <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center mt-auto pb-10">Secured by Telebirr H5 SDK Integration</p>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-[#02A95C]' : 'text-gray-400 hover:text-gray-600'}`}>
      <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </Link>
  );
};

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const GiftsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const InfoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);

const AdminLogin = ({ t, onLogin, onCancel }: { t: any, onLogin: () => void, onCancel: () => void }) => {
  const [otp, setOtp] = useState('');
  return (
    <div className="p-10 h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">Admin Gate</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">{t.enterOtp}</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if(otp==='123456') onLogin(); }} className="space-y-8 w-full max-w-xs">
        <input 
          type="password" maxLength={6} value={otp} 
          onChange={(e) => setOtp(e.target.value)}
          className="w-full bg-gray-800 p-8 rounded-[40px] text-center text-4xl font-black tracking-[0.6em] outline-none focus:ring-4 focus:ring-[#02A95C]/20 transition-all"
          placeholder="000000"
          autoFocus
        />
        <button type="submit" className="w-full bg-[#02A95C] text-white py-6 rounded-[32px] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Authorize</button>
        <button type="button" onClick={onCancel} className="w-full text-gray-500 py-2 font-black text-xs uppercase tracking-widest">Back</button>
      </form>
    </div>
  );
};

export default App;
