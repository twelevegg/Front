import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

import AuthShell from './AuthShell.jsx';
import { ROUTES } from '../../app/routeConstants.js';
import { useAuth } from '../../features/auth/AuthProvider.jsx';



export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenant, setTenant] = useState('kt');

  const [showPw, setShowPw] = useState(false);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const from = useMemo(() => loc.state?.from, [loc.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPending(true);

    try {
      const user = await login({ tenantName: tenant, email, password });

      if (from) {
        nav(from, { replace: true });
      } else {
        nav(user.role === 'admin' ? ROUTES.DASH_ADMIN : ROUTES.DASH_ASSISTANT, { replace: true });
      }
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  const onQuickLogin = async ({ tenantName: nextTenant, email: nextEmail, password: nextPassword }) => {
    setError('');
    setPending(true);

    try {
      setTenant(nextTenant);
      setEmail(nextEmail);
      setPassword(nextPassword);

      const user = await login({ tenantName: nextTenant, email: nextEmail, password: nextPassword });
      nav(user.role === 'admin' ? ROUTES.DASH_ADMIN : ROUTES.DASH_ASSISTANT, { replace: true });
    } catch (err) {
      setError(err.message || '빠른 로그인에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome Back"
      subtitle="상담사님의 하루를 진심으로 응원합니다."
      ctaTitle="함께 성장해요!"
      ctaSubtitle="함께하는 동료들이 있어 든든합니다. 아직 계정이 없으신가요?"
      ctaButtonLabel="회원가입 하기"
      ctaTo={ROUTES.SIGNUP}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <IconInput error={!!error}>
            <Mail size={18} className={error ? "text-rose-400" : "text-slate-400"} />
            <input
              className={`flex-1 bg-transparent outline-none text-sm font-semibold ${error ? 'placeholder:text-rose-300 text-rose-700' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />
          </IconInput>
        </Field>

        <Field label="Organization">
          <div className="grid grid-cols-3 gap-3 mb-1">
            <TenantButton
              active={tenant === 'kt'}
              onClick={() => setTenant('kt')}
              src="/logos/kt.png"
              alt="KT"
              color="ring-[#ED1C24] bg-[#ED1C24]/5 hover:bg-[#ED1C24]/10"
            />
            <TenantButton
              active={tenant === 'skt'}
              onClick={() => setTenant('skt')}
              src="/logos/skt.png"
              alt="SKT"
              color="ring-[#3617CE] bg-[#3617CE]/5 hover:bg-[#3617CE]/10"
            />
            <TenantButton
              active={tenant === 'lgu'}
              onClick={() => setTenant('lgu')}
              src="/logos/lgu.png"
              alt="LG U+"
              color="ring-[#D0006F] bg-[#D0006F]/5 hover:bg-[#D0006F]/10"
              imgClass="h-[75%] w-auto object-contain mix-blend-multiply"
            />
          </div>
        </Field>

        <Field label="Password">
          <IconInput error={!!error}>
            <Lock size={18} className={error ? "text-rose-400" : "text-slate-400"} />
            <input
              type={showPw ? 'text' : 'password'}
              className={`flex-1 bg-transparent outline-none text-sm font-semibold pr-8 ${error ? 'placeholder:text-rose-300 text-rose-700' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
            </div>
          </IconInput>
        </Field>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          disabled={pending}
          className="w-full rounded-full bg-indigo-600 text-white py-3 font-extrabold disabled:opacity-60 hover:bg-indigo-700 transition btn-press"
        >
          {pending ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => onQuickLogin({ tenantName: 'kt', email: 'admin@test.com', password: 'password' })}
            className="w-full rounded-full border border-rose-200 bg-rose-100/80 py-3 font-extrabold text-rose-700 hover:bg-rose-100 transition btn-press disabled:opacity-60"
          >
            심사위원 로그인용 (관리자)
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => onQuickLogin({ tenantName: 'kt', email: 'user@test.com', password: 'password' })}
            className="w-full rounded-full border border-sky-200 bg-sky-100/80 py-3 font-extrabold text-sky-700 hover:bg-sky-100 transition btn-press disabled:opacity-60"
          >
            심사위원 로그인용 (상담사)
          </button>
        </div>

        <div className="text-center text-sm text-slate-600">
          계정이 없나요?{' '}
          <Link className="font-extrabold text-indigo-600" to={ROUTES.SIGNUP}>
            회원가입
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
          <Link to={ROUTES.TERMS} className="hover:text-slate-900 transition-colors">
            이용약관
          </Link>
          <Link to={ROUTES.PRIVACY} className="hover:text-slate-900 transition-colors">
            개인정보처리방침
          </Link>
          <button type="button" className="hover:text-slate-900 transition-colors">
            문의하기
          </button>
        </div>

      </form>
    </AuthShell>
  );
}



function Field({ label, children }) {
  return (
    <div className="block">
      <div className="text-xs font-extrabold text-slate-600 mb-2">{label}</div>
      {children}
    </div>
  );
}

function IconInput({ children, error }) {
  return (
    <div className={`relative flex items-center gap-3 rounded-full px-4 py-3 border transition-colors ${error ? 'bg-rose-50 border-rose-200 ring-1 ring-rose-100' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-300 focus-within:bg-white'
      }`}>
      {children}
    </div>
  );
}

function PwToggleButton({ show, onToggle }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onToggle}
      className="
        relative z-10
        h-9 w-9
        grid place-items-center
        rounded-full
        hover:bg-slate-100
        active:bg-slate-200
      "
      title={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <EyeOff size={18} className="text-slate-400" />
      ) : (
        <Eye size={18} className="text-slate-400" />
      )}
    </button>
  );
}

function TenantButton({ active, onClick, src, alt, color, imgClass = "h-[60%] w-auto object-contain" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-14 rounded-2xl flex items-center justify-center border transition-all overflow-hidden relative w-full
        ${active
          ? `ring-4 ring-offset-2 ${color} border-transparent`
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
      `}
    >
      <img src={src} alt={alt} className={`${imgClass} mix-blend-multiply`} />
    </button>
  );
}
