import Card from '../../components/Card.jsx';

export default function PptTrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">Training Center</div>
        <div className="text-xl font-extrabold mt-1">PPT 교육</div>
        <div className="text-sm text-slate-500 mt-2">PPT → 영상/퀴즈 생성(Placeholder)</div>
      </div>

      <Card className="p-6">
        <div className="text-sm font-extrabold">콘텐츠 제작 파이프라인(Placeholder)</div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50" type="button">업로드</button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50" type="button">영상 생성</button>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-extrabold hover:bg-slate-50" type="button">퀴즈 생성</button>
        </div>
      </Card>
    </div>
  );
}
