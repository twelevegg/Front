import Card from '../../components/Card.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { emitCallConnected } from '../../features/calls/callEvents.js';

const data = [
  { week: 'W-4', qa: 80, success: 81, adherence: 90 },
  { week: 'W-3', qa: 81, success: 82, adherence: 91 },
  { week: 'W-2', qa: 82, success: 83, adherence: 92 },
  { week: 'W-1', qa: 83, success: 84, adherence: 92 }
];

export default function AssistantDashboardPage() {
  const openCopilot = (payload) => emitCallConnected(payload);

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
              <div className="text-xs text-slate-500 mt-1">QA / 성공률 / 준수율(예시)</div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold">최근 4주</span>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold">Line</span>
            </div>
          </div>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="qa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="success" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="adherence" strokeWidth={2} dot={false} />
              </LineChart>
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
