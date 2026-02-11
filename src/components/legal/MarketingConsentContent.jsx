export default function MarketingConsentContent() {
    const meta = {
        companyName: 'Aivle12',
        serviceName: 'CS Navigator',
        effectiveDate: '2026-02-11',
        email: 'jdg.secure@gmail.com',
    };

    return (
        <div className="text-slate-800" id="top">
            <h2 className="text-xl font-extrabold">마케팅 정보 수신 동의</h2>

            <p className="text-sm text-slate-600 mt-2">
                {meta.companyName}(이하 “회사”)는 {meta.serviceName} 서비스와 관련하여,
                고객님께 더 나은 서비스와 혜택을 제공하기 위해 아래와 같이 마케팅 정보를 수신하는 것에 동의를 구합니다.
            </p>

            <Section title="1. 수집 및 이용 목적">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    <li>신규 서비스(기능) 개발 및 맞춤 서비스 제공</li>
                    <li>이벤트 및 광고성 정보 제공 (뉴스레터, 프로모션, 웨비나 초대 등)</li>
                    <li>서비스 이용 통계 분석 및 마케팅 자료 활용</li>
                </ul>
            </Section>

            <Section title="2. 수집하는 개인정보 항목">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    <li>이름, 이메일 주소, 휴대전화번호</li>
                    <li>소속 회사/부서 정보 (B2B 서비스 특성상)</li>
                </ul>
            </Section>

            <Section title="3. 보유 및 이용 기간">
                <p className="text-sm text-slate-700 font-bold mb-1">
                    동의 철회 시 또는 회원 탈퇴 시까지
                </p>
                <p className="text-xs text-slate-500">
                    단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
                </p>
            </Section>

            <Section title="4. 동의 거부 권리 및 불이익">
                <p className="text-sm text-slate-700">
                    귀하는 본 마케팅 정보 수신 동의를 거부할 권리가 있습니다.
                    동의를 거부하더라도 기본 서비스 이용에는 제한이 없으나,
                    이벤트 및 혜택 정보를 받으실 수 없습니다.
                </p>
            </Section>

            <Section title="5. 전송 방법">
                <p className="text-sm text-slate-700">
                    이메일, 문자메시지(SMS/LMS), 앱 푸시 알림 등을 통해 전송됩니다.
                </p>
            </Section>

            <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
                <p>시행일자: {meta.effectiveDate}</p>
                <p>문의: {meta.email}</p>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="mt-6">
            <h3 className="text-sm font-extrabold mb-2 text-slate-800">{title}</h3>
            {children}
        </section>
    );
}
