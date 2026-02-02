import { useState, useEffect } from 'react';
import { notificationService } from '../../services/NotificationService.js';
import Card from '../../components/Card.jsx';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { emitCallConnected } from '../../features/calls/callEvents.js';
import { mockCalls } from '../../features/calls/mockCalls.js';
import { useToast } from '../../components/common/ToastProvider.jsx';
import { CheckCircle, Clock, Moon, AlertCircle, Phone, BookOpen, FileText, Zap, MessageSquare, Headphones, TrendingUp, TrendingDown } from 'lucide-react';
import { useCoPilot } from '../../features/copilot/CoPilotProvider.jsx';
import { dashboardService } from '../../api/dashboardService.js';

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
  const { openWithCall } = useCoPilot();
  const { addToast } = useToast();
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [period, setPeriod] = useState('week'); // 'week' | 'month'
  const [status, setStatus] = useState('online'); // online | busy | offline

  // [NEW] Member KPI Data State
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchMemberKpis = async () => {
      try {
        // Test Member ID used for dev
        const data = await dashboardService.getMemberKpi(1);
        setKpiData(data);
      } catch (error) {
        console.error("Failed to fetch Member KPIs", error);
      }
    };
    fetchMemberKpis();
  }, []);

  const openCopilot = (payload) => {
    // emitCallConnected(payload); // 기존 pending 로직 대신
    openWithCall(payload); // 바로 모달 열기 및 모니터링 시작
    addToast('CoPilot 가이드가 실행되었습니다.', 'success');
  };

  // [NEW] Notification Service Integration
  useEffect(() => {
    // 임시 User ID 사용 (실제로는 로그인 정보에서 가져와야 함)
    const userId = "agent_user_01";
    notificationService.connect(userId);

    const handleCallStart = (data) => {
      console.log("Dashboard: Call Started Event", data);

      // 알림 메시지 표시
      addToast(`새로운 상담 전화가 연결되었습니다. (Call ID: ${data.callId})`, 'info');

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
  }, []);

  const handleQuickAction = (action) => {
    addToast(`${action} 기능이 실행되었습니다. (Dev Mock)`, 'info');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500 font-bold">Dashboard</div>
          <div className="text-xl font-black text-slate-900 mt-1">상담원 대시보드</div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
          <button
            onClick={() => setStatus('online')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === 'online'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm font-bold'
              : 'border-transparent text-slate-500 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs">상담 대기</span>
          </button>
          <button
            onClick={() => setStatus('busy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${status === 'busy'
              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm font-bold'
              : 'border-transparent text-slate-500 hover:bg-slate-50 font-medium'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'}`} />
            <span className="text-xs">용무 중</span>
          </button>
          <button
            onClick={() => setStatus('offline')}
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
              <button className="text-xs font-bold text-indigo-600 hover:underline">전체보기</button>
            </div>
            <div className="mt-4 space-y-3">
              {mockCalls.slice(0, 3).map((call) => (
                <CallItem
                  key={call.id}
                  title={call.title}
                  meta={`${call.id} · ${call.datetime.split(' ')[1]}`}
                  onOpen={() =>
                    openCopilot({
                      callId: call.id,
                      customerName: '홍길동',
                      issue: call.title,
                      channel: '전화(CTI)'
                    })
                  }
                />
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="text-sm font-extrabold mb-4">빠른 실행 (Quick Actions)</div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleQuickAction('스크립트 조회')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                <FileText size={20} />
                <span className="text-xs font-bold">스크립트</span>
              </button>
              <button onClick={() => handleQuickAction('지식 베이스 검색')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                <BookOpen size={20} />
                <span className="text-xs font-bold">지식 베이스</span>
              </button>
              <button onClick={() => handleQuickAction('이슈 리포팅')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                <AlertCircle size={20} />
                <span className="text-xs font-bold">이슈 리포트</span>
              </button>
              <button onClick={() => handleQuickAction('상담원 채팅')} className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100">
                <MessageSquare size={20} />
                <span className="text-xs font-bold">팀 채팅</span>
              </button>
            </div>
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

        {/* Action Items Section */}
        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-extrabold flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              <span>필수 조치 항목 (My Action Items)</span>
            </div>
            <div className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">3건 남음</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group hover:border-indigo-200 hover:bg-white transition cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="px-2 py-1 bg-rose-100 text-rose-600 rounded text-[10px] font-bold">긴급</div>
                <CheckCircle size={16} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
              <div className="text-sm font-bold text-slate-800 mb-1">QA 피드백 확인 필요</div>
              <div className="text-xs text-slate-500">어제 16:30분 건에 대한 개선 피드백이 도착했습니다.</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group hover:border-indigo-200 hover:bg-white transition cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded text-[10px] font-bold">교육</div>
                <CheckCircle size={16} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
              <div className="text-sm font-bold text-slate-800 mb-1">신규 상품 안내 교육</div>
              <div className="text-xs text-slate-500">신규 인터넷 결합 상품에 대한 온라인 교육을 이수하세요.</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group hover:border-indigo-200 hover:bg-white transition cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">일반</div>
                <CheckCircle size={16} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
              <div className="text-sm font-bold text-slate-800 mb-1">콜백 요청 (2건)</div>
              <div className="text-xs text-slate-500">부재중 요청 고객에 대한 콜백이 필요합니다.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ title, value, icon, trend, trendValue, trendUp }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-soft flex items-center justify-between">
      <div>
        <div className="text-xs text-slate-500 font-semibold">{title}</div>
        <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trendValue}</span>
            <span className="text-slate-400 font-medium ml-1">vs last week</span>
          </div>
        )}
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