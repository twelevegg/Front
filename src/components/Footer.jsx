import { useState } from 'react';
import PrivacyPolicyModal from './legal/PrivacyPolicyModal.jsx'; 

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="h-11 border-t border-slate-100 bg-white/80 backdrop-blur flex items-center justify-between px-6 text-xs text-slate-400">
        <div>© {new Date().getFullYear()} Aivle 12조</div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-bold text-slate-500 hover:text-slate-800 hover:underline"
        >
          개인정보처리방침
        </button>
      </footer>

      <PrivacyPolicyModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
