import * as Dialog from '@radix-ui/react-dialog';
import { Phone, UserRound, X } from 'lucide-react';
import Card from '../../components/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { maskName } from '../../utils/mask.js';

export default function CallLogModal({ open, onOpenChange, call, loading, error }) {
  const contentClass = 'fixed inset-6 md:inset-10 rounded-3xl bg-white shadow-soft border border-slate-100 overflow-hidden z-[100]';
  const transcripts = Array.isArray(call?.transcripts) ? call.transcripts : [];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-[99]" />

        <Dialog.Content className={contentClass}>
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-100 bg-white">
                  <Phone size={18} />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-extrabold">통화 기록</Dialog.Title>
                  <div className="text-xs text-slate-500 mt-0.5">고객 정보 · 대화 로그</div>
                </div>
              </div>

              <Dialog.Close className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-50">
                <X size={16} />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-auto px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-stretch">
                <Card className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold flex items-center gap-2">
                        <Phone size={16} /> 대화 로그
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Call ID: {call?.id || '-'}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex-1 min-h-0 overflow-y-auto rounded-2xl border border-slate-100 p-3 bg-slate-50/30 max-h-[500px]">
                    {loading ? (
                      <EmptyState title="불러오는 중" description="통화 로그를 불러오고 있습니다." className="py-8" />
                    ) : error ? (
                      <EmptyState title="불러오기 실패" description={error} className="py-8" />
                    ) : transcripts.length === 0 ? (
                      <EmptyState title="로그 없음" description="표시할 대화 로그가 없습니다." className="py-8" />
                    ) : (
                      <div className="space-y-2">
                        {transcripts.map((item, index) => (
                          <Bubble key={index} speaker={item.speaker} text={item.content} />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold flex items-center gap-2">
                        <UserRound size={16} /> 고객 정보
                      </div>
                      <div className="text-xs text-slate-500 mt-1">기본 정보</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoRow label="고객명" value={call?.customerName ? maskName(call.customerName) : '-'} />
                    <InfoRow label="나이" value={call?.customerAge ?? '-'} />
                    <InfoRow label="성별" value={call?.customerGender || '-'} />
                    <InfoRow label="전화번호" value={maskPhone(call?.customerPhone || call?.phoneNumber)} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Bubble({ speaker, text }) {
  const isAgent = speaker === 'agent' || speaker === '상담사';
  const label = speaker === 'agent' ? '상담사' : speaker === 'customer' ? '고객' : speaker || '고객';

  return (
    <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl border px-3 py-2 text-sm leading-6 shadow-soft ${isAgent ? 'bg-white border-blue-100' : 'bg-white border-slate-100'
          }`}
      >
        <div className="text-[11px] text-slate-500 mb-0.5">
          <span className="font-semibold">{label}</span>
        </div>
        <div className="text-slate-800 font-semibold">{text || '-'}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-slate-500 font-semibold">{label}</div>
      <div className="text-xs text-slate-800 font-extrabold text-right">{value}</div>
    </div>
  );
}

function maskPhone(value) {
  if (!value) return '-';
  const raw = String(value).trim();
  if (!raw) return '-';
  const digits = raw.replace(/\D/g, '');

  if (digits.length < 7) return raw;

  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-****-${digits.slice(6)}`;
  }

  if (digits.length >= 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7, 11)}`;
  }

  return raw;
}
