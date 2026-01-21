const styles = {
  High: 'bg-rose-500 text-white',
  Medium: 'bg-slate-100 text-slate-700',
  Low: 'bg-indigo-100 text-indigo-700',
  Severe: 'bg-rose-600 text-white',
  Normal: 'bg-slate-100 text-slate-700'
};

export default function Badge({ label, tone = 'Normal' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${styles[tone] || styles.Normal}`}
    >
      {label}
    </span>
  );
}
