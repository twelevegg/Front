import { useState } from 'react';
import Card from '../../components/Card.jsx';

import PptUploadModal from '../../features/training/modals/PptUploadModal.jsx';
import VideoGenerateModal from '../../features/training/modals/VideoGenerateModal.jsx';
import QuizModal from '../../features/training/modals/QuizModal.jsx';

export default function PptTrainingPage() {
  const [openUpload, setOpenUpload] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);

  const [ppt, setPpt] = useState(null); // { pptId, filename }

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
            업로드
          </button>

          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
            type="button"
            onClick={() => setOpenVideo(true)}
          >
            영상 생성
          </button>

          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50"
            type="button"
            onClick={() => setOpenQuiz(true)}
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
                <span className="text-slate-400"> ({ppt.pptId})</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 모달들 */}
      <PptUploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={(res) => setPpt(res)}
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
      />
    </div>
  );
}
