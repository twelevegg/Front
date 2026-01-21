import Card from '../../components/Card.jsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useMemo, useState } from 'react';
import { emitCallConnected } from '../../features/calls/callEvents.js';

/**
 * ✅ UI 전용 대시보드 모델(추후 백엔드/LLM 붙이기 좋은 형태)
 * - weekly: 최근 N주 추이 (weekKey 기준)
 * - recentCalls: 최근 통화 리스트
 * - categories: 최근 N주 카테고리별 통화 수
 * - aiInsights: AI 비교 분석 지표 (전문 상담사 역할 기반)
 */
const DASHBOARD_MOCK = {
  kpis: {
    todayCalls: 17,
    recentNWeeksCalls: 69,
    qa: 82,
    adherence: 92,
    aiMatch: 78 // 전문 상담사 AI 답변과 상담사 답변의 유사도/매칭(가정)
  },
  weekly: [
    { week: 'W-4', calls: 62, qa: 80, success: 81, adherence: 90 },
    { week: 'W-3', calls: 66, qa: 81, success: 82, adherence: 91 },
    { week: 'W-2', calls: 71, qa: 82, success: 83, adherence: 92 },
    { week: 'W-1', calls: 69, qa: 83, success: 84, adherence: 92 }
  ],
  categories: [
    { category: '요금/청구', count: 22 },
    { category: '해지/방어', count: 14 },
    { category: '인터넷 품질', count: 11 },
    { category: '요금제/가입', count: 9 },
    { category: '단말/AS', count: 7 },
    { category: '기타', count: 6 }
  ],
  aiInsights: {
    // 상담사 답변 vs 전문상담사 AI 답변 비교
    expertAnswerMatch: 0.78,
    keywordOverlap: 0.64,
    missedKeyPoints: ['해지 사유 확인', '대안 요금제 제안', '위약금 안내(근거)'],
    topKeywordsAgent: ['위약금', '해지', '약정', '요금제', '품질'],
    topKeywordsAI: ['해지방어', '대안 제시', '약정 조건', '요금 최적화', '품질 점검']
  },
  recentCalls: [
    {
      callId: 'C-20260107-1041',
      title: '요금 과다 청구/환불',
      timestamp: '2026-01-07 10:11',
      category: '요금/청구',
      customerName: '홍길동',
      issue: '요금 과다 청구/환불 요청',
      channel: '전화(CTI)'
    },
    {
      callId: 'C-20260106-1658',
      title: '인터넷 품질/해지 문의',
      timestamp: '2026-01-06 16:58',
      category: '해지/방어',
      customerName: '홍길동',
      issue: '인터넷 끊김/해지 요청',
      channel: '전화(CTI)'
    }
  ]
};

const RANGE_OPTIONS = [
  { label: '최근 4주', value: 4 },
  { label: '최근 8주', value: 8 },
  { label: '최근 12주', value: 12 }
];

export default function AssistantDashboardPage() {
  const [rangeWeeks, setRangeWeeks] = useState(4);

  // ✅ 실제로는 백엔드에서 rangeWeeks 기준으로 fetch
  const view = useMemo(() => {
    // UI-only: mock 데이터를 그대로 사용(추후 슬라이싱/서버 요청)
    return DASHBOARD_MOCK;
  }, [rangeWeeks]);

  const openCopilot = (call) => emitCallConnected(call);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Dashboard</div>
          <div className="text-xl font-extrabold mt-1">상담원 대시보드</div>
          <div className="text-sm text-slate-500 mt-2">
            최근 N주 활동 · CS KPI · 통화 분석 · AI(전문 상담사) 비교
          </div>
        </div>

        {/* 기간 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-500">기간</span>
          <select
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
            value={rangeWeeks}
            onChange={(e) => setRangeWeeks(Number(e.target.value))}
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Row (요약) */}
      <div className="grid grid-cols-5 gap-4">
        <Kpi title="오늘 통화" value={view.kpis.todayCalls} />
        <Kpi title={`최근 ${rangeWeeks}주 통화`} value={view.kpis.recentNWeeksCalls} />
        <Kpi title="QA(최근)" value={view.kpis.qa} />
        <Kpi title="AI 답변 매칭" value={`${view.kpis.aiMatch}%`}  />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-2 gap-6">
        {/* 통화 수 추이 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">통화 수 추이</div>
              <div className="text-xs text-slate-500 mt-1">주차별 통화 건수</div>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold">
              Bar
            </span>
          </div>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={view.weekly}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* KPI 추이 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">성과 지표 분석 (CS KPI)</div>
              <div className="text-xs text-slate-500 mt-1">QA / 성공률 / 준수율</div>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold">
              Line
            </span>
          </div>

          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={view.weekly}>
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="qa" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="success" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="adherence" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom: 카테고리(좌) / AI 비교(우-넓게) */}
      <div className="grid grid-cols-[420px_1fr] gap-6">
        {/* 카테고리 분포 */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold">최근 {rangeWeeks}주 통화 카테고리</div>
              <div className="text-xs text-slate-500 mt-1">카테고리별 통화 횟수</div>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold">
              Bar
            </span>
          </div>

          <div className="mt-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={view.categories} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={90} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            TODO: 카테고리 클릭 → 해당 카테고리의 KPI/AI 분석 상세로 drill-down 가능
          </div>
        </Card>

        {/* AI 비교 분석 (✅ 넓게) */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold">AI 비교 분석 (전문 상담사 역할)</div>
              <div className="text-xs text-slate-500 mt-1">
                상담사 응대 vs AI 권장 응대(키워드/핵심 포인트/전략 제안)
              </div>
            </div>

            {/* ✅ 여기 버튼들은 “통화중 코파일럿”에도 그대로 옮겨 붙일 수 있는 구조 */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-extrabold hover:bg-slate-50"
                onClick={() => alert('TODO: 해지방어 전략 생성')}
              >
                해지방어
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-extrabold hover:bg-slate-50"
                onClick={() => alert('TODO: 업셀링/요금제 추천')}
              >
                업셀링
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-extrabold hover:bg-slate-50"
                onClick={() => alert('TODO: 핵심 키워드/요약 재생성')}
              >
                요약/키워드
              </button>
            </div>
          </div>

          {/* ✅ 넓어진 만큼 3열로 KPI 배치 */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <MiniKpi title="답변 매칭" value={`${Math.round(view.aiInsights.expertAnswerMatch * 100)}%`} />
            <MiniKpi title="키워드 겹침" value={`${Math.round(view.aiInsights.keywordOverlap * 100)}%`} />
            <MiniKpi title="리스크(예시)" value="중간" />
          </div>

          {/* ✅ 넓은 영역: 좌(누락포인트) / 우(키워드 비교) */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-extrabold text-slate-600">누락 가능 핵심 포인트</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {view.aiInsights.missedKeyPoints.map((x) => (
                  <li key={x} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    {x}
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-extrabold text-slate-600">권장 다음 액션(Placeholder)</div>
                <div className="mt-2 text-sm text-slate-700">
                  고객 의도가 <b>해지</b>로 감지되면 → 사유 확인 → 대안 요금제/혜택 제시 → 위약금/약정 조건 안내 순서 추천
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  TODO: FastAPI/LLM에서 nextActions[] 내려받아 버튼/체크리스트로 렌더링
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <KeywordBox title="상담사 키워드" items={view.aiInsights.topKeywordsAgent} />
              <KeywordBox title="AI 키워드" items={view.aiInsights.topKeywordsAI} />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-extrabold text-slate-600">차이 요약(Placeholder)</div>
                <div className="text-sm text-slate-700 mt-2">
                  AI는 <b>해지방어/대안 제시</b> 키워드가 강하고, 상담사는 <b>위약금/약정</b> 중심으로 설명하는 경향이 있습니다.
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  TODO: diffSummary를 LLM이 생성 → 여기 출력
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            TODO: 백엔드/LLM 연동 시 transcript + 상담사 응답 + AI 권장 응답 기반으로
            매칭/키워드/핵심포인트/전략을 계산해 내려주면 됩니다.
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- UI parts ---------- */

function Kpi({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-soft">
      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-500 font-semibold">{title}</div>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function MiniKpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-extrabold text-slate-600">{title}</div>
      <div className="text-lg font-extrabold mt-1">{value}</div>
    </div>
  );
}

function KeywordBox({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-extrabold text-slate-600">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((k) => (
          <span
            key={k}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            {k}
          </span>
        ))}
      </div>
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
