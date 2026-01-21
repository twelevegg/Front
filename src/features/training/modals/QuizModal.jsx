import { useState, useMemo } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import Modal from "../../../components/Modal.jsx";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "고객이 '배송 지연'으로 화를 낼 때 가장 적절한 초기 대응은?",
    options: [
      "택배사 잘못이니 택배사에 연락하라고 한다.",
      "불편을 드려 죄송하다고 공감하며 주문 번호를 확인한다.",
      "규정상 어쩔 수 없다고 설명한다.",
      "잠시만 기다리라고 하고 전화를 끊는다."
    ],
    answer: 1
  },
  {
    id: 2,
    question: "다음 중 'VIP 고객' 응대 시 필수적인 요소가 아닌 것은?",
    options: [
      "이전 상담 이력 확인",
      "전담 상담사 연결",
      "최대한 빠르게 전화를 끊기",
      "개인화된 인사말 제공"
    ],
    answer: 2
  },
  {
    id: 3,
    question: "고객이 욕설을 시작했을 때의 올바른 대처법은?",
    options: [
      "같이 욕설로 대응한다.",
      "즉시 전화를 끊는다.",
      "산업안전보건법에 의거하여 상담이 중단될 수 있음을 고지한다.",
      "무조건 죄송하다고만 반복한다."
    ],
    answer: 2
  }
];

export default function QuizModal({ open, onClose, ppt }) {
  const [step, setStep] = useState("idle"); // idle | solving | result
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [score, setScore] = useState(0);

  const currentQuestion = MOCK_QUESTIONS[currentIndex];

  const handleStart = () => {
    setStep("solving");
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
  };

  const handleSelect = (optionIdx) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIdx });
  };

  const handleNext = () => {
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate Score
      const correctCount = MOCK_QUESTIONS.reduce((acc, q) => {
        return acc + (answers[q.id] === q.answer ? 1 : 0);
      }, 0);
      setScore(Math.round((correctCount / MOCK_QUESTIONS.length) * 100));
      setStep("result");
    }
  };

  return (
    <Modal open={open} title="학습 퀴즈" onClose={onClose}>
      <div className="min-h-[400px]">
        {!ppt?.pptId ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200">
            <div className="text-slate-400 font-medium">먼저 PPT 자료를 업로드해주세요.</div>
            <button onClick={onClose} className="text-blue-600 font-bold hover:underline">돌아가기</button>
          </div>
        ) : (
          <div className="h-full">
            {step === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full space-y-6 pt-8"
              >
                <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={40} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-extrabold text-slate-800">퀴즈를 시작할까요?</h3>
                  <p className="text-slate-500">
                    <b>{ppt.filename}</b> 내용을 바탕으로 생성된<br />
                    총 {MOCK_QUESTIONS.length}문제의 퀴즈입니다.
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full max-w-xs rounded-2xl bg-blue-600 py-4 font-extrabold text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition active:scale-95"
                >
                  퀴즈 시작하기
                </button>
              </motion.div>
            )}

            {step === "solving" && (
              <motion.div
                key="solving"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
              >
                <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-400">
                  <span>Question {currentIndex + 1} / {MOCK_QUESTIONS.length}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600">진행 중</span>
                </div>

                <div className="flex-1 space-y-6">
                  <h3 className="text-xl font-extrabold text-slate-800 leading-snug">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-medium ${answers[currentQuestion.id] === idx
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]'
                            : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                          }`}
                      >
                        <span className="mr-3 inline-block items-center justify-center rounded-full bg-white border px-2 text-xs font-bold text-slate-400">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={answers[currentQuestion.id] === undefined}
                  onClick={handleNext}
                  className="mt-8 w-full rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  {currentIndex === MOCK_QUESTIONS.length - 1 ? '제출하기' : '다음 문제'}
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full space-y-6 pt-4"
              >
                <div className={`text-6xl font-black tracking-tighter ${score >= 70 ? 'text-blue-600' : 'text-amber-500'}`}>
                  {score}
                  <span className="text-2xl text-slate-400 ml-1">점</span>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-slate-800">
                    {score >= 70 ? '🎉 훌륭합니다!' : '😅 조금 더 노력이 필요해요'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    총 {MOCK_QUESTIONS.length}문제 중 {Math.round((score / 100) * MOCK_QUESTIONS.length)}문제를 맞추셨습니다.
                  </p>
                </div>

                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center space-y-4">
                  <p className="text-sm font-bold text-slate-600">오답 노트</p>
                  {score === 100 ? (
                    <div className="text-blue-500 text-sm font-medium">완벽합니다! 틀린 문제가 없습니다.</div>
                  ) : (
                    <div className="text-xs text-slate-400 space-y-1">
                      {MOCK_QUESTIONS.map(q => {
                        if (answers[q.id] !== q.answer) {
                          return (
                            <div key={q.id} className="flex gap-2 text-left">
                              <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{q.question}</span>
                            </div>
                          )
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex w-full gap-3">
                  <button
                    onClick={handleStart}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} /> 다시 풀기
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                  >
                    완료
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
