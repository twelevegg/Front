import { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';

const cases = [
  {
    id: 'K-012',
    title: '민원 언급 시 응대',
    date: '2026-01-07',
    tags: ['고위험', '표현주의'],
    body: '확정/과장 표현 금지, 근거 문서 기반 안내'
  },
  {
    id: 'K-009',
    title: '중복 결제 의심',
    date: '2026-01-05',
    tags: ['환불', '정책'],
    body: '결제 내역 확인 후 정책에 따라 환불 절차 안내'
  }
];

export default function CaseLibraryPage() {
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const selected = useMemo(() => cases.find((c) => c.id === selectedId), [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Case library</div>
        <div className="text-xl font-extrabold mt-1">Case library</div>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">Case library</div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50" type="button">
              ＋ 추가
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {cases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition hover:bg-slate-50 ${
                  c.id === selectedId ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-extrabold">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{c.id} · {c.date}</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {c.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">상세</div>
            <Pill>{selected?.id}</Pill>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 p-5">
            <div className="text-xl font-extrabold">{selected?.title}</div>
            <div className="text-sm text-slate-500 mt-2">업데이트: {selected?.date}</div>
            <div className="mt-4 text-sm text-slate-700 leading-7">{selected?.body}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
