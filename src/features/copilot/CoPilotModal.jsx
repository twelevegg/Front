import * as Dialog from '@radix-ui/react-dialog';
import { useMemo } from 'react';
import {
  BadgeCheck,
  Bot,
  ChevronDown,
  Clipboard,
  Headphones,
  Megaphone,
  Phone,
  Shield,
  Sparkles,
  UserRound,
  X
} from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useCoPilot } from './CoPilotProvider.jsx';

/**
 * CoPilotModal (v2)
 *
 * ✅ 목표
 * - "통화 연결" 이벤트(CALL_CONNECTED)가 들어오면 자동으로 패널을 오픈
 * - 첨부 이미지처럼 2컬럼(대화/추천 vs 예측/감정/마케팅) 구조
 * - 통신사 도메인에 맞는 샘플 데이터
 *
 * ✅ Backend/AI 연동 시 변경 포인트 (FastAPI 등)
 * - 통화 이벤트: CTI/Asterisk/WebSocket에서 CALL_CONNECTED payload를 받아 openWithCall(payload) 호출
 * - STT/전사: 스트리밍 전사 내용을 state로 append (예: transcript.push(...))
 * - "민원 요청 예측/감정/업셀링/해지방어"는 AI API 결과로 교체 (현재는 mock)
 */
export function CoPilotModal() {
  const {
    open,
    setOpen,
    call,
    compact,
    setCompact,
    sttOn,
    setSttOn,
    diarizationOn,
    setDiarizationOn,
    summaryOn,
    setSummaryOn
  } = useCoPilot();

  const session = useMemo(() => buildMockSession(call), [call]);

  const contentClass = compact
    ? 'fixed right-6 top-6 w-[560px] max-w-[calc(100vw-48px)] rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-[100]'
    : 'fixed inset-6 md:inset-10 rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-[100]';

  const gridClass = compact
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-[1fr_420px] gap-6';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[99]" />

        <Dialog.Content className={contentClass}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-100 bg-white">
                  <Bot size={18} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-extrabold">실시간 통화 코파일럿</Dialog.Title>
                  <div className="text-xs text-slate-500 mt-0.5">
                    실시간 전사 · 요청 정리(예측) · 감정 기반 멘트/행동 · 업셀링/해지방어
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCompact((v) => !v)}
                  className="ml-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50"
                >
                  {compact ? 'Expanded' : 'Compact'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Pill tone="success">통화중</Pill>
                <TogglePill label="STT" on={sttOn} onToggle={() => setSttOn((v) => !v)} />
                <TogglePill label="화자분리" on={diarizationOn} onToggle={() => setDiarizationOn((v) => !v)} />
                <TogglePill label="요약" on={summaryOn} onToggle={() => setSummaryOn((v) => !v)} />
                <Dialog.Close className="ml-1 grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-50">
                  <X size={16} />
                </Dialog.Close>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto px-6 py-6">
              <div className={gridClass}>
                {/* LEFT */}
                <div className="space-y-6">
                  <Card className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <Phone size={16} /> 통화 내용(실시간)
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {session.callMeta}
                        </div>
                      </div>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
                        {session.now}
                      </button>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-100 p-4 bg-slate-50/30">
                      <div className="space-y-3">
                        {session.transcript.map((t, idx) => (
                          <Bubble key={idx} {...t} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <ActionChip icon={Sparkles} label="공감 멘트" />
                      <ActionChip icon={BadgeCheck} label="확인 질문" />
                      <ActionChip icon={Clipboard} label="요약 말하기" />
                      <ActionChip icon={Headphones} label="가이드라인" />
                      <ActionChip icon={Shield} label="해지 방어" tone="danger" />
                      <ActionChip icon={Megaphone} label="업셀링" tone="primary" />
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">추천 멘트(읽고 바로 말하기)</div>
                        <div className="text-xs text-slate-500 mt-1">상황별로 한 문장씩 제안합니다.</div>
                      </div>
                      <Pill>Auto</Pill>
                    </div>

                    <div className="mt-4 space-y-2">
                      {session.suggestedScripts.map((s, idx) => (
                        <ScriptRow key={idx} text={s} />
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">이관(부서) 추천</div>
                        <div className="text-xs text-slate-500 mt-1">필요 시 담당 부서로 이관 준비</div>
                      </div>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
                        추천안
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold flex items-center justify-between">
                        <span>인터넷/모바일(품질/해지)</span>
                        <ChevronDown size={16} />
                      </div>
                      <button className="rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 px-4 py-3 text-sm font-extrabold hover:bg-blue-100">
                        이관 준비
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 max-h-[220px] overflow-auto pr-1">
                      {session.handoffCandidates.map((h, idx) => (
                        <HandoffRow key={idx} {...h} />
                      ))}
                    </div>
                  </Card>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                  <Card className="p-5">
                    <div className="text-sm font-extrabold">민원/요청 정리(예측)</div>
                    <div className="text-xs text-slate-500 mt-1">전사/문맥 기반으로 상위 가능성을 보여줍니다.</div>

                    <div className="mt-4 space-y-3">
                      {session.intentCards.map((c, idx) => (
                        <IntentCard key={idx} {...c} />
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">멘트/행동 추천(감정 기반)</div>
                        <div className="text-xs text-slate-500 mt-1">통화 중 상대 감정에 맞춰 대응 전략을 제안합니다.</div>
                      </div>
                      <Pill tone={session.emotion.tone}>{session.emotion.label} ({session.emotion.score})</Pill>
                    </div>

                    <div className="mt-4 space-y-3">
                      {session.emotionPlaybook.map((p, idx) => (
                        <PlaybookCard key={idx} {...p} />
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="text-sm font-extrabold">마케팅/리텐션 액션</div>
                    <div className="text-xs text-slate-500 mt-1">
                      업셀링/해지방어/혜택 제안 버튼으로 AI 전략을 호출하도록 설계할 수 있습니다.
                      {/*
                        TODO(FastAPI 연동 예시)
                        - 업셀링: POST /ai/upsell { callId, transcript, customerProfile }
                        - 해지방어: POST /ai/retention { callId, transcript, contractInfo }
                        - 감정분석: POST /ai/emotion { callId, audioChunk|text }
                      */}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <PrimaryButton icon={Megaphone} label="업셀링 제안" />
                      <PrimaryButton icon={Shield} label="해지 방어" tone="danger" />
                      <PrimaryButton icon={Sparkles} label="혜택/프로모션" />
                      <PrimaryButton icon={Headphones} label="품질/장애 안내" tone="neutral" />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-100 p-4">
                      <div className="text-xs text-slate-500 font-semibold">추천(예시)</div>
                      <div className="mt-2 text-sm text-slate-700 leading-6">
                        • 고객이 해지 의사를 보이면: <span className="font-extrabold">위약금/혜택</span>을 비교 제시하고 선택지를 주기<br />
                        • 업셀링: 사용 패턴 기반으로 <span className="font-extrabold">추가 데이터/결합 할인</span> 제안
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <UserRound size={14} />
                고객: <span className="font-semibold text-slate-700">{session.customer.name}</span> ·
                {session.customer.phone}
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">
                  케이스 저장
                </button>
                <button className="rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-extrabold hover:bg-blue-100">
                  추천 적용
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Bubble({ speaker, time, text }) {
  const isAgent = speaker === '상담사';
  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl border px-4 py-3 text-sm leading-6 shadow-soft ${isAgent ? 'bg-white border-blue-100' : 'bg-white border-slate-100'
          }`}
      >
        <div className="text-xs text-slate-500 mb-1">
          <span className="font-semibold">{speaker}</span> · {time}
        </div>
        <div className="text-slate-800 font-semibold">{text}</div>
      </div>
    </div>
  );
}

function IntentCard({ title, confidence, prompt }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <div className="font-extrabold">{title}</div>
        <div className="text-xs font-extrabold text-slate-600">{confidence}%</div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-slate-800" style={{ width: `${confidence}%` }} />
      </div>
      <div className="mt-3 text-sm text-slate-600 leading-6">확인 질문: {prompt}</div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
          전문 삽입
        </button>
        <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
          메모
        </button>
      </div>
    </div>
  );
}

function ScriptRow({ text }) {
  return (
    <button
      type="button"
      className="w-full text-left rounded-2xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition"
    >
      <div className="text-sm font-semibold text-slate-800">{text}</div>
    </button>
  );
}

function HandoffRow({ title, desc, tag }) {
  return (
    <div className="rounded-2xl border border-slate-100 px-4 py-3 flex items-start justify-between gap-3">
      <div>
        <div className="font-extrabold">{title}</div>
        <div className="text-xs text-slate-500 mt-1">{desc}</div>
      </div>
      <Pill tone={tag === '추천' ? 'primary' : 'neutral'}>{tag}</Pill>
    </div>
  );
}

function PlaybookCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="font-extrabold">{title}</div>
      <div className="text-sm text-slate-600 mt-2 leading-6">{desc}</div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
          다음 멘트 추천
        </button>
        <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50">
          근거 보기
        </button>
      </div>
    </div>
  );
}

function Pill({ children, tone = 'neutral' }) {
  const toneClass =
    tone === 'primary'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : tone === 'danger'
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-slate-200 bg-white text-slate-700';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${toneClass}`}>{children}</span>
  );
}

function TogglePill({ label, on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3 py-1 text-xs font-extrabold hover:bg-slate-50 ${on ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'
        }`}
    >
      {label}: {on ? 'on' : 'off'}
    </button>
  );
}

function ActionChip({ icon: Icon, label, tone = 'neutral' }) {
  const toneClass =
    tone === 'primary'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : tone === 'danger'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-slate-200 bg-white text-slate-700';

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold hover:bg-slate-50 ${toneClass}`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function PrimaryButton({ icon: Icon, label, tone = 'primary' }) {
  const toneClass =
    tone === 'danger'
      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
      : tone === 'neutral'
        ? 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100';

  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${toneClass}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function buildMockSession(call) {
  // 통화 이벤트가 아직 없으면(미리보기) 기본값
  const callId = call?.callId || 'C-20260120-1011';

  return {
    now: '10:11',
    callMeta: `CallId: ${callId} · 채널: ${call?.channel || '전화(CTI)'} · 이슈: ${call?.issue || '해지/요금제 문의'}`,
    customer: {
      name: call?.customerName || '홍길동',
      phone: '010-1234-5678'
    },
    transcript: [
      { speaker: '고객', time: '10:11', text: '인터넷이 계속 끊기는데요. 이럴 거면 해지하고 싶습니다.' },
      { speaker: '상담사', time: '10:11', text: '불편을 드려 죄송합니다. 먼저 사용 중인 회선 상태를 확인해도 될까요?' },
      { speaker: '고객', time: '10:12', text: '네, 근데 위약금도 얼마나 나오는지 같이 알려주세요.' },
      { speaker: '상담사', time: '10:12', text: '네, 확인 감사합니다. 품질 점검과 위약금/혜택까지 함께 안내드리겠습니다.' }
    ],
    suggestedScripts: [
      '불편을 드려 정말 죄송합니다. 우선 품질 점검을 진행하고 바로 안내드리겠습니다.',
      '해지를 원하시는 이유가 품질 문제인지 확인 후, 가능한 보상/혜택도 함께 안내드려도 될까요?',
      '위약금은 약정/결합 여부에 따라 달라져서, 가입 정보를 확인한 뒤 정확히 안내드리겠습니다.'
    ],
    handoffCandidates: [
      { title: '인터넷 품질/장애', desc: '망 점검 · 기사 방문 · 장애 보상', tag: '추천' },
      { title: '해지/위약금', desc: '약정/결합 · 위약금 산정 · 해지 방어', tag: '추천' },
      { title: '요금제/프로모션', desc: '요금제 변경 · 결합 할인 · 부가서비스', tag: '일반' }
    ],
    intentCards: [
      {
        title: '인터넷 품질/장애 확인',
        confidence: 64,
        prompt: '품질 점검을 먼저 진행해드릴까요, 또는 즉시 해지 절차를 원하시나요?'
      },
      {
        title: '해지/위약금 문의',
        confidence: 26,
        prompt: '약정/결합 여부를 확인하고 위약금을 정확히 안내드려도 될까요?'
      },
      {
        title: '혜택/프로모션(리텐션)',
        confidence: 18,
        prompt: '불편 보상 또는 요금 할인 혜택 안내가 필요하실까요?'
      }
    ],
    emotion: {
      label: '불만/긴장',
      score: 72,
      tone: 'danger'
    },
    emotionPlaybook: [
      {
        title: '공감 + 사실확인',
        desc: '"불편을 드려 죄송합니다" → "끊김 발생 시간/빈도"를 짧게 확인 → "점검/조치" 제시'
      },
      {
        title: '선택지 제시',
        desc: '"점검 후 재개" vs "해지/위약금 안내" 두 가지 옵션을 제시해 통제감 제공'
      },
      {
        title: '고위험 신호 대응',
        desc: '욕설/민원/언론 언급 시: 안내 문구 고정 + 관리자/전문 부서 이관 준비'
      }
    ]
  };
}
