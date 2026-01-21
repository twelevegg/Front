import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Calendar, Filter, PlayCircle, BarChart2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import { mockCalls } from '../features/calls/mockCalls.js';
import { emitCallConnected } from '../features/calls/callEvents.js';
import { maskName } from '../utils/mask.js';

const TABS = [
  { key: 'summary', label: '요약' },
  { key: 'qa', label: 'QA' },
  { key: 'log', label: '로그' },
  { key: 'audio', label: '음성' }
];

export default function CallHistoryPage() {
  const [selectedId, setSelectedId] = useState(mockCalls[0].id);
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('All'); // All | Positive | Negative | Neutral
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredCalls = useMemo(() => {
    const q = String(searchQuery || '').trim();
    return mockCalls.filter((c) => {
      const customer = c.customerName || '';
      const customerMasked = maskName(customer);

      const matchesSearch =
        !q ||
        c.title?.includes(q) ||
        c.id?.includes(q) ||
        customer.includes(q) ||
        customerMasked.includes(q); // 마스킹된 이름으로도 검색 가능

      const matchesSentiment =
        filterSentiment === 'All' || c.sentiment === filterSentiment;

      return matchesSearch && matchesSentiment;
    });
  }, [searchQuery, filterSentiment]);

  const selected = useMemo(
    () => mockCalls.find((c) => c.id === selectedId),
    [selectedId]
  );

  const simulate = () => {
    if (selected) {
      emitCallConnected(selected.id);
      alert(`Simulating call connection for ID: ${selected.id}`);
    } else {
      alert('No call selected to simulate.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">통화 요약</span>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">
              {selected?.summary || '요약 정보가 없습니다.'}
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">핵심 키워드</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected?.keywords?.map((keyword, index) => (
                <Pill key={index}>{keyword}</Pill>
              )) || <span className="text-sm text-slate-500">키워드가 없습니다.</span>}
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-4">
            <div className="text-sm text-slate-700">
              <h3 className="font-bold mb-2">고객 질문</h3>
              <p className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                {selected?.customerQuestion || '고객 질문이 없습니다.'}
              </p>
            </div>
            <div className="text-sm text-slate-700">
              <h3 className="font-bold mb-2">상담원 답변</h3>
              <p className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                {selected?.agentAnswer || '상담원 답변이 없습니다.'}
              </p>
            </div>
          </div>
        );

      case 'log': {
        const logs = Array.isArray(selected?.log) ? selected.log : [];
        const logContent = !Array.isArray(selected?.log) && selected?.log ? selected.log : null;

        return (
          <div className="space-y-2 text-sm text-slate-700">
            <h3 className="font-bold mb-2">통화 로그</h3>
            {logs.length > 0 ? (
              logs.map((entry, index) => (
                <div key={index} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <span className="font-bold text-indigo-600">{entry.speaker}: </span>
                  <span>{entry.text}</span>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 whitespace-pre-wrap">
                {logContent || '로그 정보가 없습니다.'}
              </div>
            )}
          </div>
        );
      }

      case 'audio':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <PlayCircle size={20} className="text-indigo-500" />
              <span className="text-sm font-bold text-slate-700">통화 녹음 다시듣기</span>
            </div>
            <div className="h-16 bg-white rounded-xl border border-slate-200 flex items-center px-4 gap-4 shadow-sm">
              <button className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition">
                <PlayCircle size={16} className="ml-0.5" />
              </button>
              <div className="flex-1 h-8 flex items-center gap-1 opacity-50">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{
                      height: `${Math.max(20, Math.random() * 100)}%`,
                      opacity: Math.random() > 0.5 ? 1 : 0.4
                    }}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-500">03:12</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <div className="text-sm text-slate-500 font-bold">Call history</div>
          <div className="text-2xl font-black text-slate-900 mt-1">상담 이력 관리</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[420px_1fr] gap-6">
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-6 pb-2 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold text-slate-800">Calls</div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 transition">
                  <Calendar size={18} />
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-1 pl-3 pr-2 py-2 rounded-full border border-slate-200 bg-white text-xs font-bold hover:bg-slate-50">
                    <Filter size={14} />
                    <span>{filterSentiment === 'All' ? '감정 필터' : filterSentiment}</span>
                  </button>
                  <div className="hidden group-hover:block absolute top-full right-0 pt-2 w-32 z-20">
                    <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-1">
                      {['All', 'Positive', 'Neutral', 'Negative'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setFilterSentiment(s)}
                          className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition ${filterSentiment === s
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="고객명, 이슈, ID 검색..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredCalls.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                <span className="text-sm font-bold">검색 결과가 없습니다.</span>
              </div>
            ) : (
              filteredCalls.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setActiveTab('summary');
                  }}
                  className={`w-full text-left rounded-2xl border px-5 py-4 transition hover:bg-slate-50 ${c.id === selectedId
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-100 bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${c.sentiment === 'Negative'
                        ? 'bg-rose-100 text-rose-600'
                        : c.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                      {c.sentiment || 'Neutral'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{c.datetime}</span>
                  </div>
                  <div className="font-extrabold text-slate-800 line-clamp-1">{c.title}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="font-bold">{maskName(c.customerName || '고객')}</span>
                    <span>·</span>
                    <span>{c.duration || '00:00'}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between gap-4 shrink-0">
            <div>
              <div className="text-sm font-extrabold">통화 상세</div>
              <div className="text-xs text-slate-500 mt-1">
                선택된 통화: <span className="font-extrabold text-slate-900">{selected?.id}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                고객: <span className="font-extrabold text-slate-900">{maskName(selected?.customerName || '고객')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsDetailOpen(true)}
                className="rounded-full border border-slate-200 bg-white text-slate-600 px-4 py-2 text-sm font-bold hover:bg-slate-50 flex items-center gap-2"
                type="button"
              >
                <BarChart2 size={16} />
                <span>심층 분석</span>
              </button>
              <button
                onClick={simulate}
                className="rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-bold hover:bg-indigo-100"
                type="button"
              >
                📞 CoPilot 열기(DEV)
              </button>
            </div>
          </div>

          <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 shrink-0 self-start">
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 text-sm font-extrabold rounded-2xl transition ${active ? 'bg-white border border-slate-200 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex-1 rounded-2xl border border-slate-100 p-5 overflow-y-auto">
            {renderTabContent()}
          </div>
        </Card>
      </div>

      {isDetailOpen && selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <div className="text-xs font-bold text-slate-500 mb-1">AI Insight</div>
                <h2 className="text-2xl font-black text-slate-900">심층 분석 리포트</h2>
                <div className="text-xs text-slate-500 mt-1">
                  고객: <span className="font-extrabold text-slate-900">{maskName(selected?.customerName || '고객')}</span>
                </div>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2">종합 점수</div>
                  <div className="text-3xl font-black text-slate-800">
                    85<span className="text-sm font-medium text-slate-400">/100</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <div className="text-xs font-bold text-indigo-600 mb-2">공감도</div>
                  <div className="text-2xl font-black text-indigo-800">Excellent</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2">해결력</div>
                  <div className="text-2xl font-black text-slate-800">Good</div>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <div className="text-xs font-bold text-orange-600 mb-2">개선 필요</div>
                  <div className="text-sm font-bold text-orange-800">마무리 인사 누락</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">평가 상세 항목</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">고객 맞이 및 첫인상</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">PASS</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">고객 문제 파악 및 경청</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">PASS</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">해결책 제시의 정확성</span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">보통</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-rose-100 bg-rose-50/50">
                    <span className="font-bold text-slate-700">통화 종료 및 친절한 마무리</span>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">FAIL</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">감정 변화 흐름</h3>
                <div className="h-[200px] w-full bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { time: '00:30', val: 30 }, { time: '01:00', val: 40 }, { time: '01:30', val: 35 },
                      { time: '02:00', val: 50 }, { time: '02:30', val: 70 }, { time: '03:00', val: 85 }
                    ]}>
                      <defs>
                        <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={3} fillUrl="url(#sentimentGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
