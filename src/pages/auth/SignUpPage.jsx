import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield, Headset } from 'lucide-react';

import AuthShell from './AuthShell.jsx';
import { ROUTES } from '../../app/routeConstants.js';
import { signupApi } from '../../features/auth/api.js';
import PrivacyPolicyModal from '../../components/legal/PrivacyPolicyModal.jsx';

export default function SignUpPage() {
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPw, setShowPw] = useState(false);

  // ✅ 개인정보 동의 + 모달
  const [privacyAgree, setPrivacyAgree] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  // ✅ role 선택 (admin / assistant)
  const [role, setRole] = useState('assistant');

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  // ✅ 비밀번호 규칙 안내(UX): 사용자가 비밀번호 필드를 건드렸는지
  const [pwTouched, setPwTouched] = useState(false);

  // ✅ 비밀번호 규칙 정의
  const pwRuleText = '영문, 숫자, 특수문자를 모두 1회 이상 포함하여 10-16자리로 구성해야 합니다.';

  const pwRule = useMemo(() => {
    const lenOk = password.length >= 10 && password.length <= 16;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    return {
      lenOk,
      hasLetter,
      hasNumber,
      hasSpecial,
      ok: lenOk && hasLetter && hasNumber && hasSpecial,
    };
  }, [password]);

  // ✅ 규칙 불만족 시 보여줄 에러 메시지
  const pwError = useMemo(() => {
    if (!pwTouched) return '';
    if (!password) return '';
    if (pwRule.ok) return '';
    return pwRuleText;
  }, [pwTouched, password, pwRule.ok]);

  // ✅ 비밀번호 확인 불일치 에러(입력했을 때만)
  const pw2Error = useMemo(() => {
    if (!pwTouched) return '';
    if (!password2) return '';
    if (password === password2) return '';
    return '비밀번호 확인이 일치하지 않습니다.';
  }, [pwTouched, password, password2]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPwTouched(true);

    if (!privacyAgree) {
      setError('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    if (!pwRule.ok) {
      setError(pwRuleText);
      return;
    }

    if (password !== password2) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setPending(true);

    try {
      await signupApi({ name, email, password, role });

      /**
       * ✅ TODO (백엔드 연동 시)
       * - role=admin은 프론트 선택만으로 허용하면 위험합니다.
       *   서버에서 초대코드/승인/도메인 제한 등으로 반드시 통제하세요.
       */
      nav(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      setError(err?.message || '회원가입에 실패했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      mode="signup"
      title="Sign Up"
      subtitle="계정을 생성해 CS-Navigator 콘솔을 사용하세요."
      ctaTitle="Welcome Back!"
      ctaSubtitle="이미 계정이 있다면 로그인해서 바로 시작하세요."
      ctaButtonLabel="Sign In"
      ctaTo={ROUTES.LOGIN}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name">
          <IconInput>
            <User size={18} className="text-slate-400" />
            <input
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              autoComplete="name"
              required
            />
          </IconInput>
        </Field>

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

        {/* ✅ role 선택 UI */}
        <Field label="Role">
          <div className="grid grid-cols-2 gap-3">
            <RoleChip
              active={role === 'assistant'}
              onClick={() => setRole('assistant')}
              icon={<Headset size={18} />}
              title="Assistant"
              desc="상담사"
            />
            <RoleChip
              active={role === 'admin'}
              onClick={() => setRole('admin')}
              icon={<Shield size={18} />}
              title="Admin"
              desc="관리자"
            />
          </div>

          <div className="mt-2 text-[11px] text-slate-400">
            TODO: 운영환경에서는 관리자(admin) 가입은 서버 정책(초대코드/승인/도메인 제한)으로 통제하세요.
          </div>
        </Field>

        <Field label="Password">
          <IconInput>
            <Lock size={18} className="text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!pwTouched) setPwTouched(true);
              }}
              onBlur={() => setPwTouched(true)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
          </IconInput>

          {/* ✅ 규칙 안내(항상 표시) */}
          <div className="mt-2 text-[11px] text-slate-400">{pwRuleText}</div>

          {/* ✅ 규칙 불만족 시 빨간 안내 */}
          {pwError && (
            <div className="mt-2 text-xs font-semibold text-red-600">
              {pwError}
            </div>
          )}

          {/* ✅ 체크리스트(원하면 유지, 싫으면 이 블록 삭제 가능) */}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            <RulePill ok={pwRule.lenOk} label="10~16자" />
            <RulePill ok={pwRule.hasLetter} label="영문 포함" />
            <RulePill ok={pwRule.hasNumber} label="숫자 포함" />
            <RulePill ok={pwRule.hasSpecial} label="특수문자 포함" />
          </div>
        </Field>

        <Field label="Confirm Password">
          <IconInput>
            <Lock size={18} className="text-slate-400" />
            <input
              type={showPw ? 'text' : 'password'}
              className="flex-1 bg-transparent outline-none text-sm font-semibold"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
                if (!pwTouched) setPwTouched(true);
              }}
              onBlur={() => setPwTouched(true)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
          </IconInput>

          {pw2Error && (
            <div className="mt-2 text-xs font-semibold text-red-600">
              {pw2Error}
            </div>
          )}
        </Field>

        {/* ✅ 개인정보 수집 이용 동의 체크 */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              checked={privacyAgree}
              onChange={(e) => setPrivacyAgree(e.target.checked)}
            />
            <span className="text-sm text-slate-700">
              <span className="font-extrabold">개인정보 수집 및 이용 동의</span>{' '}
              <span className="text-red-600">(필수)</span>
              <button
                type="button"
                onClick={() => setPolicyOpen(true)}
                className="ml-2 text-xs font-extrabold text-blue-600 hover:text-blue-700"
              >
                내용 보기
              </button>
            </span>
          </label>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          disabled={pending}
          className="w-full rounded-full bg-blue-600 text-white py-3 font-extrabold disabled:opacity-60 hover:bg-blue-700 transition"
        >
          {pending ? 'Creating...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-extrabold text-blue-600" to={ROUTES.LOGIN}>
            Sign in
          </Link>
        </div>
      </form>

      <PrivacyPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </AuthShell>
  );
}

/** ✅ label wrapper 제거(클릭 씹힘/포커스 간섭 방지) */
function Field({ label, children }) {
  return (
    <div className="block">
      <div className="text-xs font-extrabold text-slate-600 mb-2">{label}</div>
      {children}
    </div>
  );
}

/** ✅ relative 추가해서 내부 버튼 z-index가 안정적으로 먹게 */
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

function RoleChip({ active, onClick, icon, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition ${
        active ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-2xl grid place-items-center border ${
            active ? 'border-blue-200 bg-white' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="font-extrabold">{title}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
      </div>
    </button>
  );
}

function RulePill({ ok, label }) {
  return (
    <span
      className={`px-2 py-1 rounded-full border ${
        ok ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}
    >
      {label}
    </span>
  );
}
