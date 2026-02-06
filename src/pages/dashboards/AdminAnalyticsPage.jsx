import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/Card.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import { request } from '../../services/http.js';

export default function AdminAnalyticsPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await request('/api/v1/members');
        const list = Array.isArray(data) ? data : [];
        setMembers(list);
      } catch (error) {
        setMembers([]);
        setErrorMessage(error?.message || '상담원 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return members;
    return members.filter((member) =>
      `${member.name || ''} ${member.status || ''} ${member.metric ?? ''}`.includes(q)
    );
  }, [members, query]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Admin Analytics</div>
        <div className="text-xl font-extrabold mt-1">상담원 지표</div>
        <div className="text-sm text-slate-500 mt-1">이름 · 상태 · 통화 수 기준으로 확인</div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="text-sm font-extrabold text-slate-700">상담원 목록</div>
          <SearchInput placeholder="이름/상태/지표 검색" value={query} onChange={setQuery} className="w-64" />
        </div>

        {loading ? (
          <EmptyState title="불러오는 중" description="상담원 목록을 불러오고 있습니다." className="py-10" />
        ) : errorMessage ? (
          <EmptyState title="불러오기 실패" description={errorMessage} className="py-10" />
        ) : filtered.length === 0 ? (
          <EmptyState title="검색 결과 없음" description="조건에 맞는 상담사가 없습니다." className="py-10" />
        ) : (
          <div className="overflow-x-auto max-h-[416px] overflow-y-auto">
            <table className="w-full text-left border border-slate-100 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3">이름</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">통화 수</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{member.name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600">
                        {member.status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{formatMetric(member.metric)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function formatMetric(value) {
  if (value === null || value === undefined) return '-';
  return value;
}
