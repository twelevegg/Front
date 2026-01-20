import { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import { mockCalls } from '../features/calls/mockCalls.js';
import { emitCallConnected } from '../features/calls/callEvents.js';

export default function CallHistoryPage() {
  const [selectedId, setSelectedId] = useState(mockCalls[0].id);

  const selected = useMemo(
    () => mockCalls.find((c) => c.id === selectedId),
    [selectedId]
  );

  const simulate = () => {
    emitCallConnected({
      callId: selected?.id,
      customerName: '홍길동',
      issue: selected?.title,
      channel: '전화(CTI)'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Call history</div>
        <div className="text-xl font-extrabold mt-1">Call history</div>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">통화 내역</div>
            <Pill>{mockCalls.length}건</Pill>
          </div>

          <div className="mt-4 space-y-3">
            {mockCalls.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition hover:bg-slate-50 ${
                  c.id === selectedId ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="font-extrabold">{c.title}</div>
                <div className="text-xs text-slate-500 mt-1">{c.datetime}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">통화 상세</div>
              <div className="text-xs text-slate-500 mt-1">요약 / QA / 로그(플레이스홀더)</div>
            </div>
            <button
              onClick={simulate}
              className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-extrabold hover:bg-blue-100"
              type="button"
            >
              📞 CoPilot 열기(DEV)
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 p-5">
            <div className="text-sm text-slate-500">선택된 통화: <span className="font-extrabold text-slate-900">{selected?.id}</span></div>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li>• Summary: {selected?.summary}</li>
              <li>• QA: {selected?.qa}</li>
              <li>• Log: {selected?.log}</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
