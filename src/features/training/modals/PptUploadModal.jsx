import { useRef, useState } from "react";
import Modal from "../../../components/Modal.jsx";

export default function PptUploadModal({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  return (
    <Modal open={open} title="PPT 업로드" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <div className="text-sm font-extrabold text-slate-700">
            PPT 파일을 선택하세요 (UI only)
          </div>
          <div className="text-xs text-slate-500 mt-2">지원: .ppt, .pptx</div>

          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-2xl px-4 py-3 font-extrabold border border-slate-200 bg-white hover:bg-slate-50"
            >
              파일 선택
            </button>

            <button
              type="button"
              disabled={!file}
              onClick={() => {
                // ✅ UI 확인용: 선택한 파일을 “업로드 성공”처럼 처리
                onUploaded?.({
                  pptId: `local-${Date.now()}`,
                  filename: file?.name,
                });
                setFile(null);
                onClose?.();
              }}
              className="rounded-2xl px-5 py-3 font-extrabold bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition"
            >
              완료
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".ppt,.pptx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {file && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-extrabold">{file.name}</div>
            <div className="text-xs text-slate-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}

        <div className="text-xs text-slate-400">
          TODO: 나중에 FastAPI 연동 시 multipart 업로드 후 pptId를 서버에서 받아오면 됩니다.
        </div>
      </div>
    </Modal>
  );
}
