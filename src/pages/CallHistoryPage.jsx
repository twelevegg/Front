import { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import { mockCalls } from '../features/calls/mockCalls.js';
import { emitCallConnected } from '../features/calls/callEvents.js';

const TABS = [
  { key: 'summary', label: '요약' },
  { key: 'qa', label: 'QA' },
  { key: 'log', label: '로그' },
  { key: 'audio', label: '음성' }
];

export default function CallHistoryPage() {
  const [selectedId, setSelectedId] = useState(mockCalls[0].id);
  const [activeTab, setActiveTab] = useState('summary');

  const selected = useMemo(
    () => mockCalls.find((c) => c.id === selectedId),
    [selectedId]
  );

  const simulate = () => {
    emitCallConnected({
      callId: selected?.id,
      customerName: '홍길동',
      issue: selected?.title,
      channel: '전화(CTI)'
    });
  };

  // 선택 통화가 바뀌면 탭을 기본(요약)으로 돌리고 싶으면 아래 주석 해제
  // useEffect(() => setActiveTab('summary'), [selectedId]);

  const downloadAudio = () => {
    // TODO: 실제 음성 파일 URL이 생기면 selected.audioUrl 같은 걸로 연결
    // 임시: 개발용 안내
    alert('음성 다운로드 링크/파일이 아직 연결되지 않았어요. (TODO: audioUrl 연결)');
  };

  const renderTabContent = () => {
    if (!selected) return null;

    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-2">
            <div className="text-sm font-extrabold">통화 요약</div>
            <div className="text-sm text-slate-700 leading-6">
              {selected.summary || '요약 데이터가 없습니다.'}
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-2">
            <div className="text-sm font-extrabold">QA 결과</div>
            <div className="text-sm text-slate-700 leading-6">
              {selected.qa || 'QA 데이터가 없습니다.'}
            </div>
          </div>
        );

      case 'log':
        return (
          <div className="space-y-2">
            <div className="text-sm font-extrabold">통화 로그</div>
            <div className="text-sm text-slate-700 leading-6 whitespace-pre-wrap">
              {selected.log || '로그 데이터가 없습니다.'}
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">통화 음성</div>
              <button
                type="button"
                onClick={downloadAudio}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
              >
                ⬇️ 다운로드
              </button>
            </div>

            {/* 실제 audioUrl이 있으면 아래처럼 연결 가능 */}
            {/* {selected.audioUrl ? (
              <audio controls className="w-full">
                <source src={selected.audioUrl} />
              </audio>
            ) : (
              <div className="text-sm text-slate-500">연결된 음성 파일이 없습니다.</div>
            )} */}

            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="text-sm text-slate-500">
                아직 음성 파일이 연결되지 않았어요. <span className="font-extrabold text-slate-900">audioUrl</span> 같은 필드를 연결하면
                바로 재생/다운로드가 가능합니다.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Call history</div>
        <div className="text-xl font-extrabold mt-1">Call history</div>
      </div>

      <div className="grid grid-cols-[420px_1fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold">통화 내역</div>
            <Pill>{mockCalls.length}건</Pill>
          </div>

          <div className="mt-4 space-y-3">
            {mockCalls.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedId(c.id);
                  setActiveTab('summary'); // 통화 바뀌면 요약 탭으로
                }}
                className={`w-full text-left rounded-2xl border px-4 py-4 transition hover:bg-slate-50 ${
                  c.id === selectedId ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="font-extrabold">{c.title}</div>
                <div className="text-xs text-slate-500 mt-1">{c.datetime}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-extrabold">통화 상세</div>
              <div className="text-xs text-slate-500 mt-1">
                선택된 통화: <span className="font-extrabold text-slate-900">{selected?.id}</span>
              </div>
            </div>

            <button
              onClick={simulate}
              className="rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm font-extrabold hover:bg-blue-100"
              type="button"
            >
              📞 CoPilot 열기(DEV)
            </button>
          </div>

          {/* 탭(버튼식) */}
          <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 text-sm font-extrabold rounded-2xl transition ${
                    active
                      ? 'bg-white border border-slate-200 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* 탭 내용 */}
          <div className="mt-4 rounded-2xl border border-slate-100 p-5">
            {renderTabContent()}
          </div>
        </Card>
      </div>
    </div>
  );
}
