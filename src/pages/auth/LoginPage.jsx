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

  const [showPw, setShowPw] = useState(false);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const from = useMemo(() => loc.state?.from, [loc.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPending(true);

    try {
      const user = await login({ email, password });

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

  return (
    <AuthShell
      mode="login"
      title="Sign In"
      subtitle="계정으로 로그인해서 콘솔을 이용하세요."
      ctaTitle="Hello, Friend!"
      ctaSubtitle="처음이신가요? 회원가입 후 바로 시작할 수 있어요."
      ctaButtonLabel="Sign Up"
      ctaTo={ROUTES.SIGNUP}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email">
          <IconInput>
            <Mail size={18} className="text-slate-400" />
            <input
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />
          </IconInput>
        </Field>

        <Field label="Password">
          <IconInput>
            <Lock size={18} className="text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
          </IconInput>
        </Field>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          disabled={pending}
          className="w-full rounded-full bg-blue-600 text-white py-3 font-extrabold disabled:opacity-60 hover:bg-blue-700 transition"
        >
          {pending ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center text-sm text-slate-600">
          계정이 없나요?{' '}
          <Link className="font-extrabold text-blue-600" to={ROUTES.SIGNUP}>
            회원가입
          </Link>
        </div>

        <div className="text-xs text-slate-400 text-center">
          (데모) 이메일에 <span className="font-semibold">admin</span> 포함 시 admin 로그인으로 처리됩니다.
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

function IconInput({ children }) {
  return (
    <div className="relative flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-4 py-3">
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
