export const mockCalls = [
  {
    id: 'C-20260107-1041',
    title: '요금 과다 청구/환불',
    datetime: '2026-01-07 10:11',
    summary: '고객이 지난달 요금이 평소보다 많이 나왔다고 문의함. 확인 결과 부가서비스 가입 내역이 있어 안내했으나, 가입한 적 없다고 환불 요청함.',
    qa: '고객 맞이 인사 양호. 공감적 경청 태도 우수. 다만 환불 규정 설명 시 다소 방어적인 태도가 보였음.',
    log: [
      { speaker: '상담원', text: '반갑습니다, 고객님. 텔레상담센터 김미소입니다.' },
      { speaker: '고객', text: '아니, 요금지서 보니까 돈이 왜 이렇게 많이 나왔어요? 이거 뭐에요?' },
      { speaker: '상담원', text: '아, 요금 때문에 많이 놀라셨겠습니다. 제가 바로 확인해드리겠습니다.' },
      { speaker: '고객', text: '빨리 좀 봐주세요. 나 참 어이가 없어서.' },
      { speaker: '상담원', text: '확인해보니 지난달 25일에 [영화무제한] 부가서비스가 가입되어 있습니다.' }
    ],
    sentiment: 'Negative',
    customerName: '홍길동',
    duration: '05:23',
    keywords: ['요금', '환불', '부가서비스']
  },
  {
    id: 'C-20260106-1658',
    title: '인터넷 끊김/해지 문의',
    datetime: '2026-01-06 16:58',
    summary: '저녁 시간대 인터넷 연결이 불안정하다며 불만 제기. 해지 위약금 문의함. 품질 부서 접수 및 위약금 안내 완료.',
    qa: '불만 고객 응대 매뉴얼 준수함. 품질 문의 접수 절차를 정확히 안내함.',
    log: [
      { speaker: '상담원', text: '안녕하세요, 고객님.' },
      { speaker: '고객', text: '인터넷이 자꾸 끊겨요. 이거 해지하려면 위약금 얼마나 물어야 해요?' }
    ],
    sentiment: 'Negative',
    customerName: '김철수',
    duration: '03:10',
    keywords: ['인터넷', '해지', '위약금']
  },
  {
    id: 'C-20260105-0920',
    title: '결합 상품 가입 문의',
    datetime: '2026-01-05 09:20',
    summary: '인터넷+TV 결합 상품 가입 시 혜택 문의. 요금제 비교 후 베이직 결합 상품 가입 유도 성공.',
    qa: '상품 지식 정확함. 적극적인 세일즈 스킬 우수.',
    log: [
      { speaker: '상담원', text: '안녕하세요, 텔레콤입니다.' },
      { speaker: '고객', text: '지금 인터넷 쓰고 있는데 TV랑 합치면 얼마나 싸져요?' }
    ],
    sentiment: 'Positive',
    customerName: '이영희',
    duration: '08:15',
    keywords: ['결합', '가입', '할인']
  },
  {
    id: 'C-20260104-1430',
    title: '이사 이전 신청',
    datetime: '2026-01-04 14:30',
    summary: '이사로 인한 이전 설치 예약 요청. 희망 날짜 조율 후 예약 확정함.',
    qa: '절차 안내 명확함. 주소지 재확인 철저.',
    log: [],
    sentiment: 'Neutral',
    customerName: '박지성',
    duration: '04:45',
    keywords: ['이사', '이전', '예약']
  },
  {
    id: 'C-20260104-1100',
    title: '멤버십 등급 문의',
    datetime: '2026-01-04 11:00',
    summary: 'VIP 등급 조건 문의. 전월 실적 부족 안내.',
    qa: '친절하게 응대하였으나 고객이 다소 아쉬워함.',
    log: [],
    sentiment: 'Neutral',
    customerName: '최동원',
    duration: '02:20',
    keywords: ['멤버십', '등급']
  }
];
