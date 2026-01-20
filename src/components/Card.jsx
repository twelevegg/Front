export default function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-soft ${className}`}>
      {children}
    </div>
  );
}
