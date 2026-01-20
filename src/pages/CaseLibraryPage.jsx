import { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';

const initialCases = [
  {
    id: 'K-012',
    title: '민원 언급 시 응대',
    date: '2026-01-07',
    tags: ['고위험', '표현주의'],
    body: '확정/과장 표현 금지, 근거 문서 기반 안내'
  },
  {
    id: 'K-009',
    title: '중복 결제 의심',
    date: '2026-01-05',
    tags: ['환불', '정책'],
    body: '결제 내역 확인 후 정책에 따라 환불 절차 안내'
  }
];

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function nextCaseId(list) {
  // K-### 최대값 + 1
  const maxNum = list
    .map((c) => Number(String(c.id).replace('K-', '')))
    .filter((n) => Number.isFinite(n))
    .reduce((a, b) => Math.max(a, b), 0);

  return `K-${String(maxNum + 1).padStart(3, '0')}`;
}

export default function CaseLibraryPage() {
  const [caseList, setCaseList] = useState(initialCases);
  const [selectedId, setSelectedId] = useState(initialCases[0].id);

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formTags, setFormTags] = useState(''); // comma-separated
  const [error, setError] = useState('');

  const selected = useMemo(
    () => caseList.find((c) => c.id === selectedId),
    [caseList, selectedId]
  );

  const openModal = () => {
    setError('');
    setFormTitle('');
    setFormBody('');
    setFormTags('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
  };

  const saveCase = () => {
    const title = formTitle.trim();
    const body = formBody.trim();

    if (!title) return setError('제목을 입력해 주세요.');
    if (!body) return setError('내용을 입력해 주세요.');

    const tags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newCase = {
      id: nextCaseId(caseList),
      title,
      date: todayYYYYMMDD(),
      tags,
      body
    };

    setCaseList((prev) => [newCase, ...prev]); // 최신이 위로
    setSelectedId(newCase.id);
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Case library</div>
        <div className="text-xl font-extrabold mt-1">Case library</div>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">Case library</div>
            <button
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
              type="button"
              onClick={openModal}
            >
              ＋ 추가
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {caseList.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition hover:bg-slate-50 ${
                  c.id === selectedId
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-extrabold">{c.title}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {c.id} · {c.date}
                    </div>

                    {c.tags?.length ? (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {c.tags.map((t) => (
                          <Pill key={t}>{t}</Pill>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">상세</div>
            <Pill>{selected?.id}</Pill>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 p-5">
            <div className="text-xl font-extrabold">{selected?.title}</div>
            <div className="text-sm text-slate-500 mt-2">
              업데이트: {selected?.date}
            </div>
            <div className="mt-4 text-sm text-slate-700 leading-7 whitespace-pre-wrap">
              {selected?.body}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={closeModal}
            aria-label="닫기"
          />

          {/* panel */}
          <div className="relative w-[640px] max-w-[calc(100vw-32px)] rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold">케이스 추가</div>
                <div className="text-xs text-slate-500 mt-1">
                  상담사가 제목/내용을 입력해 라이브러리에 저장합니다.
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-extrabold hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-sm font-extrabold mb-2">제목</div>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예) 민원 언급 시 응대"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <div className="text-sm font-extrabold mb-2">태그(선택)</div>
                <input
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="쉼표로 구분 (예: 고위험, 정책)"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <div className="text-sm font-extrabold mb-2">내용</div>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="케이스 처리 가이드/주의사항을 입력하세요."
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {error ? (
                <div className="text-sm font-extrabold text-red-600">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-extrabold hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={saveCase}
                className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-5 py-2 text-sm font-extrabold hover:bg-blue-100"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
