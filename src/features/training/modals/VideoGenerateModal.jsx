import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Loader2, Play, RefreshCw } from "lucide-react";
import Modal from "../../../components/Modal.jsx";
import { motion } from "framer-motion";
import { fetchEduVideoBlob, getEduJob } from "../../../api/eduService.js";

function statusLabel(status) {
  if (status === "queued") return "대기 중";
  if (status === "running") return "생성 중";
  if (status === "done") return "완료";
  if (status === "failed") return "실패";
  return status || "-";
}

export default function VideoGenerateModal({ open, onClose, ppt }) {
  const jobId = ppt?.jobId;
  const [status, setStatus] = useState(null);
  const [detail, setDetail] = useState("");
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [loadingVideo, setLoadingVideo] = useState(false);
  const startedAtRef = useRef(null);

  const canRun = Boolean(jobId);

  const badgeClass = useMemo(() => {
    if (status === "done") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "failed") return "bg-red-50 text-red-700 border-red-200";
    if (status === "running") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  }, [status]);

  const resetLocal = () => {
    setStatus(null);
    setDetail("");
    setStage("");
    setProgress(0);
    setError("");
    setLoadingVideo(false);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl("");
    startedAtRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      resetLocal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function refreshStatusAndMaybeVideo() {
    if (!jobId) return null;
    try {
      const st = await getEduJob(jobId);
      setStatus(st.status);
      setDetail(st.detail || "");
      setStage(st.stage || "");

      // progress가 백엔드에서 제공되면 그걸 쓰고, 없으면 시간 기반(최대 95%) 가짜 진행률
      const serverProgress = Number(st.progress);
      if (!Number.isNaN(serverProgress) && st.progress !== undefined && st.progress !== null) {
        setProgress(Math.min(100, Math.max(0, serverProgress)));
      } else {
        if (!startedAtRef.current) startedAtRef.current = Date.now();
        const elapsedSec = (Date.now() - startedAtRef.current) / 1000;
        // 2분을 90%까지 채우는 가짜 progress
        const fake = Math.min(95, Math.round((elapsedSec / 120) * 90));
        setProgress(st.status === "done" ? 100 : fake);
      }

      if (st.status === "done" && !videoUrl && !loadingVideo) {
        setLoadingVideo(true);
        const blob = await fetchEduVideoBlob(jobId);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setLoadingVideo(false);
        setProgress(100);
      }

      if (st.status === "failed") {
        setError(st.detail || "작업에 실패했습니다.");
      }
      return st.status;
    } catch (e) {
      setError(e?.message || "상태 조회에 실패했습니다.");
      return null;
    }
  }

  useEffect(() => {
    if (!open || !jobId) return;

    let alive = true;
    let timer = null;

    const tick = async () => {
      if (!alive) return;
      const s = await refreshStatusAndMaybeVideo();
      // done/failed면 폴링 중단
      if (alive && s !== "done" && s !== "failed") {
        timer = setTimeout(tick, 1500);
      }
    };

    // 첫 호출
    tick();

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
    // status는 의존성에 넣지 않음(폴링 루프가 끊길 수 있어서)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, jobId]);

  return (
    <Modal open={open} title="영상 생성" onClose={onClose}>
      <div className="space-y-4">
        {!canRun ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            먼저 자료를 업로드해 주세요.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            선택된 파일: <b>{ppt?.filename || jobId}</b>
            <div className="text-xs text-slate-400 mt-1">jobId: {jobId}</div>
          </div>
        )}

        {/* 진행 상태 */}
        {canRun && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold">생성 상태</div>
              <div className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                {statusLabel(status)}
              </div>
            </div>

            {(detail || stage) && (
              <div className="text-xs text-slate-500 whitespace-pre-wrap break-words">
                {detail && <div>{detail}</div>}
                {stage && <div className="mt-1 text-slate-400">stage: {stage}</div>}
              </div>
            )}
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>{status === "done" ? "완료" : "생성 중..."}</span>
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
                stage: <b>{detail ? (null) : (null)}</b>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl border border-slate-200 py-3 font-extrabold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                onClick={refreshStatusAndMaybeVideo}
                disabled={!canRun}
              >
                <RefreshCw size={16} /> 새로고침
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-slate-900 text-white py-3 font-extrabold hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={() => {
                  // done이면 video가 없을 때만 재시도
                  refreshStatusAndMaybeVideo();
                }}
                disabled={!canRun || status !== "done"}
                title={status !== "done" ? "완료 후 재생할 수 있어요" : undefined}
              >
                <Play size={16} /> 재생 준비
              </button>
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="whitespace-pre-wrap break-words">{error}</div>
          </div>
        )}

        {/* 영상 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-extrabold">영상 결과</div>

          {loadingVideo ? (
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-600 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              영상 불러오는 중...
            </div>
          ) : videoUrl ? (
            <div className="mt-4">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-2xl border border-slate-200 bg-black"
              />
              <div className="text-xs text-slate-400 mt-2">
                영상이 안 보이면: ① 새로고침 ② 백엔드의 /video 응답 확인 ③ 브라우저 콘솔 네트워크 탭에서 mp4 응답 확인
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
              {status === "done" ? "완료 상태이지만 영상이 아직 준비되지 않았습니다. 새로고침을 눌러주세요." : "생성이 완료되면 이곳에 영상이 표시됩니다."}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
