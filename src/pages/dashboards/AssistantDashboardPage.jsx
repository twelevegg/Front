import { useState } from 'react';
import Card from '../../components/Card.jsx';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { emitCallConnected } from '../../features/calls/callEvents.js';
import { useToast } from '../../components/common/ToastProvider.jsx';

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
  const { addToast } = useToast();
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [period, setPeriod] = useState('week'); // 'week' | 'month'

  const openCopilot = (payload) => {
    emitCallConnected(payload);
    addToast('CoPilot 가이드가 실행되었습니다.', 'success');
  };

  const currentData = period === 'week' ? dataWeek : dataMonth;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Dashboard</div>
        <div className="text-xl font-extrabold mt-1">상담원 대시보드</div>
        <div className="text-sm text-slate-500 mt-2">간단 KPI 요약 + 최근 통화 + 성과 지표(예시)</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Kpi title="오늘 통화" value="17" />
        <Kpi title="QA(최근)" value="82" />
        <Kpi title="가이드라인 준수" value="92%" />
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <Card className="p-6">
          <div className="text-sm font-extrabold">최근 통화</div>
          <div className="mt-4 space-y-3">
            <CallItem
              title="요금 과다 청구/환불"
              meta="C-20260107-1041 · 2026-01-07 10:11"
              onOpen={() =>
                openCopilot({
                  callId: 'C-20260107-1041',
                  customerName: '홍길동',
                  issue: '요금 과다 청구/환불 요청',
                  channel: '전화(CTI)'
                })
              }
            />
            <CallItem
              title="인터넷 품질/해지 문의"
              meta="C-20260106-1658 · 2026-01-06 16:58"
              onOpen={() =>
                openCopilot({
                  callId: 'C-20260106-1658',
                  customerName: '홍길동',
                  issue: '인터넷 끊김/해지 요청',
                  channel: '전화(CTI)'
                })
              }
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">성과 지표 분석</div>
              <div className="text-xs text-slate-500 mt-1">QA / 성공률 / 준수율</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod(period === 'week' ? 'month' : 'week')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${period === 'week' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-500'
                  }`}
              >
                {period === 'week' ? 'Last 4 Weeks' : 'Quarterly'}
              </button>
              <button
                onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${chartType === 'line' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-500'
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
                  <Line type="monotone" dataKey="qa" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
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
                  <Bar dataKey="qa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="adherence" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-soft">
      <div className="text-xs text-slate-500 font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
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
