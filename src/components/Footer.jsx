import { useState } from 'react';
import { Github } from 'lucide-react';
import PrivacyPolicyModal from './legal/PrivacyPolicyModal.jsx';
import TermsOfServiceModal from './legal/TermsOfServiceModal.jsx';
import ContactModal from './ContactModal.jsx';
import logoCustom from '../assets/logo_custom.jpg';

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-slate-100 bg-white/80 backdrop-blur px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Brand & Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {/* Custom Logo Container - Cropping Text */}
              <div className="w-8 h-8 rounded-md overflow-hidden relative border border-slate-200 shadow-sm shrink-0 flex items-center justify-center bg-white">
                <img
                  src={logoCustom}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-extrabold text-slate-700 tracking-tight">Aivle 12</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-y-1 gap-x-4 text-[11px] text-slate-400 font-medium">
              <span>서울특별시 강남구 개포로 310 (개포동)</span>
              <span className="hidden md:inline w-[1px] h-2.5 bg-slate-300"></span>
              <span>Tel. 010-5609-3387</span>
              <span className="hidden md:inline w-[1px] h-2.5 bg-slate-300"></span>
              <span>Email. daegyuchang@gmail.com</span>
            </div>
          </div>

          {/* Links & Copyright */}
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                개인정보처리방침
              </button>
              <button
                type="button"
                onClick={() => setTermsOpen(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                이용약관
              </button>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                문의하기
              </button>
              <a href="https://github.com/twelevegg" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-800 transition-colors">
                <Github size={14} />
              </a>
            </div>
            <div className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Aivle School Team 12. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsOfServiceModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
