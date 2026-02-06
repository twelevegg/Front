import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Calendar, Filter, BarChart2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { request } from '../services/http.js';
import { useAuth } from '../features/auth/AuthProvider.jsx';
import { maskName } from '../utils/mask.js';

const TABS = [
  { key: 'summary', label: '요약' },
  { key: 'qa', label: 'QA' },
  { key: 'log', label: '로그' }
];

export default function CallHistoryPage() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarPopoverRef = useRef(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });

  useEffect(() => {
    const fetchCalls = async () => {
      if (!user?.id) {
        setCalls([]);
        setSelectedId(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      try {
        const data = await request(`/api/v1/members/${user.id}/calls?size=200`);
        const items = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
        const mapped = items.map((call) => {
          const keywords = call.keyword
            ? String(call.keyword)
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
            : [];

          const log = Array.isArray(call.transcripts)
            ? call.transcripts.map((entry) => ({
              speaker: entry.speaker,
              text: entry.content || ''
            }))
            : [];

          return {
            id: call.id,
            title: call.summaryText || (call.callType ? `${call.callType} 통화` : '통화 기록'),
            datetime: formatDateTime(call.startTime || call.endTime),
            summary: call.summaryText || '',
            qa: '',
            log,
            sentiment: 'Neutral',
            customerName: call.customerName || '',
            customerPhone: call.customerPhone || '',
            phoneNumber: call.phoneNumber || '',
            callType: call.callType || '',
            transferCount: call.transferCount ?? null,
            estimatedCost: call.estimatedCost ?? null,
            startTime: call.startTime || null,
            endTime: call.endTime || null,
            audioPath: call.audioPath || '',
            duration: formatDuration(call.duration),
            keywords
          };
        });

        setCalls(mapped);
        setSelectedId((prev) => (prev ? prev : mapped[0]?.id ?? null));
      } catch (error) {
        setCalls([]);
        setSelectedId(null);
        setErrorMessage(error?.message || '통화 이력을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user?.id]);

  const filteredCalls = useMemo(() => {
    const q = String(searchQuery || '').trim();
    return calls.filter((c) => {
      const customer = c.customerName || '';
      const customerMasked = maskName(customer);
      const callDate = c.startTime ? new Date(c.startTime) : null;

      const matchesSearch =
        !q ||
        c.title?.includes(q) ||
        String(c.id || '').includes(q) ||
        customer.includes(q) ||
        customerMasked.includes(q); // 마스킹된 이름으로도 검색 가능

      const matchesDate =
        selectedDate && callDate instanceof Date && !Number.isNaN(callDate.getTime())
          ? isSameDate(callDate, selectedDate)
          : false;

      return matchesSearch && matchesDate;
    });
  }, [calls, searchQuery, selectedDate]);

  const selected = useMemo(() => filteredCalls.find((c) => c.id === selectedId), [filteredCalls, selectedId]);

  useEffect(() => {
    if (filteredCalls.length === 0) {
      setSelectedId(null);
      return;
    }

    setSelectedId((prev) => {
      const exists = filteredCalls.some((call) => call.id === prev);
      return exists ? prev : filteredCalls[0].id;
    });
  }, [filteredCalls]);

  const calendarLabel = `${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth() + 1}월`;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const dailyCounts = useMemo(() => {
    const map = new Map();
    calls.forEach((call) => {
      if (!call.startTime) return;
      const date = new Date(call.startTime);
      if (Number.isNaN(date.getTime())) return;
      const key = formatDateKey(date);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [calls]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!calendarPopoverRef.current || calendarPopoverRef.current.contains(event.target)) {
        return;
      }
      setIsCalendarOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
              <div className="relative" ref={calendarPopoverRef}>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50 transition"
                >
                  <Calendar size={14} />
                  {selectedDate ? formatDateOnly(selectedDate) : '날짜 선택'}
                </button>

                {isCalendarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[304px] rounded-2xl border border-slate-100 bg-white p-4 shadow-xl z-30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-slate-500">{calendarLabel}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                          className="px-2 py-1 rounded-lg border hover:bg-slate-50"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                          className="px-2 py-1 rounded-lg border hover:bg-slate-50"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-400 font-semibold">
                      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                        <div key={day} className="text-center">{day}</div>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-1 text-[11px]">
                      {Array.from({ length: totalCells }).map((_, idx) => {
                        const dayNumber = idx - firstDayOfWeek + 1;
                        const isInMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                        const dateObj = isInMonth
                          ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNumber)
                          : null;
                        const dateKey = dateObj ? formatDateKey(dateObj) : '';
                        const callCount = dateKey ? (dailyCounts.get(dateKey) || 0) : 0;
                        const isSelected = dateObj && selectedDate ? isSameDate(dateObj, selectedDate) : false;

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!isInMonth}
                            onClick={() => {
                              if (!dateObj) return;
                              setSelectedDate(dateObj);
                              setIsCalendarOpen(false);
                            }}
                            className={`h-10 rounded-lg border transition ${isInMonth
                              ? isSelected
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-extrabold ring-2 ring-indigo-100'
                                : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                              : 'border-transparent bg-transparent cursor-default'
                              }`}
                          >
                            <div className="leading-4">{isInMonth ? dayNumber : ''}</div>
                            {isInMonth && callCount > 0 ? (
                              <div className="text-[9px] font-bold text-indigo-500 mt-0.5">{callCount}건</div>
                            ) : (
                              <div className="h-[11px]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
            {loading ? (
              <EmptyState title="불러오는 중" description="통화 이력을 불러오고 있습니다." className="h-40" />
            ) : errorMessage ? (
              <EmptyState title="불러오기 실패" description={errorMessage} className="h-40" />
            ) : filteredCalls.length === 0 ? (
              <EmptyState
                title="검색 결과 없음"
                description="다른 키워드로 검색해보세요."
                className="h-40"
              />
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
                    <span className="font-bold">{c.customerName ? maskName(c.customerName) : '-'}</span>
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
                고객: <span className="font-extrabold text-slate-900">{selected?.customerName ? maskName(selected.customerName) : '-'}</span>
              </div>
            </div>

            <div className="flex gap-2" />
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

    </div>
  );
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateOnly(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function formatDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDate(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDuration(seconds) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return '00:00';
  const total = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
