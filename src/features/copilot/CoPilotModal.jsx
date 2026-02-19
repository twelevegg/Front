// src/features/copilot/CoPilotModal.jsx
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useRef, useEffect } from 'react';
import { Bot, Phone, X, Megaphone, UserRound } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useCoPilot } from './CoPilotProvider.jsx';
import { maskName } from '../../utils/mask.js';

/**
 * CoPilotModal (Layout v4)
 * - Auto-scroll applied to STT log.
 * - Initial Mock Data Removed (Starts empty).
 */
export function CoPilotModal() {
  const { open, setOpen, call, compact, setCompact, transcript, agentResults, sendCallEnd } = useCoPilot();
  const session = useMemo(() => buildMockSession(call, transcript, agentResults), [call, transcript, agentResults]);

  // Auto-scroll logic
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [session.transcript]);

  const contentClass = compact
    ? 'fixed right-6 top-6 w-[720px] max-w-[calc(100vw-48px)] rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-[100]'
    : 'fixed inset-6 md:inset-10 rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-[100]';

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
                  <Dialog.Title className="text-lg font-extrabold">코파일럿</Dialog.Title>
                  <div className="text-xs text-slate-500 mt-0.5">고객 정보 · 실시간 로그 · 추천</div>
                </div>

                <button
                  type="button"
                  onClick={() => setCompact((v) => !v)}
                  className="ml-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold hover:bg-slate-50"
                >
                  {compact ? 'Expanded' : 'Compact'}
                </button>
              </div>

              <Dialog.Close className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-50">
                <X size={16} />
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto px-6 py-6">
              <div
                className={
                  compact
                    ? 'grid grid-cols-1 gap-6 items-stretch'
                    : 'grid grid-cols-[1fr_420px] gap-6 items-stretch'
                }
              >
                {/* LEFT: STT + 멘트 추천(위치 변경) */}
                <Card className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold flex items-center gap-2">
                        <Phone size={16} /> 1. STT 실시간 대화 로그
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{session.callMeta}</div>
                      <div className="text-xs text-slate-400 mt-1">+ 고객 결론 예측, 카테고리 X</div>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-extrabold">
                      통화중
                    </span>
                  </div>

                  {/* STT 로그 (간격 축소) */}
                  <div
                    ref={transcriptRef}
                    className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-2xl border border-slate-100 p-3 bg-slate-50/30 max-h-[400px]"
                  >
                    <div className="space-y-2">
                      {session.transcript.length > 0 ? (
                        session.transcript.map((t, idx) => (
                          <Bubble key={idx} {...t} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-400">
                          대화가 시작되면 실시간으로 표시됩니다.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ 멘트 추천(마케팅이 있던 자리로 이동) */}
                  <div className="mt-4 rounded-2xl border border-slate-100 p-4 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">2. 멘트 추천</div>
                        <div className="text-xs text-slate-500 mt-1">상황별로 “한 문장”을 바로 읽을 수 있게</div>
                      </div>
                      <Pill>Auto</Pill>
                    </div>

                    {/* ✅ 멘트 리스트 스크롤 */}
                    <div className="mt-3 max-h-[260px] overflow-auto pr-1">
                      <div className="space-y-2">
                        {session.mentSuggestions.length > 0 ? (
                          session.mentSuggestions.map((s, idx) => (
                            <SuggestionRow key={idx} title={s.title} text={s.text} />
                          ))
                        ) : (
                          <div className="py-4 text-center text-xs text-slate-400">
                            대기중...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* RIGHT: 마케팅 추천(상단) + 고객정보(하단) */}
                <div className="h-full flex flex-col gap-6 min-h-0">
                  {/* ✅ 마케팅 추천 상품(오른쪽으로 이동) */}
                  <Card className="p-5 flex flex-col min-h-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <Megaphone size={16} /> 3. 마케팅 추천 상품
                        </div>
                        <div className="text-xs text-slate-500 mt-1">대화 맥락/고객 속성 기반 추천</div>
                      </div>
                      <Pill tone="primary">RAG</Pill>
                    </div>

                    {/* ✅ 마케팅 리스트 스크롤 */}
                    <div className="mt-3 flex-1 min-h-0 overflow-auto pr-1">
                      <div className="space-y-2">
                        {session.marketingProducts.length > 0 ? (
                          session.marketingProducts.map((p, idx) => (
                            <CompactProductRow key={idx} {...p} />
                          ))
                        ) : (
                          <div className="py-4 text-center text-xs text-slate-400">
                            분석중...
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* ✅ 고객 정보(오른쪽 하단에 배치) */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <UserRound size={16} /> 4. 고객 정보
                        </div>
                        <div className="text-xs text-slate-500 mt-1">DB 기반 기본정보 + 가입/약정(목데이터)</div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {maskName(session.customer.name)} · {session.customer.phone}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <InfoBox title="기본 정보" rows={session.customerInfo.basic} />
                      <InfoBox title="가입/약정" rows={session.customerInfo.subscription} />
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          if (window.confirm("통화를 종료하시겠습니까?")) {
                            sendCallEnd();
                            setOpen(false);
                          }
                        }}
                        className="rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm font-extrabold hover:bg-red-100"
                      >
                        통화 종료
                      </button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------- UI Pieces ------------------------- */

function Bubble({ speaker, time, text }) {
  const isAgent = speaker === '상담사';
  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 shadow-soft ${isAgent ? 'bg-white border-blue-100' : 'bg-white border-slate-100'
          }`}
      >
        <div className="text-[11px] text-slate-500 mb-0.5">
          <span className="font-semibold">{speaker}</span> · {time}
        </div>
        <div className="text-slate-800 font-semibold">{text}</div>
      </div>
    </div>
  );
}

function SuggestionRow({ title, text }) {
  return (
    <button
      type="button"
      className="w-full text-left rounded-2xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition"
    >
      <div className="text-xs font-extrabold text-slate-500">{title}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800 leading-6">{text}</div>
    </button>
  );
}

function CompactProductRow({ name, tag, reason, desc }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">{name}</div>
          <div className="mt-0.5 text-xs text-slate-500">{reason}</div>
        </div>
        <Pill tone="primary">{tag}</Pill>
      </div>
      <div className="mt-2 text-xs text-slate-700 leading-5">
        <span className="font-extrabold">혜택:</span> {desc}
      </div>
    </div>
  );
}

function InfoBox({ title, rows }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="text-xs font-extrabold text-slate-500">{title}</div>
      <div className="mt-3 space-y-2">
        {rows.map((r, idx) => (
          <div key={idx} className="flex items-start justify-between gap-3">
            <div className="text-xs text-slate-500 font-semibold">{r.label}</div>
            <div className="text-xs text-slate-800 font-extrabold text-right">{r.value}</div>
          </div>
        ))}
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

  return <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${toneClass}`}>{children}</span>;
}

/* ------------------------- Mock Data ------------------------- */

function buildMockSession(call, realTranscript = [], realAgentResults = []) {
  const callId = (call && typeof call === 'object' ? call.callId : call) || `C-${Date.now()}`;

  const customerName = call?.customerName || '홍길동';
  const customerPhone = call?.customerPhone || call?.phone || '010-1234-5678';

  // [NEW] Use real transcript if available
  const displayTranscript = realTranscript.length > 0
    ? realTranscript.map(t => ({
      speaker: t.speaker === 'agent' ? '상담사' : (t.speaker === 'customer' ? '고객' : t.speaker),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }), // 타임스탬프가 없으면 현재시간
      text: t.transcript
    }))
    : [];

  // [NEW] Process real agent results (Guidance / Marketing)

  // 1. Guidance (Latest one wins for the "Ment Suggestion" box)
  // agent.py sends: { type: 'result', results: { recommended_answer: '...', ... } }
  const lastGuidance = realAgentResults
    .filter(r => (r.agent_type === 'guidance' || r.results?.agent_type === 'guidance') && r.results?.recommended_answer)
    .pop();

  let currentMentSuggestions = [];

  if (lastGuidance) {
    currentMentSuggestions = [
      {
        title: lastGuidance.results.work_guide || 'AI 가이드',
        text: lastGuidance.results.recommended_answer
      }
    ];
  }

  // 2. Marketing (Latest one wins for the "Marketing Products" box)
  const lastMarketing = realAgentResults
    .filter(r => (r.agent_type === 'marketing' || r.results?.agent_type === 'marketing') && r.results?.recommended_answer)
    .pop();

  let currentMarketingProducts = [];

  if (lastMarketing) {
    const results = lastMarketing.results || {};
    let tag = '추천';

    // Parse Tag
    if (results.work_guide?.includes('Type:')) {
      try {
        tag = results.work_guide.split('Type:')[1].split('(')[0].trim().toUpperCase();
      } catch (e) { tag = '추천'; }
    }

    // Safe Logic for Title & Description
    let productName = 'AI 마케팅 제안';
    let description = '';
    let reasonText = '';

    // 1. Try to use rich proposal data if available
    const proposal = results.marketing_proposal;
    if (proposal) {
      if (proposal.card_title) productName = proposal.card_title;
      if (proposal.arrow_text) reasonText = proposal.arrow_text; // e.g. "스펙 업그레이드"

      if (Array.isArray(proposal.benefits)) {
        description = proposal.benefits.join(', ');
      } else if (typeof proposal.benefits === 'string') {
        description = proposal.benefits;
      }
    }

    // 2. Fallback or Enhancement from recommended_answer (Object or String)
    const rawAnswer = results.recommended_answer;

    // If rawAnswer is a structured object, it overrides generic defaults if specific fields exist
    if (rawAnswer && typeof rawAnswer === 'object') {
      if (rawAnswer.recommendation) productName = rawAnswer.recommendation;
      if (rawAnswer.ment) description = rawAnswer.ment;
      if (rawAnswer.comparison) reasonText = rawAnswer.comparison;
      // If comparison is missing, maybe use 'needs'
      if (!reasonText && rawAnswer.needs) reasonText = rawAnswer.needs;
    }
    // If it's just a string and we still have no description
    else if (typeof rawAnswer === 'string' && !description) {
      description = rawAnswer;
    }

    currentMarketingProducts = [
      {
        id: 'real-mkt-1',
        name: productName,
        tag: tag,
        reason: reasonText,
        desc: description
      }
    ];
  }

  return {
    callMeta: `CallId: ${callId} · 채널: ${call?.channel || '전화'} · 이슈: ${call?.issue || '요금제/해지 문의'}`,
    customer: { name: customerName, phone: customerPhone },

    transcript: displayTranscript,

    mentSuggestions: currentMentSuggestions,

    marketingProducts: currentMarketingProducts,

    customerInfo: {
      basic: [
        { label: '고객ID', value: 'CUST-102938' },
        { label: '등급', value: 'VIP' },
        { label: '주소', value: '서울 강남구 ○○로' },
        { label: '선호 채널', value: '전화' }
      ],
      subscription: [
        { label: '상품', value: '기가인터넷 1G' },
        { label: '약정', value: '24개월 (잔여 7개월)' },
        { label: '결합', value: '모바일 2회선' },
        { label: '월요금', value: '39,000원' }
      ]
    }
  };
}
