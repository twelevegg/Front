import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle, Loader2, RotateCcw } from "lucide-react";
import Modal from "../../../components/Modal.jsx";
import { motion } from "framer-motion";
import { getEduJob, gradeEduJob, nextEduRound } from "../../../api/eduService.js";

function statusLabel(status) {
  if (status === "queued") return "대기 중";
  if (status === "running") return "생성 중";
  if (status === "done") return "준비 완료";
  if (status === "failed") return "실패";
  return status || "-";
}

export default function QuizModal({ open, onClose, ppt, onGradeUpdated, onRequestOpenVideo }) {
  const jobId = ppt?.jobId;
  const [status, setStatus] = useState(null);
  const [detail, setDetail] = useState("");
  const [progress, setProgress] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState("");

  const [step, setStep] = useState("loading"); // loading | idle | solving | result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // number[] (len=quiz)
  const [gradeResult, setGradeResult] = useState(null); // {score, feedback}
  const [isComplete, setIsComplete] = useState(false);
  const [startingNext, setStartingNext] = useState(false);
  const [grading, setGrading] = useState(false);

  const startedAtRef = useRef(null);

  const canRun = Boolean(jobId);

  const badgeClass = useMemo(() => {
    if (status === "done") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "failed") return "bg-red-50 text-red-700 border-red-200";
    if (status === "running") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  }, [status]);

  const resetAll = () => {
    setStatus(null);
    setDetail("");
    setProgress(0);
    setQuiz([]);
    setError("");
    setStep("loading");
    setCurrentIndex(0);
    setAnswers([]);
    setGradeResult(null);
    setGrading(false);
    setIsComplete(false);
    setStartingNext(false);
    startedAtRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      resetAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function refreshStatusAndMaybeQuiz() {
    if (!jobId) return null;
    try {
      const st = await getEduJob(jobId);
      setStatus(st.status);
      setDetail(st.detail || "");

      const serverProgress = Number(st.progress);
      if (!Number.isNaN(serverProgress) && st.progress !== undefined && st.progress !== null) {
        setProgress(Math.min(100, Math.max(0, serverProgress)));
      } else {
        if (!startedAtRef.current) startedAtRef.current = Date.now();
        const elapsedSec = (Date.now() - startedAtRef.current) / 1000;
        const fake = Math.min(95, Math.round((elapsedSec / 120) * 90));
        setProgress(st.status === "done" ? 100 : fake);
      }

      if (st.status === "done") {
        const q = Array.isArray(st.quiz) ? st.quiz : [];
        setQuiz(q);
        setAnswers(new Array(q.length).fill(-1));
        setStep("idle");
      }

      if (st.status === "failed") {
        setError(st.detail || "작업에 실패했습니다.");
        setStep("loading");
      }

      return st.status;
    } catch (e) {
      setError(e?.message || "상태 조회에 실패했습니다.");
      return null;
    }
  }

  useEffect(() => {
    if (!open) return;
    resetAll();
    if (!jobId) return;

    let alive = true;
    let timer = null;

    const tick = async () => {
      if (!alive) return;
      const s = await refreshStatusAndMaybeQuiz();
      if (alive && s !== "done" && s !== "failed") {
        timer = setTimeout(tick, 1500);
      }
    };

    tick();

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, jobId]);

  const currentQuestion = quiz[currentIndex];

  const handleStart = () => {
    setStep("solving");
    setCurrentIndex(0);
    setGradeResult(null);
  };

  const handleSelect = (optionIdx) => {
    const next = [...answers];
    next[currentIndex] = optionIdx;
    setAnswers(next);
  };

  const handleNextOrSubmit = async () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // 제출
    if (answers.some((a) => a < 0)) return;

    setGrading(true);
    setError("");
    try {
      const res = await gradeEduJob(jobId, answers);
      setGradeResult({ score: res.score, feedback: res.feedback, round: res.round });
      const complete = Boolean(res.is_complete);
      setIsComplete(complete);
      onGradeUpdated?.(res);
      setStep("result");
    } catch (e) {
      setError(e?.message || "채점에 실패했습니다.");
    } finally {
      setGrading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setAnswers(new Array(quiz.length).fill(-1));
    setGradeResult(null);
    setStep("solving");
  };

  const handleNextRound = async () => {
    if (!jobId) return;
    setStartingNext(true);
    setError("");
    try {
      await nextEduRound(jobId);
      // 다음 라운드 생성 시작: 퀴즈 모달 닫고 영상 모달 열기(요청)
      onClose?.();
      onRequestOpenVideo?.();
    } catch (e) {
      setError(e?.message || "다음 학습 생성 요청에 실패했습니다.");
    } finally {
      setStartingNext(false);
    }
  };

  const scoreDisplay = useMemo(() => {
    const s = gradeResult?.score;
    if (typeof s !== "number") return null;
    return Math.round(s);
  }, [gradeResult]);

  return (
    <Modal open={open} title="학습 퀴즈" onClose={onClose}>
      <div className="min-h-[420px] space-y-4">
        {!canRun ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200">
            <div className="text-slate-400 font-medium">먼저 자료를 업로드해주세요.</div>
            <button onClick={onClose} className="text-blue-600 font-bold hover:underline" type="button">돌아가기</button>
          </div>
        ) : (
          <>
            {/* 생성 상태 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold">퀴즈 준비 상태</div>
                <div className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                  {statusLabel(status)}
                </div>
              </div>

              {detail && (
                <div className="text-xs text-slate-500 whitespace-pre-wrap break-words">{detail}</div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{status === "done" ? "준비 완료" : "생성 중..."}</span>
                  <span>{Math.min(100, Math.max(0, progress))}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  * progress는 백엔드가 제공하지 않으면 시간 기반으로 추정 표시됩니다.
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap break-words">{error}</div>
              </div>
            )}

            {/* 본문 */}
            {step === "loading" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                퀴즈를 준비하고 있어요...
              </div>
            )}

            {step === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={34} />
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-extrabold text-slate-800">퀴즈를 시작할까요?</div>
                  <div className="text-sm text-slate-500">
                    <b>{ppt?.filename}</b> 내용을 바탕으로 생성된<br />
                    총 {quiz.length}문제 퀴즈입니다.
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  disabled={quiz.length === 0}
                  className="w-full max-w-xs rounded-2xl bg-blue-600 py-4 font-extrabold text-white shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition active:scale-95"
                  type="button"
                >
                  퀴즈 시작하기
                </button>
                {quiz.length === 0 && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2">
                    퀴즈가 비어있습니다. 문서 내용이 너무 짧거나 생성에 실패했을 수 있어요.
                  </div>
                )}
              </motion.div>
            )}

            {step === "solving" && currentQuestion && (
              <motion.div
                key="solving"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Question {currentIndex + 1} / {quiz.length}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600">진행 중</span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-800 leading-snug">
                  {currentQuestion.question}
                </h3>

                <div className="mt-4 space-y-3">
                  {(currentQuestion.options || []).map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium ${
                        answers[currentIndex] === idx
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]"
                          : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                      type="button"
                    >
                      <span className="mr-3 inline-block items-center justify-center rounded-full bg-white border px-2 text-xs font-bold text-slate-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  disabled={answers[currentIndex] < 0 || grading}
                  onClick={handleNextOrSubmit}
                  className="mt-6 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  type="button"
                >
                  {grading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> 채점 중...
                    </>
                  ) : (
                    <>
                      {currentIndex === quiz.length - 1 ? "제출하기" : "다음 문제"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === "result" && gradeResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5"
              >
                <div className="text-center space-y-1">
                  <div className={`text-6xl font-black tracking-tighter ${scoreDisplay >= 70 ? "text-blue-600" : "text-amber-500"}`}>
                    {scoreDisplay}
                    <span className="text-2xl text-slate-400 ml-1">점</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {scoreDisplay >= 70 ? "🎉 훌륭합니다!" : "😅 조금 더 복습해봐요"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="text-sm font-extrabold text-slate-800 mb-2">피드백</div>
                  <div className="max-h-[45vh] overflow-y-auto pr-2">
                    <pre className="whitespace-pre-wrap break-words text-xs text-slate-700 font-sans">
                      {gradeResult.feedback}
                    </pre>
                  </div>
                </div>

                {isComplete ? (
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700"
                    type="button"
                  >
                    모든 학습 완료
                  </button>
                ) : (
                  <div className="flex w-full gap-3 flex-wrap">
                    <button
                      onClick={restartQuiz}
                      className="flex-1 min-w-[140px] py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                      type="button"
                    >
                      <RotateCcw size={16} /> 다시 풀기
                    </button>
                    <button
                      onClick={handleNextRound}
                      disabled={startingNext}
                      className="flex-1 min-w-[180px] py-3 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 disabled:opacity-50"
                      type="button"
                    >
                      {startingNext ? "다음 학습 준비 중..." : "다음 영상/퀴즈 생성"}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 min-w-[120px] py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                      type="button"
                    >
                      완료
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
