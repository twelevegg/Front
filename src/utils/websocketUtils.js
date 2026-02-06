/**
 * WebSocket 주소를 생성하는 유틸리티 함수
 * 
 * VITE_API_BASE_URL 환경변수를 기반으로 올바른 WebSocket 프로토콜(ws:// 또는 wss://)을 결정합니다.
 * - HTTP -> WS
 * - HTTPS -> WSS
 * 
 * @param {string} endpoint - 연결할 엔드포인트 경로 (예: '/ai/api/v1/...')
 * @returns {string} 완성된 WebSocket URL
 */
export const getWebSocketUrl = (endpoint) => {
    // 환경변수에서 기본 API 주소를 가져옵니다. 없으면 빈 문자열.
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';

    let wsBase = apiBase;

    // 프로토콜 변환 로직
    if (apiBase.startsWith('https')) {
        // 이미 https라면 wss로 변환 (replace가 더 안전)
        wsBase = apiBase.replace(/^https/, 'wss');
    } else if (apiBase.startsWith('http')) {
        // http라면 ws로 변환
        wsBase = apiBase.replace(/^http/, 'ws');
    }
    // 프로토콜이 없는 경우 등은 그대로 둘 수도 있지만, 
    // 보통 VITE_API_BASE_URL은 http(s)://가 포함된 형태라고 가정합니다.

    return `${wsBase}${endpoint}`;
};
