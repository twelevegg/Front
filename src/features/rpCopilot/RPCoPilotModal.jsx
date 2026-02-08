import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Bot, Phone, UserRound, X, Sparkles, User, Headset } from 'lucide-react';
import Card from '../../components/Card.jsx';

export default function RPCoPilotModal({
  open,
  setOpen,
  messages,
  persona,
  callStatus,
  duration,
  input,
  setInput,
  onSend,
  aiTyping,
  onEndCall
}) {
  const [compact, setCompact] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const session = useMemo(
    () => buildRpSession(messages, persona, callStatus, duration),
    [messages, persona, callStatus, duration]
  );

  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [session.transcript]);

  const contentClass = compact
    ? 'fixed right-6 top-6 w-[720px] max-w-[calc(100vw-48px)] rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-50'
    : 'fixed inset-6 md:inset-10 rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-50';

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />

        <Dialog.Content
          className={contentClass}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (confirmOpen) {
              e.preventDefault();
              setConfirmOpen(false);
            }
          }}
        >
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-100 bg-white">
                  <Bot size={18} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-extrabold">RP 코파일럿</Dialog.Title>
                  <div className="text-xs text-slate-500 mt-0.5">페르소나 · 대화 로그 · 멘트 추천</div>
                </div>

                <div className="ml-2" />
              </div>

              <Dialog.Close
                className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-50"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmOpen(true);
                }}
              >
                <X size={16} />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-auto px-6 py-6">
              <div
                className={
                  compact
                    ? 'grid grid-cols-1 gap-6 items-stretch'
                    : 'grid grid-cols-[1fr_420px] gap-6 items-stretch'
                }
              >
                <Card className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold flex items-center gap-2">
                        <Phone size={16} /> 1. RP 대화 로그
                      </div>
                      <div className="text-xs text-slate-500 mt-1">RP 시뮬레이션 대화 기록</div>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${session.statusTone}`}>
                      {session.statusLabel}
                    </span>
                  </div>

                  <div
                    ref={transcriptRef}
                    className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-2xl border border-slate-100 p-3 bg-slate-50/30 max-h-[420px]"
                  >
                    <div className="space-y-2">
                      {session.transcript.length > 0 ? (
                        session.transcript.map((t, idx) => (
                          <RPBubble key={idx} {...t} />
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-400">
                          대화가 시작되면 실시간으로 표시됩니다.
                        </div>
                      )}
                      {aiTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 shadow-soft bg-white border-slate-100">
                            <div className="text-[11px] text-slate-500 mb-0.5">
                              <span className="font-semibold">고객</span>
                            </div>
                            <span className="sr-only">AI가 응답을 준비 중입니다.</span>
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-slate-500/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 rounded-full bg-slate-500/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 rounded-full bg-slate-500/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (aiTyping || callStatus !== 'active') return;
                        if (e.key === 'Enter' && input.trim()) {
                          onSend(input);
                          setInput('');
                        }
                      }}
                      disabled={aiTyping || callStatus !== 'active'}
                      placeholder="상담사 답변을 입력하세요..."
                      className={`flex-1 px-4 py-3 rounded-xl outline-none border ${(aiTyping || callStatus !== 'active') ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-200'}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (aiTyping || callStatus !== 'active') return;
                        if (!input.trim()) return;
                        onSend(input);
                        setInput('');
                      }}
                      disabled={aiTyping || callStatus !== 'active'}
                      className={`px-6 py-3 rounded-xl font-bold transition ${(aiTyping || callStatus !== 'active') ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      전송
                    </button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 p-4 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">2. 멘트 추천</div>
                        <div className="text-xs text-slate-500 mt-1">페르소나 성향에 맞춘 대응 가이드</div>
                      </div>
                      <Pill tone="primary">RP</Pill>
                    </div>

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

                <div className="h-full flex flex-col gap-6 min-h-0">
                  <Card className="p-5 flex flex-col min-h-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <Sparkles size={16} /> 3. 페르소나 요약
                        </div>
                        <div className="text-xs text-slate-500 mt-1">선택한 카드 기준</div>
                      </div>
                      <Pill>{session.personaTag}</Pill>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <InfoBox
                        title="페르소나 정보"
                        rows={session.personaInfo}
                      />
                    </div>
                  </Card>

                  <div className="flex flex-col gap-3">
                    <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <UserRound size={16} /> 4. 통화 상태
                        </div>
                        <div className="text-xs text-slate-500 mt-1">RP 세션 요약</div>
                      </div>
                      <div className="text-xs text-slate-500">{session.durationLabel}</div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <InfoBox title="진행 현황" rows={session.callInfo} />
                    </div>
                    </Card>

                    <button
                      type="button"
                      onClick={() => setConfirmOpen(true)}
                      className="w-full rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-extrabold hover:bg-red-100 hover:border-red-300 transition"
                    >
                      통화 종료
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {confirmOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto">
              <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
              <div
                className="relative z-[70] w-[360px] rounded-2xl bg-white border border-slate-100 shadow-soft p-6 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-sm font-extrabold text-slate-900">정말로 통화를 종료하겠습니까?</div>
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmOpen(false);
                      if (onEndCall) onEndCall();
                      setOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700"
                  >
                    예
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-600 hover:bg-slate-50"
                  >
                    아니오
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function RPBubble({ speaker, text }) {
  const isAgent = speaker === '상담사';
  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 shadow-soft ${isAgent ? 'bg-white border-blue-100' : 'bg-white border-slate-100'
          }`}
      >
        <div className="text-[11px] text-slate-500 mb-0.5 flex items-center gap-1">
          {isAgent ? <Headset size={12} /> : <User size={12} />}
          <span className="font-semibold">{speaker}</span>
        </div>
        <div className="text-slate-800 font-semibold">{text}</div>
      </div>
    </div>
  );
}

function SuggestionRow({ title, text }) {
  return (
    <div className="w-full text-left rounded-2xl border border-slate-100 px-4 py-3 bg-white">
      <div className="text-xs font-extrabold text-slate-500">{title}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800 leading-6">{text}</div>
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

function buildRpSession(messages = [], persona, callStatus, duration = 0) {
  const transcript = (messages || []).map((m) => ({
    speaker: m.role === 'user' ? '상담사' : '고객',
    text: m.content
  }));

  const personaTag = persona?.name || '미선택';
  const personaInfo = [
    { label: '이름', value: persona?.name || '미선택' },
    { label: '난이도', value: persona?.difficulty || '알 수 없음' },
    { label: '성향', value: persona?.tone || '알 수 없음' },
    { label: '설명', value: persona?.desc || '없음' }
  ];

  const mentSuggestions = getMentSuggestions(persona);

  const statusLabel =
    callStatus === 'active' ? '통화중'
      : callStatus === 'connecting' ? '연결 중'
        : callStatus === 'ended' ? '통화 종료'
          : '대기';

  const statusTone =
    callStatus === 'active'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : callStatus === 'connecting'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : callStatus === 'ended'
          ? 'border-slate-200 bg-slate-50 text-slate-500'
          : 'border-slate-200 bg-white text-slate-600';

  const durationLabel = formatTime(duration);

  const callInfo = [
    { label: '메시지 수', value: `${transcript.length}개` },
    { label: '마지막 발화', value: transcript.at(-1)?.speaker || '없음' },
    { label: '상태', value: statusLabel }
  ];

  return {
    transcript,
    personaInfo,
    personaTag,
    mentSuggestions,
    statusLabel,
    statusTone,
    durationLabel,
    callInfo
  };
}

function getMentSuggestions(persona) {
  const personaId = persona?.id;

  if (personaId === 'angry') {
    return [
      { title: '감정 진정', text: '불편을 드려 정말 죄송합니다. 지금 바로 원인을 확인하겠습니다.' },
      { title: '신속 처리', text: '지금 확인되는 범위에서 즉시 조치 가능한 부분부터 처리하겠습니다.' },
      { title: '요구 확인', text: '가장 급한 요청이 무엇인지 먼저 알려주실 수 있을까요?' }
    ];
  }

  if (personaId === 'vip') {
    return [
      { title: '우선 처리', text: '고객님은 VIP로 우선 확인해드리겠습니다.' },
      { title: '혜택 제안', text: '현재 조건에서 가능한 추가 혜택을 바로 안내드리겠습니다.' },
      { title: '간소화 진행', text: '불편을 줄이기 위해 필요한 절차를 최소화해 진행하겠습니다.' }
    ];
  }

  if (personaId === 'elderly') {
    return [
      { title: '천천히 안내', text: '제가 천천히 하나씩 설명드리겠습니다. 먼저 청구서를 함께 확인해 볼까요?' },
      { title: '반복 확인', text: '다시 한 번 말씀드리면, 요금이 늘어난 이유는 이 부분입니다.' },
      { title: '단계별 설명', text: '첫 번째로 이번 달 사용량부터 확인하겠습니다.' }
    ];
  }

  return [
    { title: '공감 표현', text: '불편을 드려 죄송합니다. 지금 바로 확인하겠습니다.' },
    { title: '핵심 요약', text: '핵심 원인부터 간단히 정리해드리겠습니다.' },
    { title: '다음 단계', text: '확인 후 처리 방법을 안내드리겠습니다.' }
  ];
}

function formatTime(sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
