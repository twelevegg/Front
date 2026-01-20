import { useState } from 'react';
import Card from '../../components/Card.jsx';

export default function RolePlayingPage() {
  const [scenario, setScenario] = useState('배송 지연 + 민원 언급');

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Training Center</div>
        <div className="text-xl font-extrabold mt-1">RolePlaying</div>
        <div className="text-sm text-slate-500 mt-2">실전 테스트(Placeholder)</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="text-sm font-extrabold">PR 프로그램(실전 테스트)</div>
          <div className="text-sm text-slate-500 mt-2">교육 후 준비 완료 여부 점검</div>

          <div className="mt-4">
            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              <option>배송 지연 + 민원 언급</option>
              <option>중복 결제 + 환불 요청</option>
              <option>로그인 오류 + 인증 실패</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold hover:bg-slate-100"
          >
            테스트 시작
          </button>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-extrabold">결과</div>
          <div className="text-sm text-slate-500 mt-2">테스트를 시작하면 점수가 표시됩니다.</div>

          <div className="mt-6 rounded-2xl border border-slate-100 p-4 text-sm text-slate-500">
            선택 시나리오: <span className="font-extrabold text-slate-900">{scenario}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
