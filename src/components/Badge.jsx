const styles = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-slate-100 text-slate-700',
  Low: 'bg-blue-100 text-blue-700',
  Severe: 'bg-red-600 text-white',
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
