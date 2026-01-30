import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Search, Tag, AlertCircle, X } from 'lucide-react';
import Card from '../components/Card.jsx';
import Pill from '../components/Pill.jsx';
import { useToast } from '../components/common/ToastProvider.jsx';
import {
  fetchCaseLibraryList,
  createCaseLibrary,
  deleteCaseLibrary,
} from '../api/caseLibraryService.js';

const RECOMMENDED_TAGS = [
  '고위험', '환불', '정책', '결제', '배송', '서비스', '불만', '칭찬', '시스템', '기타'
];

export default function CaseLibraryPage() {
  const { addToast } = useToast();
  const [caseList, setCaseList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formTags, setFormTags] = useState([]); // Array of strings
  const [customTag, setCustomTag] = useState(''); // Input for new manual tags
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setFetchError('');

    fetchCaseLibraryList()
      .then((list) => {
        if (!active) return;
        setCaseList(list);
        setSelectedId(list[0]?.id || null);
      })
      .catch(() => {
        if (!active) return;
        setFetchError('케이스 목록을 불러오지 못했습니다.');
        addToast('케이스 목록을 불러오지 못했습니다.', 'error');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [addToast]);

  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return caseList;
    const query = searchQuery.toLowerCase();
    return caseList.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.body.toLowerCase().includes(query) ||
      c.tags?.some(t => t.toLowerCase().includes(query)) ||
      c.id.toLowerCase().includes(query)
    );
  }, [caseList, searchQuery]);

  const selected = useMemo(
    () => caseList.find((c) => c.id === selectedId),
    [caseList, selectedId]
  );

  const openModal = () => {
    setError('');
    setFormTitle('');
    setFormBody('');
    setFormTags([]);
    setCustomTag('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
  };

  const toggleTag = (tag) => {
    setFormTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = customTag.trim();
      if (!val) return;
      if (!formTags.includes(val)) {
        setFormTags([...formTags, val]);
      }
      setCustomTag('');
    }
  };

  const saveCase = async () => {
    const title = formTitle.trim();
    const body = formBody.trim();

    if (!title) return setError('제목을 입력해 주세요.');
    if (!body) return setError('내용을 입력해 주세요.');

    setError('');

    try {
      const saved = await createCaseLibrary({
        title,
        body,
        tags: formTags,
      });

      setCaseList((prev) => [saved, ...prev]); // 최신이 위로
      setSelectedId(saved.id);
      setIsOpen(false);
      addToast('새로운 케이스가 추가되었습니다.', 'success');
    } catch {
      setError('저장에 실패했습니다.');
      addToast('저장에 실패했습니다.', 'error');
    }
  };

  const deleteCase = async (id, e) => {
    e?.stopPropagation();
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteCaseLibrary(id);
        setCaseList(prev => {
          const next = prev.filter(c => c.id !== id);
          if (id === selectedId && next.length > 0) {
            // If deleted item was selected, try to select the first one from remaining
            // But wait, "next" is the new list. 
            // We should select from next. 
            // However filtered list logic might interfere if we just pick first of 'next'.
            // Simplest is to pick first of next.
            setSelectedId(next[0]?.id || null);
          } else if (next.length === 0) {
            setSelectedId(null);
          }
          return next;
        });
        addToast('케이스가 삭제되었습니다.', 'info');
      } catch {
        addToast('삭제에 실패했습니다.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <div className="text-sm text-slate-500 font-bold">Case library</div>
          <div className="text-2xl font-black text-slate-900 mt-1">상담 지식 베이스</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[420px_1fr] gap-6">
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="p-6 pb-2 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-extrabold text-slate-800">Case List</div>
              <button
                className="flex items-center gap-1__ rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition active:scale-95"
                type="button"
                onClick={openModal}
              >
                <Plus size={16} />
                <span>추가</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="제목, 태그, 내용 검색..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <AlertCircle size={32} />
                <span className="text-sm font-medium">케이스를 불러오는 중...</span>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <AlertCircle size={32} />
                <span className="text-sm font-medium">{fetchError}</span>
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <AlertCircle size={32} />
                <span className="text-sm font-medium">검색 결과가 없습니다.</span>
              </div>
            ) : (
              filteredCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`group relative cursor-pointer w-full text-left rounded-2xl border px-5 py-5 transition-all duration-200 ${c.id === selectedId
                      ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500'
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className={`font-extrabold text-base ${c.id === selectedId ? 'text-blue-700' : 'text-slate-800'}`}>
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {c.id} · {c.date}
                      </div>

                      {c.tags?.length ? (
                        <div className="pt-2 flex gap-1.5 flex-wrap">
                          {c.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500">
                              # {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <button
                      onClick={(e) => deleteCase(c.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="flex flex-col h-full overflow-hidden p-0 relative">
          {selected ? (
            <>
              <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="relative z-10 p-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-black">
                      {selected.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Last updated: {selected.date}</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">
                    {selected.title}
                  </h2>
                </div>
                <button
                  onClick={(e) => deleteCase(selected.id, e)}
                  className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="relative z-10 flex-1 overflow-y-auto p-8">
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-8 text-base">
                    {selected.body}
                  </div>
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-400">
                      <Tag size={16} />
                      <span>Related Tags</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {selected.tags.map(t => (
                        <Pill key={t} className="bg-slate-50 border-slate-200 text-slate-600">{t}</Pill>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <Search size={48} className="opacity-20" />
              <div className="font-bold text-slate-400">케이스를 선택하여 상세 내용을 확인하세요.</div>
            </div>
          )}
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-label="닫기"
          />

          {/* panel */}
          <div className="relative w-[640px] max-w-[calc(100vw-32px)] rounded-3xl bg-white shadow-2xl border border-slate-200 p-8 transform transition-all scale-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-xl font-black text-slate-900">새로운 케이스 추가</div>
                <div className="text-sm text-slate-500 mt-1">
                  상담 현장에서 발생한 새로운 케이스를 공유해주세요.
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <div className="font-bold">✕</div>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">제목</div>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예) 민원 언급 시 응대"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">태그 선택</div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {RECOMMENDED_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${formTags.includes(tag)
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={addCustomTag}
                      placeholder="직접 입력 (Enter로 추가)"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addCustomTag}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-200 rounded-full hover:bg-slate-300 text-slate-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {formTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 min-h-[3rem]">
                      {formTags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                          {tag}
                          <button onClick={() => toggleTag(tag)} className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">내용</div>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="구체적인 상황 설명과 대응 가이드를 입력하세요."
                  rows={8}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {error ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-bold">
                  <AlertCircle size={16} />
                  {error}
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={saveCase}
                className="rounded-xl bg-slate-900 text-white px-8 py-3 text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] transition active:scale-95"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
