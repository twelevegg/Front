import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/NotificationService.js';
import Card from '../../components/Card.jsx';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { callEventBus } from '../../features/calls/callEvents.js';
import { useToast } from '../../components/common/ToastProvider.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { CheckCircle, Clock, Moon, AlertCircle, Phone, BookOpen, FileText, Zap, MessageSquare, Headphones, TrendingUp, TrendingDown } from 'lucide-react';
import { useCoPilot } from '../../features/copilot/CoPilotProvider.jsx';
import { dashboardService } from '../../api/dashboardService.js';
import { request } from '../../services/http.js';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import CallLogModal from '../../features/calls/CallLogModal.jsx';

const dataWeek = [
  { label: 'W-4', qa: 80, success: 81, adherence: 90 },
  { label: 'W-3', qa: 81, success: 82, adherence: 91 },
  { label: 'W-2', qa: 82, success: 83, adherence: 92 },
  { label: 'W-1', qa: 83, success: 84, adherence: 92 }
];

const dataMonth = [
  { label: 'Jan', qa: 78, success: 75, adherence: 88 },
  { label: 'Feb', qa: 82, success: 80, adherence: 90 },
  { label: 'Mar', qa: 85, success: 85, adherence: 93 },
];

export default function AssistantDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openWithCall } = useCoPilot();
  const { addToast } = useToast();
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [period, setPeriod] = useState('week'); // 'week' | 'month'
  const [status, setStatus] = useState('online'); // online | busy | offline
  const [recentCalls, setRecentCalls] = useState([]);
  const [recentCallsLoading, setRecentCallsLoading] = useState(true);
  const [recentCallsError, setRecentCallsError] = useState('');
  const [callLogOpen, setCallLogOpen] = useState(false);
  const [callLogDetail, setCallLogDetail] = useState(null);
  const [callLogLoading, setCallLogLoading] = useState(false);
  const [callLogError, setCallLogError] = useState('');
  const [isTeamChatView, setIsTeamChatView] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, author: '영호', text: '팀채팅은 개발이 완료 된건가요?' },
    { id: 2, author: '대규', text: '아니요, 시간 부족으로 UI만 구현된 상태입니다.' }
  ]);

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

  const currentData = period === 'week' ? dataWeek : dataMonth;

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
          value={kpiData?.agentProductivity?.scheduleAdherence ? `${kpiData.agentProductivity.scheduleAdherence}%` : '-'}
          icon={<BookOpen size={20} className="text-purple-500" />}
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
            {!isTeamChatView ? (
              <>
                <div className="text-sm font-extrabold mb-4">빠른 실행 (Quick Actions)</div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => navigate('/call-history')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                    <FileText size={20} />
                    <span className="text-xs font-bold">Call history</span>
                  </button>
                  <button onClick={() => navigate('/case-library')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                    <BookOpen size={20} />
                    <span className="text-xs font-bold">Case library</span>
                  </button>
                  <button onClick={() => navigate('/training/ppt')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                    <AlertCircle size={20} />
                    <span className="text-xs font-bold">Training center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeamChatView(true)}
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
                    onClick={() => setIsTeamChatView(false)}
                    className="h-7 w-7 rounded-xl border border-slate-200 text-xs hover:bg-slate-50"
                  >
                    ←
                  </button>
                  <div className="text-sm font-extrabold">팀 채팅</div>
                </div>
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
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">성과 지표 분석</div>
              <div className="text-xs text-slate-500 mt-1">QA / 성공률 / 준수율</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod(period === 'week' ? 'month' : 'week')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${period === 'week' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'
                  }`}
              >
                {period === 'week' ? 'Last 4 Weeks' : 'Quarterly'}
              </button>
              <button
                onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${chartType === 'line' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'
                  }`}
              >
                {chartType === 'line' ? 'Line View' : 'Bar View'}
              </button>
            </div>
          </div>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line type="monotone" dataKey="qa" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="adherence" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                </LineChart>
              ) : (
                <BarChart data={currentData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="qa" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="adherence" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
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
