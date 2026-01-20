import Modal from "../../../components/Modal.jsx";

export default function VideoGenerateModal({ open, onClose, ppt }) {
  return (
    <Modal open={open} title="영상 생성" onClose={onClose}>
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

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-extrabold">영상 결과 (Placeholder)</div>
          <div className="text-sm text-slate-600 mt-2">
            지금은 UI만 확인하는 단계라 실제 영상은 표시되지 않습니다.
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
            Video Output Area
          </div>

          <button
            type="button"
            disabled={!ppt?.pptId}
            className="mt-4 w-full rounded-2xl bg-blue-600 text-white py-3 font-extrabold disabled:opacity-60"
            onClick={() => alert("TODO: FastAPI/LLM 연동 후 영상 생성 요청")}
          >
            영상 생성 시작
          </button>

          <div className="text-xs text-slate-400 mt-3">
            TODO: 생성 진행률/완료 후 videoUrl을 받아 &lt;video&gt;로 렌더링
          </div>
        </div>
      </div>
    </Modal>
  );
}
