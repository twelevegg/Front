import { Link } from 'react-router-dom';
import { Settings2, Languages } from 'lucide-react';

/**
 * AuthShell
 * - 프로젝트 톤(라운드/소프트 섀도우/블루 포인트)에 맞춘 2-panel auth card
 * - 우측 패널 CTA로 로그인/회원가입 페이지를 전환
 */
export default function AuthShell({
  mode, // 'login' | 'signup'
  title,
  subtitle,
  children,
  ctaTitle,
  ctaSubtitle,
  ctaButtonLabel,
  ctaTo
}) {
  const isLogin = mode === 'login';

  return (
    <div className="min-h-full bg-[var(--app-bg)] grid place-items-center px-6 py-10">
      <div className="w-full max-w-[1100px] rounded-[36px] bg-white shadow-soft border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: form */}
          <div className="p-10 md:p-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">CS-Navigator Console</div>
                <div className="text-3xl font-extrabold mt-1">{title}</div>
                <div className="text-sm text-slate-500 mt-2">{subtitle}</div>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-xs text-slate-400">v0.1</div>
              </div>
            </div>

            <div className="mt-7">{children}</div>
          </div>

          {/* Right: CTA panel */}
          <div className="relative">
            <div
              className="h-full p-10 md:p-12 text-white flex flex-col justify-between"
              style={{
                background:
                  'linear-gradient(135deg, rgba(79, 70, 229, 1) 0%, rgba(67, 56, 202, 1) 100%)'
              }}
            >
              {/* big curved shape */}
              <div
                className="absolute -left-20 top-0 bottom-0 w-40 bg-white/0"
                style={{ borderRadius: '999px' }}
                aria-hidden
              />

              <div className="relative">
                <div className="text-4xl font-extrabold tracking-tight">{ctaTitle}</div>
                <div className="mt-3 text-white/90 font-semibold">{ctaSubtitle}</div>

                <Link
                  to={ctaTo}
                  className="inline-flex items-center justify-center mt-8 rounded-full border border-white/50 px-8 py-3 font-extrabold hover:bg-white/10 transition"
                >
                  {ctaButtonLabel}
                </Link>

                <div className="mt-6 text-xs text-white/70">
                  {isLogin
                    ? '팁: 데모에서는 이메일에 admin이 포함되면 관리자 권한으로 로그인됩니다.'
                    : '회원가입 후 로그인 페이지로 이동합니다.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
