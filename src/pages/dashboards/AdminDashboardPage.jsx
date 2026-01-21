import { useMemo, useState } from 'react';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Pill from '../../components/Pill.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import { maskName } from '../../utils/mask.js'; // ✅ 추가

const counselors = [
  { name: '김지민', id: 'A-1021', team: '배송/반품', tenure: '근속 43일', risk: 82, riskTone: 'High' },
  { name: '정유진', id: 'A-1097', team: 'AS/기술지원', tenure: '근속 19일', risk: 77, riskTone: 'High' },
  { name: '이현우', id: 'A-1044', team: '결제/계정', tenure: '근속 28일', risk: 53, riskTone: 'Medium' },
  { name: '박수아', id: 'A-1010', team: '배송/반품', tenure: '근속 69일', risk: 31, riskTone: 'Low' }
];

export default function AdminDashboardPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(counselors[3]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return counselors;
    return counselors.filter((c) => `${c.name} ${c.id}`.includes(q)); // 검색은 원본 기준 유지
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Dashboard</div>
        <div className="text-xl font-extrabold mt-1">관리자 대시보드</div>
        <div className="text-sm text-slate-500 mt-1">신입 이탈 징후 · 스트레스 지수 · 폭언/욕설 알림</div>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <Kpi title="대상" value="4명" />
          <Kpi title="평균 이탈 징후" value="61" />
          <Kpi title="평균 스트레스" value="58" />
          <Kpi title="폭언 알림(7일)" value="6건" />
        </div>

        <div className="flex gap-3 items-center">
          <SearchInput placeholder="상담사/ID 검색" value={query} onChange={setQuery} />
          <select className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">
            <option>All</option>
            <option>배송/반품</option>
            <option>AS/기술지원</option>
            <option>결제/계정</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-6">
        <Card className="p-5">
          <div className="text-sm font-extrabold">이탈 징후 Top 5</div>
          <div className="mt-4 space-y-3">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition hover:bg-slate-50 ${
                  selected?.id === c.id ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-extrabold">{maskName(c.name)}</div>
                      <Badge label={c.riskTone} tone={c.riskTone} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {c.id} · {c.team} · {c.tenure}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold">{c.risk}</div>
                    <div className="text-xs text-slate-400">risk</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-extrabold">선택 상담사</div>
              <div className="text-sm text-slate-500 mt-1">
                {maskName(selected?.name)} · {selected?.id} · {selected?.team} · {selected?.tenure}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <Pill>이탈 Low ({selected?.risk ?? '-'})</Pill>
              <Pill>스트레스 Normal (32)</Pill>
              <Pill>폭언 7일 0건</Pill>
            </div>
          </div>

          <div className="mt-4 flex gap-2 justify-end">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">코칭</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">배치 조정</button>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50">케어 기록</button>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 h-[260px] flex items-center justify-center text-slate-400 font-semibold">
            (7일 추이 차트 Placeholder)
          </div>

          <div className="mt-2 text-xs text-slate-400">risk &amp; stress (7일)</div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold">폭언/욕설 실시간 알림</div>
          <Pill>Live</Pill>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-100 p-4 text-sm text-slate-500">
          실시간 알림 영역(Placeholder)
        </div>
      </Card>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 min-w-[190px] shadow-soft">
      <div className="text-xs text-slate-500 font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}
