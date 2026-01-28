import { useState } from 'react';
import Card from '../../components/Card.jsx';

import PptUploadModal from '../../features/training/modals/PptUploadModal.jsx';
import VideoGenerateModal from '../../features/training/modals/VideoGenerateModal.jsx';
import QuizModal from '../../features/training/modals/QuizModal.jsx';

export default function PptTrainingPage() {
  const [openUpload, setOpenUpload] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);

  // { jobId, filename, round, isComplete, lastScore }
  const [ppt, setPpt] = useState(null);

  const resetPpt = () => {
    setPpt(null);
    // 혹시 모달이 열려있던 상태면 같이 닫아주기
    setOpenVideo(false);
    setOpenQuiz(false);
  };

  const handleGradeUpdated = (gradeRes) => {
    // gradeRes: { score, is_complete, round, ... }
    setPpt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lastScore: typeof gradeRes?.score === 'number' ? gradeRes.score : prev.lastScore,
        isComplete: Boolean(gradeRes?.is_complete ?? gradeRes?.isComplete ?? prev.isComplete),
        round: typeof gradeRes?.round === 'number' ? gradeRes.round : prev.round,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Training Center</div>
        <div className="text-xl font-extrabold mt-1">PPT 교육</div>
        <div className="text-sm text-slate-500 mt-2">PPT → 영상/퀴즈 생성(Placeholder)</div>
      </div>

      <Card className="p-6">
        <div className="text-sm font-extrabold">콘텐츠 제작 파이프라인(Placeholder)</div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
            type="button"
            onClick={() => setOpenUpload(true)}
          >
            {ppt ? '다른 PPT 업로드(교체)' : '업로드'}
          </button>

          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
            type="button"
            onClick={() => setOpenVideo(true)}
            disabled={!ppt}
            title={!ppt ? '먼저 PPT를 업로드해주세요' : undefined}
          >
            영상 생성
          </button>

          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
            type="button"
            onClick={() => setOpenQuiz(true)}
            disabled={!ppt}
            title={!ppt ? '먼저 PPT를 업로드해주세요' : undefined}
          >
            퀴즈 생성
          </button>

        </div>

        <div className="mt-4">
          {!ppt ? (
            <div className="text-xs text-slate-400">
              업로드된 PPT 없음. 업로드 모달에서 파일을 선택하면 여기 표시됩니다.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <div className="font-extrabold">현재 선택된 PPT</div>
              <div className="text-xs text-slate-600 mt-1">
                <span className="font-semibold">{ppt.filename}</span>
                <span className="text-slate-400"> ({ppt.jobId})</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <span>round: <b>{ppt.round ?? 0}</b></span>
                {typeof ppt.lastScore === 'number' && <span>last score: <b>{Math.round(ppt.lastScore)}</b></span>}
                {ppt.isComplete && <span className="text-blue-700 font-bold">모든 학습 완료</span>}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                퀴즈/영상까지 완료 후 “작업 종료(초기화)”를 누르고 다음 PPT를 업로드하세요.
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 모달들 */}
      <PptUploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={(res) => {
          setPpt(res);         
          setOpenUpload(false); 
        }}
      />

      <VideoGenerateModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        ppt={ppt}
      />

      <QuizModal
        open={openQuiz}
        onClose={() => setOpenQuiz(false)}
        ppt={ppt}
        onGradeUpdated={handleGradeUpdated}
        onRequestOpenVideo={() => setOpenVideo(true)}
      />
    </div>
  );
}
