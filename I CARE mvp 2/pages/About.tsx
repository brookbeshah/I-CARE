
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC<{ t: any }> = ({ t }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-inter pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-50 px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 rounded-2xl text-gray-900 border border-gray-100 shadow-sm active:scale-95 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">{t.about}</h1>
      </div>

      {/* Hero Section */}
      <div className="px-8 pt-12 pb-20 bg-gradient-to-b from-[#02A95C]/5 to-transparent text-center">
        <div className="w-24 h-24 bg-[#02A95C] text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#02A95C]/20">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight mb-6">Empowering Ethiopia Through Digital Giving</h2>
        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md mx-auto">I-Care is more than an application; it's a national movement to digitize compassion and accelerate humanitarian impact.</p>
      </div>

      <div className="px-8 space-y-24">
        {/* Our Vision Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] font-black text-[#02A95C] uppercase tracking-[0.4em]">Our Vision</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-base text-justify">
            <p>
              In the heart of Ethiopia's digital transformation lies a profound opportunity: to connect the inherent generosity of our people with the urgent needs of our communities through technology. <strong>I-Care</strong> was born from a singular vision to eliminate the barriers of physical distance, administrative overhead, and financial opacity in the philanthropic sector.
            </p>
            <p>
              We envision an Ethiopia where every citizen, regardless of their location, can contribute to national relief efforts with a single tap on their mobile device. By leveraging the ubiquity of the Telebirr SuperApp, we are creating a permanent digital bridge that serves as the backbone for humanitarian logistics and funding in the 21st century.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="bg-gray-50 -mx-8 px-8 py-20">
          <h3 className="text-2xl font-black text-gray-900 mb-12 tracking-tight text-center">The Three Pillars of I-Care</h3>
          <div className="grid gap-12">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-2">Uncompromising Trust</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Every NGO on our platform undergoes a rigorous multi-stage verification process. We ensure that your contributions go to institutions with proven track records and valid legal mandates.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-2">Fintech Agility</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Integrated directly with the Telebirr H5 SDK, I-Care provides a seamless checkout experience. No manual transfers, no account numbers to remember—just instant, secure impact.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-2">Radical Transparency</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Through real-time progress bars and automated receipts, donors can see exactly how their funds are contributing to the project goal. We turn every donation into a data-backed success story.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Goals & Ethiopia 2030 */}
        <section>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">Strategic Alignment</h3>
          <div className="bg-gray-900 rounded-[50px] p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#02A95C] opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <h4 className="text-2xl font-black mb-8 leading-tight">Supporting Digital Ethiopia 2030</h4>
            <div className="space-y-6 text-gray-400 text-sm font-medium leading-relaxed">
              <p>
                The I-Care platform is architected to align with the national <strong>Digital 2030 Strategy</strong>. By moving the philanthropic sector from a cash-based or informal system to a structured digital environment, we are:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-5 h-5 bg-[#02A95C] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Fostering digital financial literacy among donors.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 bg-[#02A95C] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Improving the digital bookkeeping capabilities of local NGOs.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 bg-[#02A95C] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span>Reducing the "Humanitarian Finance Gap" using mobile technology.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Insights & Social Impact */}
        <section>
          <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">The Power of Micro-Donations</h3>
          <div className="prose prose-sm text-gray-600 font-medium leading-relaxed space-y-6">
            <p>
              History has shown that the most sustainable impact doesn't always come from a few large donors, but from the collective effort of millions. In Ethiopia, with over 35 million Telebirr users, if only 10% of users donated just 10 ETB a month, the humanitarian sector would see an influx of <strong>35 Million ETB monthly</strong>.
            </p>
            <p>
              I-Care optimizes for this "Long Tail of Generosity." Our <strong>Monthly Recurring</strong> feature is designed to automate this impact, allowing users to pledge small, manageable amounts that cumulatively solve massive challenges like rural water access, school library equipment, and emergency medical supplies.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
             <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                <p className="text-3xl font-black text-blue-600 mb-1">0%</p>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-snug">Deduction from NGO base funds</p>
             </div>
             <div className="p-6 bg-orange-50 rounded-[32px] border border-orange-100">
                <p className="text-3xl font-black text-orange-600 mb-1">24/7</p>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-snug">Real-time impact tracking</p>
             </div>
          </div>
        </section>

        {/* Legal & Terms Section (Deep Dive) */}
        <section className="pt-24 border-t border-gray-100">
          <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter">Full Terms & Conditions</h3>
          <div className="space-y-12 text-gray-500 text-sm font-medium leading-relaxed">
            
            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">1. Technical Operability</h4>
              <p>
                I-Care is a digital H5 mini-application developed and technical-managed by ProCloud Solution. It operates as a neutral technology layer between Telebirr users and registered humanitarian organizations. I-Care does not hold, store, or manage any charitable funds. All financial settlement occurs directly between the user's wallet and the NGO's merchant account via the Telebirr settlement engine.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">2. The 100% Policy & Service Fees</h4>
              <p>
                We maintain a "No Deduction from Principal" policy. This means if a user pledges 500 ETB, the beneficiary NGO receives exactly 500 ETB. To maintain the server infrastructure, pay for end-to-end encryption, and conduct institutional audits, I-Care adds a transparent <strong>Service Fee</strong> ranging from 2.5% to 5.5% on top of the donation. This fee is calculated and displayed clearly before any transaction is authorized.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">3. Subscription Obligations</h4>
              <p>
                By selecting the "Monthly Recurring" option, the user authorizes the application to send a payment prompt or trigger an automated deduction (where supported by the Telebirr SDK) every 30 days. Users retain the absolute right to cancel, pause, or modify these subscriptions at any time through the "My Gifts" management interface.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">4. Data Integrity & Privacy</h4>
              <p>
                I-Care respects the privacy of its users. We only collect the necessary data required by the Telebirr H5 standard for payment processing. We do not sell user data to third parties. Donation history is kept exclusively for the user's records and for institutional reporting to the respective NGO beneficiaries for accountability purposes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">5. Liability Disclaimer</h4>
              <p>
                While I-Care conducts rigorous vetting of all institutions on the platform, the final responsibility for the execution of humanitarian projects lies solely with the beneficiary NGO. ProCloud Solution is not liable for operational failures, project delays, or misuse of funds by the independent third-party institutions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest">6. Jurisdiction</h4>
              <p>
                These terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Users agree to participate in good faith and comply with all national financial regulations concerning electronic payments and charitable giving.
              </p>
            </div>

            <div className="pt-20 text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4">Version 2.0.4 • Released 2024</p>
              <div className="flex justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-100"></div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Discreet Brand Footer */}
      <footer className="mt-24 px-8 pb-12 border-t border-gray-50 pt-12 opacity-40">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest">© 2024 I-Care Ethiopia</p>
          <p className="text-[9px] font-black text-[#02A95C] uppercase tracking-widest">ProCloud Solution</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
