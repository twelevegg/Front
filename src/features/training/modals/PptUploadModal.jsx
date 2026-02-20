import { useRef, useState, useEffect } from "react";
import { Upload, FileText, X, AlertTriangle } from "lucide-react";
import Modal from "../../../components/Modal.jsx";
import { motion } from "framer-motion";
import { createEduJob, uploadToSpringSecurely } from "../../../api/eduService.js";

export default function PptUploadModal({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDefaultFile, setIsDefaultFile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const DEFAULT_FILE_URL = "/edu/placeholder.pdf";
  const DEFAULT_FILE_NAME = "edu-placeholder.pdf";

  const loadDefaultFile = async () => {
    try {
      const res = await fetch(DEFAULT_FILE_URL);
      if (!res.ok) throw new Error("default file not found");
      const blob = await res.blob();
      const defaultFile = new File([blob], DEFAULT_FILE_NAME, {
        type: blob.type || "application/pdf",
      });
      setFile(defaultFile);
      setIsDefaultFile(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (open) {
      setFile(null);
      setIsDefaultFile(false);
      setUploading(false);
      setProgress(0);
      setError("");
      loadDefaultFile();
    }
  }, [open]);

  useEffect(() => {
    if (!uploading) return;
    // fetch는 업로드 진행률을 기본 제공하지 않아서, UX용 가짜 진행률(최대 90%)만 표시
    let curr = 0;
    const id = setInterval(() => {
      curr = Math.min(90, curr + Math.max(2, Math.round((90 - curr) * 0.08)));
      setProgress(curr);
    }, 300);
    return () => clearInterval(id);
  }, [uploading]);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setIsDefaultFile(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      // 1. FastAPI (AI Processing)
      const aiPromise = createEduJob(file);

      // 2. Spring Boot (Secure Storage)
      const dbPromise = uploadToSpringSecurely(file);

      // Execute in parallel
      const [res, dbRes] = await Promise.all([aiPromise, dbPromise]);

      setProgress(100);
      console.log("Secure upload complete:", dbRes);

      // 백엔드 응답: { job_id, status }
      onUploaded?.({
        jobId: res.job_id,
        filename: file.name,
        round: 0,
        isComplete: false,
        lastScore: null,
      });
      onClose();
    } catch (e) {
      console.error(e);
      setError(e?.message || "업로드에 실패했습니다.");
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Modal open={open} title="자료 업로드" onClose={onClose}>
      <div className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="whitespace-pre-wrap break-words">{error}</div>
          </div>
        )}

        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="group relative cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:bg-blue-50/50 hover:border-blue-300 transition-colors"
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-white p-4 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="text-base font-extrabold text-slate-700">
              파일을 드래그하거나 클릭하여 업로드
            </div>
            <div className="mt-2 text-xs text-slate-400">
              지원 형식: .pptx, .pdf
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0 text-red-500">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-800 truncate">{file.name}</div>
                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                {isDefaultFile && (
                  <div className="text-[11px] text-blue-500 font-semibold">기본 파일</div>
                )}
              </div>
              {!uploading && (
                <button
                  onClick={() => setFile(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  업로드가 끝나면 서버에서 영상/퀴즈 생성을 자동으로 시작합니다.
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 transition"
            disabled={uploading}
          >
            취소
          </button>
          <button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            className="rounded-xl bg-blue-600 px-6 py-3 font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            {uploading ? "업로드 중..." : "업로드 하기"}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pptx,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </Modal>
  );
}
