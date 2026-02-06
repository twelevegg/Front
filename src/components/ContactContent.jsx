import { Mail, Phone, MapPin, User, Building } from 'lucide-react';

export default function ContactContent() {
    return (
        <div className="text-slate-700 leading-relaxed text-sm p-4 space-y-6">
            <div className="text-center border-b pb-6 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">문의하기</h2>
                <p className="text-slate-500 mt-2">CS NAVIGATOR 서비스 이용 관련 문의처입니다.</p>
            </div>

            <div className="space-y-6">
                {/* Company Info */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-500" />
                        기업/팀 정보
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="font-semibold w-24 shrink-0 text-slate-600">팀 명</span>
                            <span>Aivle12</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="font-semibold w-24 shrink-0 text-slate-600">대표 서비스</span>
                            <span>CS NAVIGATOR</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="font-semibold w-24 shrink-0 text-slate-600 flex items-center gap-1">
                                <User className="w-3 h-3" /> 개인정보책임
                            </span>
                            <span>장대규</span>
                        </li>
                    </ul>
                </div>

                {/* Contact Details */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        연락처 정보
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-500 shrink-0">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-semibold mb-0.5">ADDRESS</span>
                                <span>서울특별시 강남구 개포로 310 (개포동)</span>
                            </div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-500 shrink-0">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-semibold mb-0.5">TEL</span>
                                <a href="tel:01056093387" className="hover:text-indigo-600 transition-colors">010-5609-3387</a>
                            </div>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-500 shrink-0">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-semibold mb-0.5">EMAIL</span>
                                <a href="mailto:daegyuchang@gmail.com" className="hover:text-indigo-600 transition-colors">daegyuchang@gmail.com</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center pt-6 text-xs text-slate-400 bg-white">
                <p>운영시간: 평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
                <p className="mt-1">문의주시면 빠르고 친절하게 답변 드리겠습니다.</p>
            </div>
        </div>
    );
}
