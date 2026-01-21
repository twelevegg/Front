import { Link } from 'react-router-dom';
import { ROUTES } from '../app/routeConstants.js';
import PrivacyPolicyContent from '../components/legal/PrivacyPolicyContent.jsx';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link to={ROUTES.LOGIN} className="text-sm font-extrabold text-slate-700 hover:text-slate-900">
            ← 로그인으로 돌아가기
          </Link>
          <div className="text-xs text-slate-500">CS Assistant</div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-8">
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  );
}
