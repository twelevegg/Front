export default function PrivacyPolicyContent() {
  const meta = {
    companyName: 'Aivle 12조',
    serviceName: 'CS Assistant',
    effectiveDate: '2026-02-03',
    lastUpdated: '2026-02-03',
    dpoName: '장대규',
    dept: '개인정보보호부서',
    email: 'jdg.secure@gmail.com',
    tel: '010-5609-3387',
    address: '서울시 강남구 개포동'
  };

  // ✅ 목차/섹션 정의를 배열로 만들어 map에서 index를 안전하게 사용
  const toc = [
    { id: 'a1', title: '제1조 (총칙)' },
    { id: 'a2', title: '제2조 (개인정보의 처리 목적)' },
    { id: 'a3', title: '제3조 (처리하는 개인정보 항목 및 수집 방법)' },
    { id: 'a4', title: '제4조 (개인정보의 처리 및 보유 기간)' },
    { id: 'a5', title: '제5조 (개인정보의 파기 절차 및 방법)' },
    { id: 'a6', title: '제6조 (개인정보의 제3자 제공)' },
    { id: 'a7', title: '제7조 (개인정보 처리업무의 위탁 및 재위탁)' },
    { id: 'a8', title: '제8조 (개인정보의 국외 이전)' },
    { id: 'a9', title: '제9조 (개인정보의 안전성 확보조치)' },
    { id: 'a10', title: '제10조 (개인정보 자동 수집장치(쿠키) 운영)' },
    { id: 'a11', title: '제11조 (정보주체의 권리·의무 및 행사방법)' },
    { id: 'a12', title: '제12조 (개인정보 보호책임자 및 고충처리)' },
    { id: 'a13', title: '제13조 (권익침해 구제방법)' },
    { id: 'a14', title: '제14조 (처리방침의 변경)' }
  ];

  return (
    <div className="text-slate-800" id="top">
      <h2 className="text-xl font-extrabold">개인정보 처리방침</h2>

      <p className="text-sm text-slate-600 mt-2">
        {meta.companyName}(이하 “회사”)는 「개인정보 보호법」 등 관계 법령을 준수하며, 정보주체의 자유와 권리 보호를 위해
        개인정보를 적법하게 처리하고 안전하게 관리합니다. 본 처리방침은 회사가 제공하는 {meta.serviceName} 서비스 이용과정에서
        개인정보가 어떻게 처리되는지 안내합니다.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
        <div className="font-extrabold mb-1">※ B2B(통신사) 서비스 특성 안내</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>회사는 고객사(통신사/콜센터 운영주체) 임직원 계정 정보는 “개인정보처리자”로서 처리합니다.</li>
          <li>
            고객사의 최종 고객(통화 상대방) 정보·상담/통화 데이터(STT 텍스트, 상담 내용, AI 요약/키워드 등)는 고객사로부터
            위탁받아 “수탁자”로서 처리할 수 있으며, 해당 원정보의 수집/동의 등은 고객사 처리방침이 우선 적용됩니다.
          </li>
        </ul>
      </div>

      {/* ✅ 목차 */}
      <div className="mt-6 rounded-2xl border border-slate-200 p-4">
        <div className="text-sm font-extrabold mb-2">목차</div>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
          {toc.map((item, index) => (
            <li key={item.id ?? index}>
              <a className="underline" href={`#${item.id}`}>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-2 text-xs text-slate-500">목차의 항목을 클릭하면 해당 내용으로 이동합니다.</div>
      </div>

      <Section id="a1" title="제1조 (총칙)">
        <p className="text-sm text-slate-700 leading-6">
          본 처리방침은 회사가 제공하는 {meta.serviceName} 서비스(웹/앱/콘솔 포함)에 적용됩니다. 서비스 특성상 고객사(통신사/콜센터)가
          관리하는 통화·상담 데이터가 위탁 형태로 처리될 수 있으며, 이 경우 회사는 계약 및 관련 법령에 따라 안전하게 처리합니다.
        </p>
      </Section>

      <Section id="a2" title="제2조 (개인정보의 처리 목적)">
        <p className="text-sm text-slate-700 mb-3">
          회사는 다음 목적 범위 내에서 개인정보를 처리하며, 목적이 변경되는 경우 관련 법령에 따라 별도 동의를 받거나 필요한 조치를 이행합니다.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold">구분</th>
                <th className="py-3 px-4 font-extrabold">처리 목적</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold">고객사 임직원 계정(관리자/상담사)</td>
                <td className="py-3 px-4 text-slate-700">
                  회원가입/본인확인, 로그인 및 계정 관리, 권한(role) 관리, 고객지원/공지 전달, 보안/부정이용 방지
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">서비스 운영/보안</td>
                <td className="py-3 px-4 text-slate-700">
                  접속기록 분석, 장애/오류 대응, 시스템 보안 및 운영 안정성 확보, 감사 로그 관리
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">통화·상담 데이터(고객사 위탁)</td>
                <td className="py-3 px-4 text-slate-700">
                  실시간/사후 상담 지원(STT/요약/키워드/추천), 상담 품질 분석, 대시보드 제공, 리포트/통계 산출
                  (※ 위탁 범위는 고객사와의 계약에 따름)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="a3" title="제3조 (처리하는 개인정보 항목 및 수집 방법)">
        <p className="text-sm text-slate-700 leading-6">
          회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 처리합니다. 수집 방법은 회원가입/서비스 이용 과정에서의 입력,
          고객사 시스템 연동(API/CTI/Asterisk 등) 제공, 자동 생성 로그 등입니다.
        </p>

        <h4 className="mt-4 text-sm font-extrabold">1) 고객사 임직원 계정(회사 직접 처리)</h4>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold">항목</th>
                <th className="py-3 px-4 font-extrabold">필수/선택</th>
                <th className="py-3 px-4 font-extrabold">예시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4">이름, 이메일, 비밀번호(암호화 저장), 권한(role)</td>
                <td className="py-3 px-4">필수</td>
                <td className="py-3 px-4 text-slate-700">회원가입/로그인</td>
              </tr>
              <tr>
                <td className="py-3 px-4">회사명/부서/사번/연락처</td>
                <td className="py-3 px-4">선택(또는 고객사 정책에 따라 필수)</td>
                <td className="py-3 px-4 text-slate-700">권한관리/지원</td>
              </tr>
              <tr>
                <td className="py-3 px-4">접속 로그, IP, 기기/브라우저 정보, 쿠키/세션 정보</td>
                <td className="py-3 px-4">자동수집</td>
                <td className="py-3 px-4 text-slate-700">보안/장애 대응</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mt-6 text-sm font-extrabold">2) 통화·상담 데이터(고객사로부터 위탁받아 처리)</h4>
        <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          아래 항목은 고객사(통신사/콜센터)가 “개인정보처리자”로서 수집·이용 근거를 마련하고, 회사는 계약에 따라 “수탁자”로서 처리할 수 있습니다.
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold">항목</th>
                <th className="py-3 px-4 font-extrabold">예시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4">통화 메타데이터</td>
                <td className="py-3 px-4 text-slate-700">콜ID, 일시, 통화시간, 상담 채널, 상담 분류, 이관 정보 등</td>
              </tr>
              <tr>
                <td className="py-3 px-4">상담 내용/전사(STT)</td>
                <td className="py-3 px-4 text-slate-700">상담 대화 텍스트, 요약/키워드 추출을 위한 원문</td>
              </tr>
              <tr>
                <td className="py-3 px-4">AI 결과물</td>
                <td className="py-3 px-4 text-slate-700">요약, 키워드, 추천 멘트, 분류/예측 결과(민원/이탈징후 등)</td>
              </tr>
              <tr>
                <td className="py-3 px-4">고객사 제공 고객정보(필요 시)</td>
                <td className="py-3 px-4 text-slate-700">
                  이름(또는 마스킹/식별자), 연락처(마스킹), 가입/요금제/장애 이력 등(※ 계약/권한에 따라 제한)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="a4" title="제4조 (개인정보의 처리 및 보유 기간)">
        <p className="text-sm text-slate-700 mb-3">
          회사는 개인정보를 법령에 따른 보유·이용기간 또는 정보주체로부터 동의받은 기간 내에서 처리·보유하며, 기간 경과 시 지체 없이 파기합니다.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold">구분</th>
                <th className="py-3 px-4 font-extrabold">보유 기간</th>
                <th className="py-3 px-4 font-extrabold">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold">임직원 계정 정보</td>
                <td className="py-3 px-4 text-slate-700">회원 탈퇴/계정 삭제 시까지</td>
                <td className="py-3 px-4 text-slate-700">
                  부정이용 방지/분쟁 대응을 위해 일부 로그는 법령/내부정책에 따라 보관 가능
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">접속/감사 로그</td>
                <td className="py-3 px-4 text-slate-700">[예: 6개월~1년]</td>
                <td className="py-3 px-4 text-slate-700">보안/감사 목적(내부정책에 맞게 확정)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">통화·상담 데이터(위탁)</td>
                <td className="py-3 px-4 text-slate-700">고객사와의 계약 기간 및 고객사 지시에 따른 기간</td>
                <td className="py-3 px-4 text-slate-700">
                  계약 종료 또는 삭제 요청 시 파기(백업 포함 범위는 계약으로 정함)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="a5" title="제5조 (개인정보의 파기 절차 및 방법)">
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>파기 절차: 보유기간 경과 또는 처리목적 달성 시 파기 대상 선정 → 내부 승인 후 파기</li>
          <li>파기 방법: 전자적 파일은 복구 불가능한 방식으로 삭제, 출력물은 분쇄/소각</li>
          <li>위탁 데이터는 고객사 요청/계약에 따라 파기하며, 파기 결과를 고객사에 통지할 수 있습니다.</li>
        </ul>
      </Section>

      <Section id="a6" title="제6조 (개인정보의 제3자 제공)">
        <p className="text-sm text-slate-700">
          회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 근거가 있거나 정보주체의 동의를 받은 경우 등
          예외적으로 제공할 수 있습니다.
        </p>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          (현재 기준) 제3자 제공: <span className="font-extrabold">해당없음</span>
          <div className="mt-1 text-slate-600">
            ※ 제3자 제공이 발생하면 제공받는 자/목적/항목/보유기간을 표로 공개.
          </div>
        </div>
      </Section>

      <Section id="a7" title="제7조 (개인정보 처리업무의 위탁 및 재위탁)">
        <p className="text-sm text-slate-700 mb-3">
          회사는 원활한 서비스 제공을 위하여 개인정보 처리업무를 위탁할 수 있으며, 위탁 시 관련 법령에 따라 수탁자를 관리·감독합니다.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-extrabold">수탁자</th>
                <th className="py-3 px-4 font-extrabold">위탁업무</th>
                <th className="py-3 px-4 font-extrabold">보유/이용 기간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4">[클라우드/호스팅 사업자]</td>
                <td className="py-3 px-4 text-slate-700">서버 호스팅, 데이터 저장/백업, 서비스 운영 인프라</td>
                <td className="py-3 px-4 text-slate-700">위탁계약 종료 시까지</td>
              </tr>
              <tr>
                <td className="py-3 px-4">[메일/알림 발송 사업자]</td>
                <td className="py-3 px-4 text-slate-700">이메일/알림 발송</td>
                <td className="py-3 px-4 text-slate-700">위탁계약 종료 시까지</td>
              </tr>
              <tr>
                <td className="py-3 px-4">[고객지원/헬프데스크(운영 시)]</td>
                <td className="py-3 px-4 text-slate-700">고객문의 처리, 장애 대응</td>
                <td className="py-3 px-4 text-slate-700">위탁계약 종료 시까지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-slate-500">※ 재위탁 발생 시 고객사와 계약/법령에 따라 고지 및 관리합니다.</div>
      </Section>

      <Section id="a8" title="제8조 (개인정보의 국외 이전)">
        <p className="text-sm text-slate-700">
          회사는 원칙적으로 개인정보를 국외로 이전하지 않습니다. 국외 이전이 발생하는 경우 이전 국가, 이전받는 자, 이전 항목,
          이전 목적, 보유 기간, 거부 방법 등을 공개합니다.
        </p>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
          (현재 기준) 국외 이전: <span className="font-extrabold">[해당없음]</span>
        </div>
      </Section>

      <Section id="a9" title="제9조 (개인정보의 안전성 확보조치)">
        <p className="text-sm text-slate-700 mb-2">
          회사는 개인정보의 안전성 확보를 위해 관리적·기술적·물리적 조치를 시행합니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>관리적 조치: 내부관리계획 수립·시행, 정기 교육, 접근권한 최소화, 수탁자 관리·감독</li>
          <li>기술적 조치: 비밀번호 암호화, 접근통제, 권한관리, 전송구간 암호화(HTTPS), 로그 모니터링</li>
          <li>물리적 조치: 전산실/자료보관실 접근통제(해당 시), 보관장비 보호</li>
          <li>표시 제한: 대시보드/화면에서 개인정보 마스킹 등 최소 노출 정책 적용</li>
        </ul>
      </Section>

      <Section id="a10" title="제10조 (개인정보 자동 수집장치(쿠키) 운영)">
        <p className="text-sm text-slate-700">
          회사는 서비스 제공을 위해 쿠키를 사용할 수 있습니다(로그인 세션 유지, 보안 등). 사용자는 브라우저 설정을 통해 쿠키 저장을
          거부할 수 있으며, 거부 시 일부 기능이 제한될 수 있습니다.
        </p>

        <div className="mt-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
          <div className="font-extrabold">쿠키 사용 예</div>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>필수 쿠키: 로그인 유지, 보안 토큰</li>
            <li>선택 쿠키(운영 시): 이용 분석/개선(※ 도입 시 별도 고지/동의 체계 마련)</li>
          </ul>
        </div>
      </Section>

      <Section id="a11" title="제11조 (정보주체의 권리·의무 및 행사방법)">
        <p className="text-sm text-slate-700 mb-2">
          정보주체는 회사에 대해 개인정보 열람, 정정·삭제, 처리정지, 동의 철회 등을 요구할 수 있습니다. 회사는 지체 없이 조치하며,
          필요한 경우 본인 확인을 요청할 수 있습니다.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-extrabold">권리행사 방법</div>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>이메일: {meta.email}</li>
            <li>부서: {meta.dept}</li>
            <li>전화: {meta.tel}</li>
          </ul>
          <div className="mt-2 text-xs text-slate-600">
            ※ 고객사 위탁 데이터(통화/상담 기록 등) 권리행사는 고객사를 통해 접수·처리될 수 있습니다(계약/권한에 따름).
          </div>
        </div>
      </Section>

      <Section id="a12" title="제12조 (개인정보 보호책임자 및 고충처리)">
        <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
          <div className="font-extrabold mb-2">개인정보 보호책임자</div>
          <ul className="space-y-1">
            <li>성명: {meta.dpoName}</li>
            <li>부서: {meta.dept}</li>
            <li>이메일: {meta.email}</li>
            <li>전화: {meta.tel}</li>
            <li>주소: {meta.address}</li>
          </ul>
        </div>
      </Section>

      <Section id="a13" title="제13조 (권익침해 구제방법)">
        <p className="text-sm text-slate-700">
          개인정보 침해에 대한 신고/상담이 필요하신 경우 아래 기관에 문의하실 수 있습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 mt-2">
          <li>개인정보침해 신고센터(KISA) : 국번없이 118</li>
          <li>경찰청 사이버범죄 신고 : 국번없이 182</li>
          <li>개인정보 분쟁조정위원회 등 관계기관</li>
        </ul>
      </Section>

      <Section id="a14" title="제14조 (처리방침의 변경)">
        <p className="text-sm text-slate-700">
          본 처리방침은 {meta.effectiveDate}부터 적용되며, 법령/정책/서비스 변경에 따라 내용이 추가·삭제·수정될 수 있습니다.
          변경 시 서비스 내 공지(또는 웹페이지)를 통해 고지합니다.
        </p>

        <div className="mt-2 text-xs text-slate-500">
          시행일: {meta.effectiveDate} / 최종 수정일: {meta.lastUpdated}
        </div>

        <div className="mt-4">
          <a className="text-sm font-extrabold text-blue-600 underline" href="#top">
            ↑ 맨 위로
          </a>
        </div>
      </Section>

    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="mt-6">
      <h3 className="text-base font-extrabold mb-2">{title}</h3>
      {children}
    </section>
  );
}
