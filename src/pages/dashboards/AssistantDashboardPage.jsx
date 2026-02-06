import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/NotificationService.js';
import Card from '../../components/Card.jsx';
import { callEventBus } from '../../features/calls/callEvents.js';
import { useToast } from '../../components/common/ToastProvider.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { CheckCircle, Clock, Moon, AlertCircle, Phone, BookOpen, FileText, Zap, MessageSquare, Headphones, TrendingUp, TrendingDown, Calendar, StickyNote, CalendarCheck } from 'lucide-react';
import { useCoPilot } from '../../features/copilot/CoPilotProvider.jsx';
import { dashboardService } from '../../api/dashboardService.js';
import { request } from '../../services/http.js';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import CallLogModal from '../../features/calls/CallLogModal.jsx';

const perfWeek = [
  { label: 'W-4', calls: 102, csat: 79, avgDuration: 330 },
  { label: 'W-3', calls: 118, csat: 81, avgDuration: 315 },
  { label: 'W-2', calls: 124, csat: 83, avgDuration: 305 },
  { label: 'W-1', calls: 136, csat: 85, avgDuration: 298 }
];

const perfMonth = [
  { label: 'Jan', calls: 412, csat: 78, avgDuration: 322 },
  { label: 'Feb', calls: 438, csat: 82, avgDuration: 310 },
  { label: 'Mar', calls: 466, csat: 86, avgDuration: 295 }
];

export default function AssistantDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openWithCall } = useCoPilot();
  const { addToast } = useToast();
  const [period, setPeriod] = useState('week'); // 'week' | 'month'
  const [status, setStatus] = useState('online'); // online | busy | offline
  const [recentCalls, setRecentCalls] = useState([]);
  const [recentCallsLoading, setRecentCallsLoading] = useState(true);
  const [recentCallsError, setRecentCallsError] = useState('');
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [callLogDetail, setCallLogDetail] = useState(null);
  const [callLogLoading, setCallLogLoading] = useState(false);
  const [callLogError, setCallLogError] = useState('');
  const [quickView, setQuickView] = useState('grid');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: '영호', text: '팀채팅은 개발이 완료 된건가요?' },
    { id: 2, author: '대규', text: '아니요, 시간 부족으로 UI만 구현된 상태입니다.' }
  ]);
  const [scheduleItems, setScheduleItems] = useState([
    { time: '', title: '개발 마감', tag: '팀', dueDate: '2026-02-06' }
  ]);
  const [scheduleDraft, setScheduleDraft] = useState({ tag: '개인', title: '', dueDate: '' });
  const [memoItems, setMemoItems] = useState([
    { id: 1, text: '빨리 끝나면 좋겠다!' }
  ]);
  const [memoInput, setMemoInput] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const today = new Date();
  const isCalendarMonth =
    today.getFullYear() === calendarMonth.getFullYear() &&
    today.getMonth() === calendarMonth.getMonth();
  const todayDate = isCalendarMonth ? today.getDate() : null;
  const calendarLabel = `${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth() + 1}월`;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  // [NEW] Member KPI Data State
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchMemberKpis = async () => {
      try {
        if (!user?.id) return;
        const data = await dashboardService.getMemberKpi(user.id);
        setKpiData(data);
      } catch (error) {
        console.error("Failed to fetch Member KPIs", error);
      }
    };
    fetchMemberKpis();
  }, [user?.id]);

  useEffect(() => {
    const fetchRecentCalls = async () => {
      if (!user?.id) {
        setRecentCalls([]);
        setRecentCallsLoading(false);
        return;
      }

      setRecentCallsLoading(true);
      setRecentCallsError('');

      try {
        const data = await request(`/api/v1/members/${user.id}/stats`);
        const calls = Array.isArray(data?.recentCalls) ? data.recentCalls : [];
        setRecentCalls(calls);
      } catch (error) {
        setRecentCalls([]);
        setRecentCallsError(error?.message || '최근 통화를 불러오지 못했습니다.');
      } finally {
        setRecentCallsLoading(false);
      }
    };

    fetchRecentCalls();
  }, [user?.id]);

  const syncStatus = async (nextStatus) => {
    const prevStatus = status;
    setStatus(nextStatus);

    if (!user?.id) return;

    const mapped = mapStatusToApi(nextStatus);
    if (!mapped) return;

    try {
      await request(`/api/v1/members/${user.id}/status`, {
        method: 'PUT',
        body: { status: mapped }
      });

      const refreshed = await request(`/api/v1/members/${user.id}`);
      const normalized = mapStatusFromApi(refreshed?.status);
      setStatus(normalized || nextStatus);
    } catch (error) {
      setStatus(prevStatus);
      addToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const openCopilot = (payload) => {
    // emitCallConnected(payload); // 기존 pending 로직 대신
    openWithCall(payload); // 바로 모달 열기 및 모니터링 시작
    addToast('CoPilot 가이드가 실행되었습니다.', 'success');
  };

  const openCallLog = async (callId) => {
    setCallLogOpen(true);
    setCallLogLoading(true);
    setCallLogError('');
    setCallLogDetail(null);

    try {
      const detail = await request(`/api/v1/calls/${callId}/detail`);
      setCallLogDetail(detail);
    } catch (error) {
      setCallLogError(error?.message || '통화 기록을 불러오지 못했습니다.');
    } finally {
      setCallLogLoading(false);
    }
  };

  // [NEW] Notification Service Integration
  useEffect(() => {
    const fetchStatus = async () => {
      if (!user?.id) return;
      try {
        const member = await request(`/api/v1/members/${user.id}`);
        const normalized = mapStatusFromApi(member?.status);
        if (normalized) {
          setStatus(normalized);
        }
      } catch (error) {
        addToast('상태 정보를 불러오지 못했습니다.', 'error');
      }
    };

    fetchStatus();
  }, [user?.id]);

  useEffect(() => {
    // 임시 User ID 사용 (실제로는 로그인 정보에서 가져와야 함)
    const userId = "agent_user_01";
    notificationService.connect(userId);

    const handleCallStart = (data) => {
      console.log("Dashboard: Call Started Event", data);

      // 알림 메시지 표시
      addToast(`새로운 상담 전화가 연결되었습니다. (Call ID: ${data.callId})`, 'info');

      syncStatus('busy');

      // CoPilot 자동 실행
      openCopilot({
        callId: data.callId,
        customerName: data.customer_info?.name || '고객',
        issue: '실시간 상담 (Incoming Call)',
        channel: 'Voice'
      });
    };

    notificationService.on("CALL_STARTED", handleCallStart);

    return () => {
      notificationService.off("CALL_STARTED", handleCallStart);
      notificationService.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    const handleConnected = () => syncStatus('busy');
    const handleEnded = () => syncStatus('online');

    callEventBus.addEventListener('CALL_CONNECTED', handleConnected);
    callEventBus.addEventListener('CALL_ENDED', handleEnded);

    return () => {
      callEventBus.removeEventListener('CALL_CONNECTED', handleConnected);
      callEventBus.removeEventListener('CALL_ENDED', handleEnded);
    };
  }, [user?.id]);

  const handleQuickAction = (action) => {
    addToast(`${action} 기능이 실행되었습니다. (Dev Mock)`, 'info');
  };

  const handleChatSubmit = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), author: '나', text: trimmed }
    ]);
    setChatInput('');
  };

  const handleAddSchedule = () => {
    if (!scheduleDraft.title.trim()) return;
    setScheduleItems((prev) => [
      ...prev,
      {
        time: '',
        title: scheduleDraft.title.trim(),
        tag: scheduleDraft.tag || '개인',
        dueDate: scheduleDraft.dueDate
      }
    ]);
    setScheduleDraft({ tag: '개인', title: '', dueDate: '' });
  };

  const handleAddMemo = () => {
    const trimmed = memoInput.trim();
    if (!trimmed) return;
    setMemoItems((prev) => [
      { id: Date.now(), text: trimmed },
      ...prev
    ]);
    setMemoInput('');
  };

  const StatusButton = ({ type, label, icon: Icon, color }) => (
    <button
      onClick={() => setStatus(type)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === type
        ? `bg-${color}-50 border-${color}-200 text-${color}-700 ring-2 ring-${color}-100 ring-offset-1`
        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
        }`}
    >
      <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );

  const currentData = period === 'week' ? perfWeek : perfMonth;
  const latest = currentData[currentData.length - 1];
  const previous = currentData[currentData.length - 2] || latest;

  const trendValue = (key) => {
    const prev = previous?.[key] ?? 0;
    const curr = latest?.[key] ?? 0;
    const diff = curr - prev;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff}`;
  };

  const getCompareValues = (key) => {
    const values = currentData.map((item) => Number(item[key]) || 0).slice(-2);
    if (values.length === 1) return { prev: values[0], curr: values[0], max: values[0] || 1 };
    const [prev, curr] = values;
    const max = Math.max(prev, curr, 1);
    return { prev, curr, max };
  };

  const compareChartData = useMemo(() => (
    [
      { key: 'calls', label: '통화 수', unit: '건' },
      { key: 'csat', label: '만족도', unit: '점' },
      { key: 'avgDuration', label: '평균 통화시간', unit: '초' }
    ].map((metric) => {
      const { prev, curr } = getCompareValues(metric.key);
      return {
        label: metric.label,
        prev,
        curr,
        unit: metric.unit
      };
    })
  ), [currentData]);

  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500 font-bold">Dashboard</div>
          <div className="text-xl font-black text-slate-900 mt-1">상담원 대시보드</div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
          <button
            onClick={() => syncStatus('online')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === 'online'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm font-bold'
              : 'border-transparent text-slate-500 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs">상담 대기</span>
          </button>
          <button
            onClick={() => syncStatus('busy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === 'busy'
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm font-bold'
              : 'border-transparent text-slate-500 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <span className="text-xs">용무 중</span>
          </button>
          <button
            onClick={() => syncStatus('offline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === 'offline'
              ? 'bg-slate-100 border-slate-300 text-slate-700 shadow-sm font-bold'
              : 'border-transparent text-slate-500 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'offline' ? 'bg-slate-500' : 'bg-slate-300'}`} />
            <span className="text-xs">자리 비움</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Kpi
          title="오늘 총 통화"
          value={kpiData?.operations?.totalCallsProcessed ? `${kpiData.operations.totalCallsProcessed}건` : '-'}
          icon={<Phone size={20} className="text-indigo-500" />}
          trend
          trendValue="+12%"
          trendUp={true}
        />
        <Kpi
          title="CSAT (만족도)"
          value={kpiData?.summary?.csat ? `${kpiData.summary.csat}점` : '-'}
          icon={<CheckCircle size={20} className="text-emerald-500" />}
          trend
          trendValue="+5pts"
          trendUp={true}
        />
        <Kpi
          title="일정 준수율"
          value={kpiData?.operations?.avgCallDuration ? `${kpiData.operations.avgCallDuration}초` : '-'}
          icon={<Clock size={20} className="text-purple-500" />}
          trend
          trendValue="-2%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">최근 통화</div>
            </div>
            <div className="mt-4 space-y-3">
              {recentCallsLoading ? (
                <EmptyState title="불러오는 중" description="최근 통화를 불러오고 있습니다." className="py-8" />
              ) : recentCallsError ? (
                <EmptyState title="불러오기 실패" description={recentCallsError} className="py-8" />
              ) : recentCalls.length === 0 ? (
                <EmptyState title="최근 통화 없음" description="표시할 최근 통화가 없습니다." className="py-8" />
              ) : (
                recentCalls.slice(0, 3).map((call) => (
                  <CallItem
                    key={call.callId}
                    title={call.summaryText || '최근 통화'}
                    meta={`${call.callId} · ${formatTime(call.startTime)}`}
                    onOpen={() => openCallLog(call.callId)}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            {quickView === 'grid' ? (
              <>
                <div className="text-sm font-extrabold mb-4">빠른 실행</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setQuickView('calendar')}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
                  >
                    <Calendar size={20} />
                    <span className="text-xs font-bold">캘린더</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickView('memo')}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
                  >
                    <StickyNote size={20} />
                    <span className="text-xs font-bold">메모장</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickView('schedule')}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
                  >
                    <CalendarCheck size={20} />
                    <span className="text-xs font-bold">일정 관리</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickView('chat')}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100"
                  >
                    <MessageSquare size={20} />
                    <span className="text-xs font-bold">팀 채팅</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickView('grid')}
                    className="h-7 w-7 rounded-xl border border-slate-200 text-xs hover:bg-slate-50"
                  >
                    ←
                  </button>
                  <div className="text-sm font-extrabold">
                    {quickView === 'calendar' && '캘린더'}
                    {quickView === 'memo' && '메모장'}
                    {quickView === 'schedule' && '일정 관리'}
                    {quickView === 'chat' && '팀 채팅'}
                  </div>
                </div>
                {quickView === 'calendar' && (
                    <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
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
                    <div className="grid grid-cols-7 gap-2 text-[11px] text-slate-400 font-semibold">
                      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                        <div key={day} className="text-center">{day}</div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2 text-[11px] text-slate-600">
                      {Array.from({ length: totalCells }).map((_, idx) => {
                        const dayNumber = idx - firstDayOfWeek + 1;
                        const isInMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                        const isToday = isInMonth && todayDate === dayNumber;
                        return (
                          <div
                            key={idx}
                            className={`h-8 rounded-lg border ${isInMonth ? (isToday ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-extrabold ring-2 ring-indigo-100' : 'bg-slate-50 border-slate-100') : 'border-transparent'}`}
                          >
                            <div className="text-center leading-8">{isInMonth ? dayNumber : ''}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {quickView === 'memo' && (
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
                      <div className="text-xs font-bold text-slate-600 mb-2">메모 작성</div>
                      <textarea
                        className="w-full min-h-[90px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        placeholder="메모를 입력하세요..."
                        value={memoInput}
                        onChange={(event) => setMemoInput(event.target.value)}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddMemo}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
                        >
                          메모 추가
                        </button>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white/80 p-3">
                      <div className="text-xs font-bold text-slate-600 mb-2">내 메모</div>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto">
                        {memoItems.map((memo) => (
                          <div key={memo.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            {memo.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {quickView === 'schedule' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-500">일정 추가</div>
                      <button
                        type="button"
                        onClick={handleAddSchedule}
                        className="h-7 w-7 rounded-full border border-slate-200 text-xs font-bold hover:bg-slate-50"
                        title="일정 추가"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        placeholder="내용 입력"
                        value={scheduleDraft.title}
                        onChange={(event) => setScheduleDraft((prev) => ({ ...prev, title: event.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={scheduleDraft.dueDate}
                        onChange={(event) => setScheduleDraft((prev) => ({ ...prev, dueDate: event.target.value }))}
                      />
                      <select
                        className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white"
                        value={scheduleDraft.tag}
                        onChange={(event) => setScheduleDraft((prev) => ({ ...prev, tag: event.target.value }))}
                      >
                        <option value="개인">개인</option>
                        <option value="팀">팀</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      {scheduleItems.map((item, index) => (
                        <div key={`${item.time}-${item.tag}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-3 py-2">
                          <div>
                            <div className="text-xs font-bold text-slate-700">{item.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.dueDate || `#${index + 1}`}</div>
                          </div>
                          <span className="text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-600 px-2 py-1">{item.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {quickView === 'chat' && (
                  <>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`rounded-xl border px-3 py-2 text-xs ${msg.author === '나'
                            ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                            : 'bg-white border-slate-100 text-slate-700'
                            }`}
                        >
                          <div className="font-bold text-[11px] mb-0.5">{msg.author}</div>
                          <div>{msg.text}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        placeholder="메시지 입력..."
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                            handleChatSubmit();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleChatSubmit}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
                      >
                        전송
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">성과 지표 분석</div>
              <div className="text-xs text-slate-500 mt-1">통화 수 · 만족도 · 평균 통화시간</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod(period === 'week' ? 'month' : 'week')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${period === 'week' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'
                  }`}
              >
                {period === 'week' ? 'Last 4 Weeks' : 'Quarterly'}
              </button>
            </div>
          </div>

          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareChartData} barSize={26} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} strokeOpacity={0.7} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => {
                    const unit = props?.payload?.unit || '';
                    return [`${value}${unit}`, name === 'prev' ? '저번주' : '이번주'];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (value === 'prev' ? '저번주' : '이번주')}
                />
                <Bar dataKey="prev" fill="#BFD7ED" radius={[10, 10, 0, 0]} />
                <Bar dataKey="curr" fill="#F7C5CC" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
      </div>
      <CallLogModal
        open={callLogOpen}
        onOpenChange={setCallLogOpen}
        call={callLogDetail}
        loading={callLogLoading}
        error={callLogError}
      />
    </>
  );
}

function Kpi({ title, value, icon, trend, trendValue, trendUp }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-soft flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500 font-semibold">{title}</div>
        <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
      </div>
      {icon && <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">{icon}</div>}
    </div>
  );
}

function CallItem({ title, meta, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left rounded-2xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition"
    >
      <div className="font-extrabold">{title}</div>
      <div className="text-xs text-slate-500 mt-1">{meta}</div>
    </button>
  );
}


function formatTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function mapStatusToApi(status) {
  if (status === 'online') return 'ACTIVE';
  if (status === 'busy') return 'ON_CALL';
  if (status === 'offline') return 'AWAY';
  return null;
}

function mapStatusFromApi(status) {
  if (status === 'ACTIVE') return 'online';
  if (status === 'ON_CALL') return 'busy';
  if (status === 'AWAY') return 'offline';
  return null;
}
