import { useMemo, useState } from 'react';
import { Search, Calendar, Filter, PlayCircle, BarChart2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import { mockCalls } from '../features/calls/mockCalls.js';
import { emitCallConnected } from '../features/calls/callEvents.js';

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

  const filteredCalls = useMemo(() => {
    return mockCalls.filter(c => {
      const matchesSearch =
        c.title.includes(searchQuery) ||
        c.customerName?.includes(searchQuery) || // Assuming mockCalls has customerName
        c.id.includes(searchQuery);

      const matchesSentiment = filterSentiment === 'All' || c.sentiment === filterSentiment; // Assuming mockCalls has sentiment

      return matchesSearch && matchesSentiment;
    });
  }, [searchQuery, filterSentiment]);

  const selected = useMemo(
    () => mockCalls.find((c) => c.id === selectedId),
    [selectedId]
  );

  // ... rest of logic
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
              <PlayCircle size={20} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-700">통화 녹음</span>
            </div>
            <div className="h-16 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 text-sm">
              [ Audio Player Placeholder ]
            </div>

            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-700">통화 요약</span>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-sm text-slate-700 leading-relaxed">
              {selected?.summary || '요약 정보가 없습니다.'}
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-500" />
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
      case 'log':
        return (
          <div className="space-y-2 text-sm text-slate-700">
            <h3 className="font-bold mb-2">통화 로그</h3>
            {selected?.log?.map((entry, index) => (
              <div key={index} className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                <span className="font-bold text-blue-600">{entry.speaker}: </span>
                <span>{entry.text}</span>
              </div>
            )) || <span className="text-sm text-slate-500">로그 정보가 없습니다.</span>}
          </div>
        );
      case 'audio':
        return (
          <div className="h-40 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 text-sm">
            [ Full Audio Player Placeholder ]
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
                  {/* Simple Dropdown Mock */}
                  <div className="hidden group-hover:block absolute top-full right-0 mt-1 w-32 bg-white border border-slate-200 shadow-xl rounded-xl z-10 p-1">
                    {['All', 'Positive', 'Neutral', 'Negative'].map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterSentiment(s)}
                        className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-50 rounded-lg"
                      >
                        {s}
                      </button>
                    ))}
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                  className={`w-full text-left rounded-2xl border px-5 py-4 transition hover:bg-slate-50 ${c.id === selectedId ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-100 bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${c.sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                      c.sentiment === 'Positive' ? 'bg-green-100 text-green-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                      {c.sentiment || 'Neutral'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{c.datetime}</span>
                  </div>
                  <div className="font-extrabold text-slate-800 line-clamp-1">{c.title}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="font-bold">{c.customerName || '고객'}</span>
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
                className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-bold hover:bg-blue-100"
                type="button"
              >
                📞 CoPilot 열기(DEV)
              </button>
            </div>
          </div>

          {/* 탭(버튼식) */}
          <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 shrink-0 self-start">
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 text-sm font-extrabold rounded-2xl transition ${active
                      ? 'bg-white border border-slate-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* 탭 내용 */}
          <div className="mt-4 flex-1 rounded-2xl border border-slate-100 p-5 overflow-y-auto">
            {renderTabContent()}
          </div>
        </Card>
      </div>

      {/* Deep Dive Modal */}
      {isDetailOpen && selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <div className="text-xs font-bold text-slate-500 mb-1">AI Insight</div>
                <h2 className="text-2xl font-black text-slate-900">심층 분석 리포트</h2>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
            </div>

            <div className="p-8 space-y-8">
              {/* Score Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-2">종합 점수</div>
                  <div className="text-3xl font-black text-slate-800">85<span className="text-sm font-medium text-slate-400">/100</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <div className="text-xs font-bold text-blue-600 mb-2">공감도</div>
                  <div className="text-2xl font-black text-blue-800">Excellent</div>
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

              {/* Detailed QA Items */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">평가 상세 항목</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">고객 맞이 및 첫인상</span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">PASS</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">고객 문제 파악 및 경청</span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">PASS</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">해결책 제시의 정확성</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">보통</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-red-100 bg-red-50/50">
                    <span className="font-bold text-slate-700">통화 종료 및 친절한 마무리</span>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">FAIL</span>
                  </div>
                </div>
              </div>

              {/* Sentiment Chart Mock */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">감정 변화 흐름</h3>
                <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 text-sm">
                  [ Sentiment Line Chart Placeholder ]
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
