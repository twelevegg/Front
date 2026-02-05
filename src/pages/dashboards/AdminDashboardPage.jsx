import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import Card from '../../components/Card.jsx';
import Badge from '../../components/Badge.jsx';
import Pill from '../../components/Pill.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useToast } from '../../components/common/ToastProvider.jsx';
import { dashboardService } from '../../api/dashboardService.js';
import { memberService } from '../../api/memberService.js';

import { TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [newHires, setNewHires] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [memberKpi, setMemberKpi] = useState(null);
  const [memberKpiLoading, setMemberKpiLoading] = useState(false);
  const [memberKpiError, setMemberKpiError] = useState('');
  const [compareMetricKey, setCompareMetricKey] = useState('csat');
  const [newHireKpis, setNewHireKpis] = useState({});
  const [newHireKpisLoading, setNewHireKpisLoading] = useState(false);
  const [newHireKpisError, setNewHireKpisError] = useState('');

  // [NEW] Real KPI Data State
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await dashboardService.getGlobalKpi();
        setKpiData(data);
      } catch (error) {
        console.error("Failed to fetch KPIs", error);
        // addToast('KPI 데이터를 불러오는데 실패했습니다.', 'error'); // Optional: notify on error
      }
    };
    fetchKpis();
  }, []);

  useEffect(() => {
    const fetchNewHires = async () => {
      try {
        const data = await memberService.getNewHires(3);
        setNewHires(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch new hires', error);
        setNewHires([]);
      }
    };
    fetchNewHires();
  }, []);

  useEffect(() => {
    if (newHires.length > 0) {
      setSelected((prev) => prev ?? newHires[0]);
      return;
    }
    setSelected(null);
  }, [newHires]);

  useEffect(() => {
    const fetchMemberKpi = async () => {
      if (!selected?.id) {
        setMemberKpi(null);
        setMemberKpiLoading(false);
        setMemberKpiError('');
        return;
      }

      setMemberKpiLoading(true);
      setMemberKpiError('');

      try {
        const data = await dashboardService.getMemberKpi(selected.id);
        setMemberKpi(data);
      } catch (error) {
        console.error('Failed to fetch member KPI', error);
        setMemberKpi(null);
        setMemberKpiError('KPI 데이터를 불러오지 못했습니다.');
      } finally {
        setMemberKpiLoading(false);
      }
    };

    fetchMemberKpi();
  }, [selected?.id]);

  const filtered = useMemo(() => {
    let list = newHires;
    const q = query.trim();
    if (q) {
      list = list.filter((c) => `${c.name} ${c.id}`.includes(q));
    }
    return list;
  }, [query, newHires]);

  const formatHireDate = (value) => {
    if (!value) return '-';
    return value.replaceAll('-', '.');
  };

  const getTenureDays = (value) => {
    if (!value) return null;
    const start = new Date(`${value}T00:00:00`);
    const today = new Date();
    const diffMs = today.setHours(0, 0, 0, 0) - start.getTime();
    if (Number.isNaN(diffMs)) return null;
    return Math.max(0, Math.floor(diffMs / 86400000));
  };

  const kpiMetricOptions = useMemo(() => ([
    { key: 'fcr', label: '최초 해결률', path: ['summary', 'fcr'] },
    { key: 'nps', label: '순추천 지수', path: ['summary', 'nps'] },
    { key: 'ces', label: '고객 노력 지수', path: ['summary', 'ces'] },
    { key: 'csat', label: '만족도', path: ['summary', 'csat'] },
    { key: 'sentiment', label: '감정 점수', path: ['summary', 'sentimentScore'] },
    { key: 'frt', label: '최초 응답 시간', path: ['callPerformance', 'frt'] },
    { key: 'blockedRate', label: '통화 차단율', path: ['callPerformance', 'blockedCallRate'] },
    { key: 'abandonRate', label: '통화 포기율', path: ['callPerformance', 'abandonmentRate'] },
    { key: 'activeWaiting', label: '대기 통화', path: ['callPerformance', 'activeWaitingCalls'] },
    { key: 'totalCalls', label: '총 처리 통화', path: ['operations', 'totalCallsProcessed'] },
    { key: 'cpc', label: '통화당 비용', path: ['operations', 'cpc'] },
    { key: 'callArrival', label: '통화 착신율', path: ['operations', 'callArrivalRate'] },
    { key: 'maxWait', label: '최장 대기', path: ['operations', 'maxWaitTime'] },
    { key: 'avgDuration', label: '평균 통화 시간', path: ['operations', 'avgCallDuration'] },
    { key: 'avgResolution', label: '평균 처리 시간', path: ['operations', 'avgResolutionTime'] },
    { key: 'repeatCall', label: '반복 통화율', path: ['operations', 'repeatCallRate'] },
    { key: 'selfService', label: '셀프서비스 비율', path: ['operations', 'selfServiceRate'] },
    { key: 'attrition', label: '이직률', path: ['agentProductivity', 'attritionRate'] },
    { key: 'occupancy', label: '상담원 활용률', path: ['agentProductivity', 'occupancyRate'] },
    { key: 'adherence', label: '일정 준수율', path: ['agentProductivity', 'scheduleAdherence'] },
    { key: 'callsPerHour', label: '시간당 통화', path: ['agentProductivity', 'callsPerHour'] },
    { key: 'asa', label: '평균 응답 속도', path: ['agentProductivity', 'asa'] },
    { key: 'aht', label: '평균 처리 시간(AHT)', path: ['agentProductivity', 'aht'] },
    { key: 'avgHold', label: '평균 보류 시간', path: ['agentProductivity', 'avgHoldTime'] },
    { key: 'transferRate', label: '호 전환율', path: ['agentProductivity', 'transferRate'] },
    { key: 'avgAcw', label: '평균 후처리 시간', path: ['agentProductivity', 'avgAcwTime'] }
  ]), []);

  const chartMetricOptions = useMemo(() => ([
    { key: 'csat', label: '만족도', path: ['summary', 'csat'] },
    { key: 'fcr', label: '최초 해결률', path: ['summary', 'fcr'] },
    { key: 'adherence', label: '일정 준수율', path: ['agentProductivity', 'scheduleAdherence'] },
    { key: 'occupancy', label: '상담원 활용률', path: ['agentProductivity', 'occupancyRate'] }
  ]), []);

  const getKpiValue = (kpi, metric) => {
    if (!kpi || !metric?.path) return null;
    return metric.path.reduce((acc, key) => (acc ? acc[key] : null), kpi);
  };

  const memberKpiChartData = useMemo(() => {
    if (!memberKpi) return [];
    return chartMetricOptions
      .map((metric) => ({
        key: metric.key,
        label: metric.label,
        value: getKpiValue(memberKpi, metric)
      }))
      .filter((metric) => metric.value !== null && metric.value !== undefined)
      .map((metric) => ({
        ...metric,
        value: Number.isFinite(metric.value) ? metric.value : 0
      }));
  }, [memberKpi, chartMetricOptions]);

  const sparkPalette = ['#A7C7E7', '#F7C5CC', '#CDEAC0', '#FEE3C5', '#C7D2FE', '#BFD7ED'];

  const formatKpiValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (Number.isNaN(Number(value))) return String(value);
    return Number.isInteger(value) ? value : Number(value).toFixed(1);
  };

  const maxKpiValue = useMemo(() => {
    if (memberKpiChartData.length === 0) return 1;
    return Math.max(...memberKpiChartData.map((metric) => Number(metric.value) || 0), 1);
  }, [memberKpiChartData]);

  const compareMetric = useMemo(() => (
    kpiMetricOptions.find((metric) => metric.key === compareMetricKey) || null
  ), [compareMetricKey, kpiMetricOptions]);

  const compareData = useMemo(() => {
    if (!compareMetric) return [];
    return newHires.map((hire) => {
      const kpi = newHireKpis[hire.id];
      const value = getKpiValue(kpi, compareMetric);
      return {
        id: hire.id,
        name: hire.name || String(hire.id),
        value: Number.isFinite(value) ? value : 0
      };
    });
  }, [compareMetric, newHires, newHireKpis]);

  const compareBarColor = useMemo(() => {
    if (!compareMetricKey) return '#C7D2FE';
    const matchIndex = chartMetricOptions.findIndex((metric) => metric.key === compareMetricKey);
    if (matchIndex >= 0) {
      return sparkPalette[matchIndex % sparkPalette.length];
    }
    return '#C7D2FE';
  }, [compareMetricKey, chartMetricOptions, sparkPalette]);

  useEffect(() => {
    const fetchNewHireKpis = async () => {
      if (!compareMetricKey || newHires.length === 0) {
        setNewHireKpisLoading(false);
        setNewHireKpisError('');
        return;
      }

      setNewHireKpisLoading(true);
      setNewHireKpisError('');

      try {
        const results = await Promise.all(
          newHires.map(async (hire) => {
            try {
              const kpi = await dashboardService.getMemberKpi(hire.id);
              return [hire.id, kpi];
            } catch (error) {
              return [hire.id, null];
            }
          })
        );
        const nextMap = results.reduce((acc, [id, kpi]) => {
          acc[id] = kpi;
          return acc;
        }, {});
        setNewHireKpis(nextMap);
      } catch (error) {
        setNewHireKpisError('신입 사원 KPI 비교 데이터를 불러오지 못했습니다.');
      } finally {
        setNewHireKpisLoading(false);
      }
    };

    fetchNewHireKpis();
  }, [compareMetricKey, newHires]);

  const handleAction = (action) => {
    if (!selected) {
      return;
    }
    addToast(`${selected.name}님에게 ${action} 요청을 전송했습니다.`, 'success');
  };

  return (
    <div className="space-y-6">
        <div>
          <div className="text-sm text-slate-500">Dashboard</div>
          <div className="text-xl font-extrabold mt-1">관리자 대시보드</div>
          <div className="text-sm text-slate-500 mt-1">신입 사원 현황 · 스트레스 지수 · 폭언/욕설 알림</div>
        </div>

      {/* KPI Cards Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap w-full md:w-auto">
          <Kpi
            title="FCR (최초 해결률)"
            value={kpiData?.summary?.fcr ? `${kpiData.summary.fcr}%` : '-'}
            trend
            trendValue="+1.2%"
            trendUp={true}
          />
          <Kpi
            title="Avg CSAT (만족도)"
            value={kpiData?.summary?.csat ? `${kpiData.summary.csat}점` : '-'}
            trend
            trendValue="+2.1"
            trendUp={true}
          />
          <Kpi
            title="NPS (추천 지수)"
            value={kpiData?.summary?.nps ? `${kpiData.summary.nps}점` : '-'}
            trend
            trendValue="+0.5"
            trendUp={true}
          />
          <Kpi
            title="Sentiment (감정)"
            value={kpiData?.summary?.sentimentScore ? `${kpiData.summary.sentimentScore}` : '-'}
            trend
            trendValue="+0.1"
            trendUp={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-6">
        <Card className="p-5">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">신입 사원</div>
            </div>
            <SearchInput placeholder="신입 사원 검색..." value={query} onChange={setQuery} className="w-full" />
          </div>
          <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <EmptyState
                title="신입 사원 없음"
                description="최근 3개월 내 입사한 상담원이 없습니다."
                className="py-8"
              />
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`w-full text-left rounded-2xl border px-4 py-3 transition hover:bg-slate-50 ${selected?.id === c.id ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-extrabold">{c.name}</div>
                        <Badge label="신입" tone="Normal" />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {c.id} · 입사 {formatHireDate(c.hireDate)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold">{getTenureDays(c.hireDate) ?? '-'}</div>
                      <div className="text-xs text-slate-400">days</div>
                    </div>
                  </div>
                </button>
              ))
            )
            }
          </div>
        </Card>

        <Card className="p-5">
          {selected ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-lg font-black text-slate-800">{selected.name}</div>
                  <div className="text-sm text-slate-500 font-medium mt-1">
                    {selected.id} · 입사 {formatHireDate(selected.hireDate)}
                  </div>
                </div>

                {/* Redesigned Stat Blocks */}
                <div className="flex items-center divide-x divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100 p-1">
                  <div className="px-5 py-2 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Hire Date</div>
                    <div className="text-lg font-black text-slate-700">
                      {formatHireDate(selected.hireDate)}
                    </div>
                  </div>
                  <div className="px-5 py-2 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Tenure</div>
                    <div className="text-lg font-black text-indigo-600">
                      {getTenureDays(selected.hireDate) ?? '-'} <span className="text-xs font-bold text-slate-400">days</span>
                    </div>
                  </div>
                </div>
              </div>

              {memberKpiLoading ? (
                <EmptyState
                  title="KPI 불러오는 중"
                  description="선택한 신입 사원의 KPI를 불러오고 있습니다."
                  className="mt-6 rounded-2xl border border-slate-100 h-[260px]"
                />
              ) : memberKpiError ? (
                <EmptyState
                  title="KPI 불러오기 실패"
                  description={memberKpiError}
                  className="mt-6 rounded-2xl border border-slate-100 h-[260px]"
                />
              ) : memberKpiChartData.length === 0 ? (
                <EmptyState
                  title="KPI 데이터 없음"
                  description="표시할 KPI 데이터가 없습니다."
                  className="mt-6 rounded-2xl border border-slate-100 h-[260px]"
                />
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-100 bg-white h-[260px] p-4 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                  <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={memberKpiChartData} barSize={26} margin={{ top: 18, right: 12, left: 0, bottom: 6 }}>
                        <defs>
                          <linearGradient id="kpiGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} strokeOpacity={0.7} />
                        <XAxis
                          dataKey="label"
                          axisLine={false}
                          tickLine={false}
                          interval={0}
                          angle={-20}
                          height={40}
                          textAnchor="end"
                          tick={{ fontSize: 10, fill: '#64748b' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#94a3b8' }}
                          domain={[0, maxKpiValue]}
                          tickCount={6}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                          itemStyle={{ color: '#334155', fontWeight: 600 }}
                          labelStyle={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}
                        />
                        <Bar dataKey="value" radius={[10, 10, 4, 4]} onClick={(data) => setCompareMetricKey(data?.payload?.key || '')}>
                          {memberKpiChartData.map((entry, index) => (
                            <Cell key={entry.label} fill={sparkPalette[index % sparkPalette.length]} />
                          ))}
                          <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(value) => `${formatKpiValue(value)}`}
                            fill="#475569"
                            fontSize={10}
                            fontWeight={700}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Users}
              title="상담사 선택"
              description="좌측 목록에서 상담사를 선택하여 상세 정보를 확인하세요."
              className="h-full"
            />
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold">
            {compareMetric ? '신입 사원 KPI 비교' : '폭언/욕설 실시간 알림'}
          </div>
          {compareMetric ? (
            <div className="flex items-center gap-2">
              <select
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 text-slate-600 bg-white"
                value={compareMetricKey}
                onChange={(event) => setCompareMetricKey(event.target.value)}
              >
                {kpiMetricOptions.map((metric) => (
                  <option key={metric.key} value={metric.key}>{metric.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <Pill>Live</Pill>
            </div>
          )}
        </div>
        {compareMetric ? (
          newHireKpisLoading ? (
            <EmptyState
              title="비교 데이터 불러오는 중"
              description="선택한 KPI의 신입 사원 데이터를 불러오고 있습니다."
              className="py-10"
            />
          ) : newHireKpisError ? (
            <EmptyState
              title="비교 데이터 불러오기 실패"
              description={newHireKpisError}
              className="py-10"
            />
          ) : compareData.length === 0 ? (
            <EmptyState
              title="비교 데이터 없음"
              description="표시할 신입 사원 KPI 데이터가 없습니다."
              className="py-10"
            />
          ) : (
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[720px] h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compareData} barSize={30} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} strokeOpacity={0.7} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      angle={-15}
                      height={40}
                      textAnchor="end"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#334155', fontWeight: 600 }}
                      labelStyle={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 4, 4]}>
                      {compareData.map((entry) => (
                        <Cell key={entry.id} fill={compareBarColor} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="top"
                        formatter={(value) => `${formatKpiValue(value)}`}
                        fill="#475569"
                        fontSize={10}
                        fontWeight={700}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
        ) : alerts.length === 0 ? (
          <EmptyState
            title="알림 없음"
            description="현재 감지된 폭언/욕설 알림이 없습니다."
            className="py-10"
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <div className="bg-white p-2 rounded-xl text-xl shadow-sm">🚨</div>
                <div>
                  <div className="text-xs font-bold text-rose-700 mb-1">{alert.type.toUpperCase()} ALERT</div>
                  <div className="text-sm font-bold text-slate-800">{alert.msg}</div>
                  <div className="text-xs text-slate-400 mt-1">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Kpi({ title, value, trend, trendValue, trendUp }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 min-w-[190px] shadow-soft">
      <div className="text-xs text-slate-500 font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}
