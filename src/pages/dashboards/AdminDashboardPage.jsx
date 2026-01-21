import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Pill from '../../components/Pill.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';

const counselors = [
  { name: '김지민', id: 'A-1021', team: '배송/반품', tenure: '근속 43일', risk: 82, riskTone: 'High' },
  { name: '정유진', id: 'A-1097', team: 'AS/기술지원', tenure: '근속 19일', risk: 77, riskTone: 'High' },
  { name: '이현우', id: 'A-1044', team: '결제/계정', tenure: '근속 28일', risk: 53, riskTone: 'Medium' },
  { name: '박수아', id: 'A-1010', team: '배송/반품', tenure: '근속 69일', risk: 31, riskTone: 'Low' }
];

const mockTrendData = [
  { day: 'Mon', risk: 40, stress: 30 },
  { day: 'Tue', risk: 45, stress: 35 },
  { day: 'Wed', risk: 30, stress: 40 },
  { day: 'Thu', risk: 55, stress: 45 },
  { day: 'Fri', risk: 65, stress: 50 },
  { day: 'Sat', risk: 50, stress: 40 },
  { day: 'Sun', risk: 60, stress: 55 },
];

const mockAlerts = [
  { id: 1, type: 'abuse', msg: '욕설 감지 (통화 #C-1023)', time: '방금 전' },
  { id: 2, type: 'stress', msg: '스트레스 지수 급증 (김지민)', time: '10분 전' },
  { id: 3, type: 'shout', msg: '고성 감지 (통화 #C-1099)', time: '25분 전' },
];

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');
  const [selected, setSelected] = useState(counselors[3]);

  const filtered = useMemo(() => {
    let list = counselors;
    if (teamFilter !== 'All') {
      list = list.filter((c) => c.team === teamFilter);
    }
    const q = query.trim();
    if (q) {
      list = list.filter((c) => `${c.name} ${c.id}`.includes(q));
    }
    return list;
  }, [query, teamFilter]);

  const handleAction = (action) => {
    // API Call Mock
    addToast(`${selected.name}님에게 ${action} 요청을 전송했습니다.`, 'success');
  };

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
          <select
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="All">All Teams</option>
            <option value="배송/반품">배송/반품</option>
            <option value="AS/기술지원">AS/기술지원</option>
            <option value="결제/계정">결제/계정</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-6">
        <Card className="p-5">
          <div className="text-sm font-extrabold">이탈 징후 Top 5</div>
          <div className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">검색 결과가 없습니다.</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition hover:bg-slate-50 ${selected?.id === c.id ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold">{c.name}</div>
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
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          {selected ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-extrabold">선택 상담사</div>
                  <div className="text-sm text-slate-500 mt-1">
                    {selected.name} · {selected.id} · {selected.team} · {selected.tenure}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Pill>이탈 Low ({selected.risk ?? '-'})</Pill>
                  <Pill>스트레스 Normal (32)</Pill>
                  <Pill>폭언 7일 0건</Pill>
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleAction('코칭')}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50 active:scale-95 transition"
                >
                  코칭
                </button>
                <button
                  onClick={() => handleAction('배치 조정')}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50 active:scale-95 transition"
                >
                  배치 조정
                </button>
                <button
                  onClick={() => handleAction('케어 기록')}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50 active:scale-95 transition"
                >
                  케어 기록
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 h-[260px] p-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockTrendData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                    <Area type="monotone" dataKey="stress" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStress)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-slate-400 text-right">
                <span className="text-red-500 font-bold">● Risk</span> &nbsp;
                <span className="text-blue-500 font-bold">● Stress</span> (7일 추이)
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">상담사를 선택해주세요.</div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold">폭언/욕설 실시간 알림</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Pill>Live</Pill>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
              <div className="bg-white p-2 rounded-xl text-xl shadow-sm">🚨</div>
              <div>
                <div className="text-xs font-bold text-red-700 mb-1">{alert.type.toUpperCase()} ALERT</div>
                <div className="text-sm font-bold text-slate-800">{alert.msg}</div>
                <div className="text-xs text-slate-400 mt-1">{alert.time}</div>
              </div>
            </div>
          ))}
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
