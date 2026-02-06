export default function TermsOfServiceContent() {
    const currentDate = new Date().getFullYear() + "년 " + (new Date().getMonth() + 1) + "월 " + new Date().getDate() + "일";

    return (
        <div className="text-slate-700 leading-relaxed text-sm space-y-8 p-4">
            <div className="text-center border-b pb-6 mb-8">
                <h2 className="text-2xl font-bold text-slate-900">이용약관</h2>
                <p className="text-slate-500 mt-2">쉽고 편리한 AICC 온라인 서비스를 제공하겠습니다.</p>
            </div>

            <section>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">제1장 총칙</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제1조 (목적)</h4>
                        <p>본 약관은 <strong>Aivle12</strong>(이하 "회사" 또는 "팀")가 제공하는 <strong>CS NAVIGATOR</strong> 플랫폼 관련 온라인 교육 서비스(이하 “서비스”)를 이용함에 있어 회사와 회원과의 권리, 의무, 이용조건 및 절차에 관한 사항과 기타 이용에 필요한 사항 등을 규정함을 목적으로 합니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제2조 (약관의 효력 및 변경)</h4>
                        <p>① 본 약관은 서비스를 이용하는 회원에 대하여 그 효력을 발생합니다.</p>
                        <p>② 본 약관의 내용은 서비스 사이트에 게시하거나 기타의 방법으로 회원에게 공지하고, 이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.</p>
                        <p>③ 회사는 본 약관의 내용과 회사의 상호, 영업소 소재지, 대표자 성명 연락처(전화, 전자우편 주소 등) 등을 회원이 알 수 있도록 사이트의 초기 서비스 화면에 게시합니다.</p>
                        <p>④ 본 약관은 회사가 필요하다고 인정되는 경우 대한민국 법령의 범위 내에서 개정할 수 있으며, 회사가 본 약관을 개정할 경우에는 적용예정일 및 개정사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용예정일 7일 전부터 공지합니다. 다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 그 적용예정일 30일 전부터 공지하며, 공지하는 것 외에 전자우편 발송 등 전자적 수단을 통해 별도로 통지합니다.</p>
                        <p>⑤ 회원은 개정된 약관에 대해 동의하지 않을 권리가 있으며, 개정된 약관에 동의하지 않을 경우 이용계약을 해지할 수 있습니다. 단, 회사가 제4항에 따라 변경 약관을 공지 또는 통지하면서, 회원이 개정된 약관의 적용일 전까지 거부의사를 표시하지 아니하는 경우 약관의 변경에 동의한 것으로 간주한다는 내용을 공지 또는 통지하였음에도 회원이 명시적으로 거부의사를 표시하지 아니하였다면 회원이 변경 약관에 동의한 것으로 간주합니다. 회원은 변경된 약관에 동의 하지 않을 경우 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.</p>
                        <p>⑥ 본 약관에 동의하는 것은 회사가 운영하는 서비스 사이트를 정기적으로 방문하여 약관의 변경사항을 확인하는 것에 동의함을 의미합니다. 변경된 약관에 대한 정보를 알지 못하여 발생하는 회원의 피해에 대해 회사는 책임을 지지 않습니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제3조 (약관의 해석 및 약관 외 준칙)</h4>
                        <p>① “회사”는 개별 서비스에 대해서 별도의 이용약관 및 운영정책을 둘 수 있으며, 해당 내용이 본 약관과 상충할 경우에는 개별 서비스 별 이용약관(이하 “개별 약관”) 또는 운영정책을 우선하여 적용합니다.</p>
                        <p>② 회사는 개별 약관 등을 제2조 제3항의 방법에 의하여 공지할 수 있으며, 회원은 운영정책을 숙지하고 준수하여야 합니다.</p>
                        <p>③ 본 약관에 명시되지 사항은 개별 약관 또는 운영정책, 관련 법령, 상관례에 따릅니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제4조 (용어의 정의)</h4>
                        <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                            <li>“회원”이라 함은 회사에서 제공하는 사이트에 접속하여 본 약관과 개인정보처리방침에 동의하고, 아이디와 비밀번호를 발급받아 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                            <li>“CS NAVIGATOR 플랫폼”이라 함은 서비스의 제공을 위하여 회사가 구축한 온라인 교육 시스템을 말합니다.</li>
                            <li>“사이트”라 함은 서비스를 제공하기 위해 회사가 운영하는 웹사이트를 말합니다.</li>
                            <li>“서비스”라 함은 회사가 회원에게 플랫폼 내에서 제공하는 출결, 교육, 커뮤니티 등 모든 서비스를 말합니다.</li>
                            <li>“아이디(ID)”라 함은 회사가 회원의 식별과 회원의 서비스 이용을 위해 필요한 식별자를 의미하며, 회원이 지정하고 회사가 승인하는 Text ID를 의미합니다.</li>
                            <li>“비밀번호(Password)”라 함은 회원 비밀 보호를 위해 회원 자신이 정한 문자 또는 숫자의 조합을 의미하며, 아이디 별로 하나의 비밀번호만 설정, 이용 가능합니다.</li>
                            <li>“지식재산권”이란 발명, 아이디어, 창작, 컴퓨터프로그램을 포함한 저작물, 데이터베이스, 영업비밀 및 노하우 등 법상 보호 가능한 일체의 무형재산에 대한 권리들을 말하며, 출원, 신청, 등록 유무를 불문합니다.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">제2장 서비스 이용계약</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제5조 (이용계약의 성립, 이용신청 및 승낙)</h4>
                        <p>① 이용계약은 회원이 되고자 하는 자가 약관의 내용에 대하여 동의를 한 다음 회원가입 신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</p>
                        <p>② 회원이 되고자 하는 자는 사이트에 가입 시 회사에서 제공하는 회원가입 신청양식에 따라 필요사항(성명, 전자우편 주소, 핸드폰 번호, 아이디 등)을 기재하여야 합니다.</p>
                        <p>③ 회사는 회원이 되고자 하는 자에게 전자우편 주소와 핸드폰 번호를 통한 인증 및 기타 본인을 확인할 수 있는 인증절차를 요구할 수 있습니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제6조 (이용신청에 대한 승낙의 제한)</h4>
                        <p>① 회사는 다음의 각 호에 해당하는 이용신청에 대하여는 승낙을 제한할 수 있으며, 이 사유가 해소될 때까지 승낙을 유보하거나 승낙한 이후에도 이용계약을 해지할 수 있습니다.</p>
                        <ul className="list-disc pl-5 mt-1 text-slate-600 text-xs">
                            <li>기술상 문제가 있거나 서비스 관련 설비 용량이 부족한 경우</li>
                            <li>실명이 아니거나 다른 사람의 명의사용 등 회원 등록 시 허위로 신청하는 경우</li>
                            <li>사회의 안녕질서 또는 미풍양속을 저해하거나 저해할 목적으로 신청한 경우</li>
                            <li>기타 회사가 정한 이용신청 요건이 만족되지 않았을 경우</li>
                        </ul>
                        <p>② 이용신청의 승낙을 하지 아니하거나 유보한 경우 회사는 원칙적으로 이를 가입신청자에게 알리도록 합니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제7조 (회원정보 변경 및 보호)</h4>
                        <p>① 회원은 회원정보 관리화면을 통하여 언제든지 본인의 정보를 열람하고 수정할 수 있습니다.</p>
                        <p>② 회원은 이용 신청 시 기재한 사항이 변경되었을 경우 즉시 온라인으로 수정을 하거나 회사가 정한 별도의 양식 및 방법으로 변경 사항을 알려야 합니다.</p>
                        <p>③ 회사는 회원이 변경사항을 알리지 않아 발생한 불이익에 대하여 책임지지 않습니다.</p>
                        <p>④ 회사는 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관계법령이 정하는 바에 따라 회원의 정보를 보호하기 위해 노력합니다.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">제3장 서비스의 이용</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제8조 (서비스의 이용개시 및 시간)</h4>
                        <p>① 회사는 회원의 이용신청을 승낙한 때부터 서비스를 개시 합니다.</p>
                        <p>② 회사는 서비스를 연중무휴, 1일 24시간 제공하기 위하여 최대한 노력합니다. 다만, 회사의 업무상이나 기술상의 이유(정기점검 등)로 서비스가 일시 중지될 수 있으며, 해당 내용은 공지합니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제12조 (이용의 정지)</h4>
                        <p>회사는 회원의 서비스 이용내용이 국익 또는 사회적 공익을 저해할 목적, 범죄적 행위, 타인의 명예 손상, 해킹 및 악성 프로그램 유포 등 위법하거나 부당한 경우 사전통지 없이 서비스 이용을 정지할 수 있습니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제13조 (게시물 또는 내용물의 삭제)</h4>
                        <p>회사는 회원이 서비스 내에 게시하거나 전달하는 모든 내용물이 공공질서 및 미풍양속 위반, 범죄적 행위 결부, 제3자의 권리 침해 등에 해당한다고 판단되는 경우 사전통지 없이 삭제할 수 있습니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제14조 (게시물의 저작권)</h4>
                        <p>① 회사가 작성하여 사이트 또는 서비스에 게시한 저작물의 저작권은 회사에 귀속됩니다.</p>
                        <p>② 회원이 서비스 내에 게시한 게시물에 대한 모든 권한과 책임은 회원 자신에게 있습니다. 회사는 회원의 게시물을 서비스 홍보 목적으로 이용할 수 있습니다.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">제4장 계약당사자의 의무</h3>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제21조 (회사의 의무)</h4>
                        <p>① 회사는 서비스 제공과 관련하여 알고 있는 회원의 개인정보를 본인의 동의 없이 제3자에게 누설, 배포, 제공하지 않습니다.</p>
                        <p>② 회사는 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</p>
                        <p>③ 회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보 보호를 위한 보안시스템을 갖추어야 합니다.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제22조 (회원의 의무)</h4>
                        <p>① 회원은 관계법령, 본 약관의 규정, 이용안내 및 공지사항을 준수하여야 합니다.</p>
                        <p>② 회원은 회사의 사전 동의 없이 서비스를 이용하여 영리행위를 할 수 없습니다.</p>
                        <p>③ 회원은 아이디와 비밀번호 관리에 대한 책임을 지며, 제3자에게 노출되지 않도록 하여야 합니다.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">제5장 이용제한 및 손해배상</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제29조 (손해배상)</h4>
                        <p>회원이 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하게 되는 경우 위반한 회원은 회사에 발생하는 모든 손해를 배상하여야 합니다.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제30조 (면책조항)</h4>
                        <p>회사는 천재지변, 회원의 귀책사유로 인한 서비스 이용 장애, 자료의 신뢰도 등에 대하여 책임을 지지 않습니다.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">제31조 (관할법원)</h4>
                        <p>서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기될 경우 대한민국 법령에 따르며 민사소송법상의 관할법원에 제기합니다.</p>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">문의처</h3>
                <p className="text-sm text-slate-600 mb-4">서비스 이용과 관련하여 궁금한 점이 있으시면 아래 연락처로 문의해 주세요.</p>
                <ul className="list-disc pl-5 space-y-1 text-sm font-medium text-slate-700">
                    <li>상호명: Aivle12</li>
                    <li>주소: 서울특별시 강남구 개포로 310 (개포동)</li>
                    <li>Tel: 010-5609-3387</li>
                    <li>Email: daegyuchang@gmail.com</li>
                    <li>개인정보보호책임자: 장대규</li>
                </ul>
            </section>

            <div className="mt-8 pt-4 border-t text-sm text-slate-500 text-center">
                <p>부칙: 본 약관은 {currentDate}부터 시행합니다.</p>
            </div>
        </div>
    );
}
