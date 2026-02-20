import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield, Headset, Check } from 'lucide-react';

import AuthShell from './AuthShell.jsx';
import { ROUTES } from '../../app/routeConstants.js';
import { signupApi } from '../../features/auth/api.js';
import PrivacyPolicyModal from '../../components/legal/PrivacyPolicyModal.jsx';
import TermsOfServiceModal from '../../components/legal/TermsOfServiceModal.jsx';
import MarketingConsentModal from '../../components/legal/MarketingConsentModal.jsx';

export default function SignUpPage() {
  const nav = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPw, setShowPw] = useState(false);

  // ✅ 개인정보 모달
  const [policyOpen, setPolicyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);

  // ✅ role 선택 (admin / assistant)
  const [role, setRole] = useState('assistant');

  // ✅ Tenant 선택 (kt, skt, lgu)
  const [tenant, setTenant] = useState('lgu');

  // ... existing code ...
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(''); // Global error (e.g. server error)
  const [errors, setErrors] = useState({}); // Field-level errors

  // ✅ Legal Consents
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);

  // ✅ Password Strength (0-4)
  const getPasswordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    }

    if (password !== password2) {
      newErrors.confirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!agreedTerms) {
      newErrors.terms = '서비스 이용약관에 동의해야 합니다.';
    }

    if (!agreedPrivacy) {
      newErrors.privacy = '개인정보 수집 및 이용에 동의해야 합니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPending(true);

    try {
      // ✅ 토큰 없이 PUBLIC 회원가입 요청
      await signupApi({
        memberName: name,
        email,
        password,
        tenantName: tenant,
        role
      });

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
      title="Create Account"
      subtitle="CS-Navigator와 함께 상담의 가치를 높여보세요."
      ctaTitle="오늘도 수고 많으셨어요!"
      ctaSubtitle="당신의 따뜻한 목소리와 공감이 고객의 하루를 특별하게 만듭니다. 우리는 당신을 언제나 응원합니다."
      ctaButtonLabel="로그인하러 가기"
      ctaTo={ROUTES.LOGIN}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name" error={errors.name}>
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

        <Field label="Email" error={errors.email}>
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

        {/* ✅ Tenant 선택 UI */}
        <Field label="Organization">
          <div className="grid grid-cols-3 gap-3 mb-1">
            <TenantButton
              active={tenant === 'kt'}
              onClick={() => setTenant('kt')}
              src="/logos/kt.png"
              alt="KT"
              color="ring-[#ED1C24] bg-[#ED1C24]/5 hover:bg-[#ED1C24]/10"
              disabled
              badgeLabel="준비중"
            />
            <TenantButton
              active={tenant === 'skt'}
              onClick={() => setTenant('skt')}
              src="/logos/skt.png"
              alt="SKT"
              color="ring-[#3617CE] bg-[#3617CE]/5 hover:bg-[#3617CE]/10"
              disabled
              badgeLabel="준비중"
            />
            <TenantButton
              active={tenant === 'lgu'}
              onClick={() => setTenant('lgu')}
              src="/logos/lgu.png"
              alt="LG U+"
              color="ring-[#EB008B] bg-[#EB008B]/5 hover:bg-[#EB008B]/10"
              imgClass="h-[75%] w-auto object-contain mix-blend-multiply"
            />
          </div>
        </Field>

        {/* ✅ role 선택 UI */}
        <Field label="Role">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            <RoleTab
              active={role === 'assistant'}
              onClick={() => setRole('assistant')}
              icon={<Headset size={16} />}
              label="Assistant (상담사)"
            />
            <RoleTab
              active={role === 'admin'}
              onClick={() => setRole('admin')}
              icon={<Shield size={16} />}
              label="Admin (관리자)"
            />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 text-center">
            {/* 운영환경 체크: 관리자 가입은 서버 정책으로 제한하세요. */}
          </div>
        </Field>

        {/* Password Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" error={errors.password}>
            <IconInput>
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPw ? 'text' : 'password'}
                className="flex-1 bg-transparent outline-none text-sm font-semibold pr-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
              </div>
            </IconInput>
          </Field>

          <Field label="Confirm" error={errors.confirm}>
            <IconInput>
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPw ? 'text' : 'password'}
                className="flex-1 bg-transparent outline-none text-sm font-semibold pr-8"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <PwToggleButton show={showPw} onToggle={() => setShowPw((v) => !v)} />
              </div>
            </IconInput>
          </Field>
        </div>

        {/* Password Requirements Checklist */}
        {password && (
          <div className="grid grid-cols-2 gap-2 mt-2 px-1">
            <PasswordRequirement label="최소 8자 이상" met={password.length >= 8} />
            <PasswordRequirement label="대문자 포함" met={/[A-Z]/.test(password)} />
            <PasswordRequirement label="숫자 포함" met={/[0-9]/.test(password)} />
            <PasswordRequirement label="특수문자 포함" met={/[^A-Za-z0-9]/.test(password)} />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium flex gap-2 items-center animated-shake">
            <span role="img" aria-label="alert">⚠️</span> {error}
          </div>
        )}

        {/* ✅ Legal Consents */}
        <div className="space-y-2 pt-2">
          {/* 전체 동의 */}
          <Checkbox
            id="all"
            label="약관 전체 동의"
            checked={agreedTerms && agreedPrivacy && agreedMarketing}
            onChange={(val) => {
              setAgreedTerms(val);
              setAgreedPrivacy(val);
              setAgreedMarketing(val);
            }}
            customLabelClass="text-sm font-extrabold text-slate-800"
          />
          <div className="h-px bg-slate-100 my-2" />

          <div className="flex items-center justify-between">
            <Checkbox
              id="terms"
              label="[필수] 서비스 이용약관 동의"
              checked={agreedTerms}
              onChange={setAgreedTerms}
              customLabelClass={`text-xs ${errors.terms ? 'text-red-500 font-bold' : 'text-slate-500'}`}
            />
            <button
              type="button"
              onClick={() => setTermsOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline px-2 py-1 relative z-10"
            >
              내용보기
            </button>
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              id="privacy"
              label="[필수] 개인정보 수집 및 이용 동의"
              checked={agreedPrivacy}
              onChange={setAgreedPrivacy}
              customLabelClass={`text-xs ${errors.privacy ? 'text-red-500 font-bold' : 'text-slate-500'}`}
            />
            <button
              type="button"
              onClick={() => setPolicyOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline px-2 py-1 relative z-10"
            >
              내용보기
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              id="marketing"
              label="[선택] 마케팅 정보 수신 동의"
              checked={agreedMarketing}
              onChange={setAgreedMarketing}
              customLabelClass="text-xs text-slate-500"
            />
            <button
              type="button"
              onClick={() => setMarketingOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline px-2 py-1 relative z-10"
            >
              내용보기
            </button>
          </div>
        </div>

        <button
          disabled={pending}
          className="w-full rounded-full bg-blue-600 text-white py-3 font-extrabold disabled:opacity-60 hover:bg-blue-700 transition"
        >
          {pending ? 'Creating...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-slate-600">
          이미 계정이 있으신가요?{' '}
          <Link className="font-extrabold text-blue-600" to={ROUTES.LOGIN}>
            로그인
          </Link>
        </div>
      </form>

      <PrivacyPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
      <TermsOfServiceModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <MarketingConsentModal open={marketingOpen} onClose={() => setMarketingOpen(false)} />
    </AuthShell>
  );
}

/** ✅ label wrapper 제거(클릭 씹힘/포커스 간섭 방지) */
function Field({ label, error, children }) {
  return (
    <div className="block">
      <div className="text-xs font-extrabold text-slate-600 mb-2">{label}</div>
      {children}
      {error && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{error}</p>}
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

function RoleTab({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${active
        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
        : 'text-slate-400 hover:text-slate-600'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Checkbox({ id, label, checked, onChange, customLabelClass }) {
  return (
    <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group select-none">
      <div
        className={`
          w-5 h-5 rounded-md flex items-center justify-center border transition
          ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}
        `}
      >
        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
      <input
        id={id}
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`${customLabelClass || (checked ? 'text-slate-700 font-semibold text-sm' : 'text-slate-500 text-sm')}`}>
        {label}
      </span>
    </label>
  );
}

function TenantButton({ active, onClick, src, alt, color, imgClass = "h-[60%] w-auto object-contain", disabled = false, badgeLabel = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        h-14 rounded-2xl flex items-center justify-center border transition-all overflow-hidden relative w-full
        ${disabled
          ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-70'
          : active
          ? `ring-4 ring-offset-2 ${color} border-transparent`
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
      `}
    >
      {disabled && badgeLabel ? (
        <span className="absolute left-1.5 top-1.5 rounded-full border border-slate-300 bg-slate-200 px-1.5 py-0.5 text-[10px] font-extrabold text-slate-600">
          {badgeLabel}
        </span>
      ) : null}
      <img src={src} alt={alt} className={`${imgClass} mix-blend-multiply ${disabled ? 'grayscale' : ''}`} />
    </button>
  );
}

function PasswordRequirement({ label, met }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${met ? 'text-green-600' : 'text-slate-400'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500' : 'bg-slate-300'}`} />
      {label}
      {met && <Check size={12} strokeWidth={3} />}
    </div>
  );
}
