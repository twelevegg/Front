// src/utils/mask.js

/**
 * ✅ 이름 마스킹 (한글/영문 모두 대응)
 * - 한글(공백 없음): 1글자 '*', 2글자 '김*', 3글자 '김은*', 4+ '김*원'
 * - 영문/공백 포함: 토큰별 마스킹 (Grace Park -> G***e P**k)
 */
export function maskName(name) {
  if (!name) return '';
  const s = String(name).trim();
  if (!s) return '';

  // 영문/공백 포함 이름 처리
  if (/\s/.test(s) || /[A-Za-z]/.test(s)) {
    return s
      .split(/\s+/)
      .map(maskToken)
      .join(' ');
  }

  // 한글(공백 없음) 기본 처리
  if (s.length === 1) return '*';
  if (s.length === 2) return `${s[0]}*`;
  if (s.length === 3) return `${s[0]}${s[1]}*`;
  return `${s[0]}*${s[s.length - 1]}`;
}

function maskToken(token) {
  if (!token) return '';
  const t = token.trim();
  if (t.length <= 1) return '*';
  if (t.length === 2) return `${t[0]}*`;
  if (t.length === 3) return `${t[0]}*${t[2]}`;
  return `${t[0]}${'*'.repeat(t.length - 2)}${t[t.length - 1]}`;
}
