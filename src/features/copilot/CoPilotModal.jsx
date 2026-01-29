// src/features/copilot/CoPilotModal.jsx
import * as Dialog from '@radix-ui/react-dialog';
import { useMemo } from 'react';
import { Bot, Phone, X, Megaphone, UserRound } from 'lucide-react';
import Card from '../../components/Card.jsx';
import { useCoPilot } from './CoPilotProvider.jsx';
import { maskName } from '../../utils/mask.js';

/**
 * CoPilotModal (Layout v4)
 * ✅ 변경 반영
 * - 멘트추천 ↔ 마케팅 추천 위치 변경
 *   - 멘트추천: 왼쪽(STT 아래)
 *   - 마케팅 추천: 오른쪽(상단)
 * - 오른쪽 비율을 이전으로 복구: grid-cols-[1fr_420px]
 * - 오른쪽 하단에 고객 정보 추가(마케팅 아래 공간 채우기)
 * - 멘트/마케팅 리스트 스크롤 적용
 * - 목데이터 기반
 */
export function CoPilotModal() {
  const { open, setOpen, call, compact, setCompact } = useCoPilot();
  const session = useMemo(() => buildMockSession(call), [call]);

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
                  <div className="mt-4 rounded-2xl border border-slate-100 p-3 bg-slate-50/30">
                    <div className="space-y-2">
                      {session.transcript.map((t, idx) => (
                        <Bubble key={idx} {...t} />
                      ))}
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
                        {session.mentSuggestions.map((s, idx) => (
                          <SuggestionRow key={idx} title={s.title} text={s.text} />
                        ))}
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
                        {session.marketingProducts.map((p, idx) => (
                          <CompactProductRow key={idx} {...p} />
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* ✅ 고객 정보(오른쪽 하단에 배치) */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold flex items-center gap-2">
                          <UserRound size={16} /> 5. 고객 정보
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
                      <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">
                        케이스 저장
                      </button>
                      <button className="rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-extrabold hover:bg-blue-100">
                        추천 적용
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
        className={`max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 shadow-soft ${
          isAgent ? 'bg-white border-blue-100' : 'bg-white border-slate-100'
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

function CompactProductRow({ name, tag, reason, benefit }) {
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
        <span className="font-extrabold">혜택:</span> {benefit}
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

function buildMockSession(call) {
  const callId = (call && typeof call === 'object' ? call.callId : call) || `C-${Date.now()}`;

  const customerName = call?.customerName || '홍길동';
  const customerPhone = call?.customerPhone || call?.phone || '010-1234-5678';

  return {
    callMeta: `CallId: ${callId} · 채널: ${call?.channel || '전화'} · 이슈: ${call?.issue || '요금제/해지 문의'}`,
    customer: { name: customerName, phone: customerPhone },

    transcript: [
      { speaker: '고객', time: '10:11', text: '인터넷이 계속 끊기는데요. 이럴 거면 해지하고 싶습니다.' },
      { speaker: '상담사', time: '10:11', text: '불편을 드려 죄송합니다. 먼저 회선 상태를 확인해도 될까요?' },
      { speaker: '고객', time: '10:12', text: '네, 위약금도 얼마나 나오는지 같이 알려주세요.' },
      { speaker: '상담사', time: '10:12', text: '네, 확인 감사합니다. 위약금과 가능한 혜택까지 함께 안내드리겠습니다.' }
    ],

    mentSuggestions: [
      {
        title: '공감 + 확인 질문',
        text: '불편을 드려 정말 죄송합니다. 정확한 원인 확인을 위해 잠시만 회선 점검 진행해도 괜찮을까요?'
      },
      {
        title: '해지 의사 완화',
        text: '해지를 결정하시기 전에 가능한 조치/보상과 혜택을 함께 안내드려도 될까요?'
      },
      {
        title: '위약금 안내 전 단계',
        text: '위약금은 약정/결합 여부에 따라 달라져서, 가입 정보를 확인 후 정확히 안내드리겠습니다.'
      },
      {
        title: '진행 안내',
        text: '지금 바로 점검 가능한 항목부터 확인 후, 필요 시 기사 방문까지 빠르게 도와드리겠습니다.'
      },
      {
        title: '혜택 자연스럽게 연결',
        text: '불편을 겪으신 만큼 가능한 혜택/할인도 함께 확인해서 부담을 줄여드릴게요.'
      }
    ],

    marketingProducts: [
      {
        name: '기가 와이파이(공유기) 업그레이드',
        tag: '업셀링',
        reason: '끊김/품질 이슈 언급 → 무선 환경 개선 제안',
        benefit: '월 2,200원 추가로 최신 공유기 + 커버리지 개선, 품질 점검과 병행 제안'
      },
      {
        name: '결합 할인(모바일 + 인터넷)',
        tag: '리텐션',
        reason: '해지 의사 표현 → 할인/혜택으로 유지 유도',
        benefit: '가족 결합 시 월 최대 11,000원 할인 가능(조건 확인 필요)'
      },
      // 스크롤 확인용(원하면 삭제)
      {
        name: '속도 업그레이드 프로모션',
        tag: '프로모션',
        reason: '속도 불만/끊김 언급 고객 대상',
        benefit: '3개월 할인 + 업그레이드 옵션 제안'
      }
    ],

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
