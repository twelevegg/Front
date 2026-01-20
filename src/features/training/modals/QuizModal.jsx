import { useState } from "react";
import Modal from "../../../components/Modal.jsx";

export default function QuizModal({ open, onClose, ppt }) {
  const [step, setStep] = useState("idle"); // idle | solving | result

  return (
    <Modal open={open} title="퀴즈 생성/풀이" onClose={onClose}>
      <div className="space-y-4">
        {!ppt?.pptId ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            먼저 PPT를 업로드해 주세요.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            선택된 PPT: <b>{ppt.filename || ppt.pptId}</b>
          </div>
        )}

        {step === "idle" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-extrabold">퀴즈 생성 (Placeholder)</div>
            <div className="text-sm text-slate-600 mt-2">
              나중에 LLM이 만든 문제를 받아 여기서 렌더링합니다.
            </div>

            <button
              type="button"
              disabled={!ppt?.pptId}
              className="mt-4 w-full rounded-2xl bg-blue-600 text-white py-3 font-extrabold disabled:opacity-60"
              onClick={() => setStep("solving")}
            >
              퀴즈 시작
            </button>

            <div className="text-xs text-slate-400 mt-3">
              TODO: /quiz:generate 응답(questions[])을 받아 아래 solving 화면에 표시
            </div>
          </div>
        )}

        {step === "solving" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <div className="text-sm font-extrabold">문제 풀이 (Placeholder)</div>
              <div className="text-sm text-slate-600 mt-2">
                여기에 문제/선택지를 렌더링하고 답안을 수집합니다.
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
              Questions Area
            </div>

            <button
              type="button"
              className="w-full rounded-2xl bg-blue-600 text-white py-3 font-extrabold"
              onClick={() => setStep("result")}
            >
              (UI) 제출 & 채점
            </button>

            <div className="text-xs text-slate-400">
              TODO: /quiz:grade 결과(score, wrong[])를 받아 result 화면에 표시
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <div className="text-sm font-extrabold">채점 결과 (Placeholder)</div>
              <div className="text-sm text-slate-700 mt-2">점수/오답정리 영역</div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
              Wrong Answers Review Area
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 font-extrabold hover:bg-slate-50"
                onClick={() => setStep("solving")}
              >
                다시 풀기
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-blue-600 text-white py-3 font-extrabold hover:bg-blue-700"
                onClick={() => {
                  setStep("idle");
                  onClose?.();
                }}
              >
                닫기
              </button>
            </div>

            <div className="text-xs text-slate-400">
              TODO: 오답 목록/해설/참조 슬라이드 등 LLM 결과를 여기에 렌더링
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
