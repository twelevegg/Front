import { useRef, useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import Modal from "../../../components/Modal.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function PptUploadModal({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setFile(null);
      setUploading(false);
      setProgress(0);
    }
  }, [open]);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = () => {
    setUploading(true);
    // Mock upload progress
    let curr = 0;
    const interval = setInterval(() => {
      curr += 10;
      setProgress(curr);
      if (curr >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUploaded?.({
            pptId: `local-${Date.now()}`,
            filename: file.name,
            previewUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=PPT+Preview+Page+1" // Mock preview
          });
          onClose();
        }, 500);
      }
    }, 200);
  };

  return (
    <Modal open={open} title="PPT 자료 업로드" onClose={onClose}>
      <div className="space-y-6">
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
              지원 형식: .ppt, .pptx, .pdf (최대 50MB)
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
              </div>
              {!uploading && (
                <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
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
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 transition"
          >
            취소
          </button>
          <button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            className="rounded-xl bg-blue-600 px-6 py-3 font-extrabold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            {uploading ? '업로드 중...' : '업로드 하기'}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".ppt,.pptx,.pdf"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </Modal>
  );
}
