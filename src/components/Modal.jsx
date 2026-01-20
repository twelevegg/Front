export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-[760px] rounded-3xl bg-white border border-slate-100 shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="text-lg font-extrabold">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-3 py-1 text-sm font-extrabold border border-slate-200 hover:bg-slate-50"
            >
              닫기
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
