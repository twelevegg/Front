export default function SearchInput({ placeholder = '검색', value = '', onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
      <span className="text-slate-400 text-sm">🔎</span>
      <input
        className="w-full outline-none text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
