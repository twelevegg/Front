// A tiny event bus to simulate CTI/Asterisk events.
// In production, replace emitCallConnected() with your WebSocket/SSE handler.

export const callEventBus = new EventTarget();

// ✅ 전화 수신(울림) 이벤트
// - 실제 연동에서는 Asterisk/CTI 이벤트를 여기로 연결하세요.
export function emitCallRinging(payload) {
  callEventBus.dispatchEvent(new CustomEvent('CALL_RINGING', { detail: payload }));
}

export function emitCallConnected(payload) {
  callEventBus.dispatchEvent(new CustomEvent('CALL_CONNECTED', { detail: payload }));
}

// 통화 종료 이벤트(선택)
export function emitCallEnded(payload) {
  callEventBus.dispatchEvent(new CustomEvent('CALL_ENDED', { detail: payload }));
}
