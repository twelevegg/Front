// A tiny event bus to simulate CTI/Asterisk events.
// In production, replace emitCallConnected() with your WebSocket/SSE handler.

export const callEventBus = new EventTarget();

export function emitCallConnected(payload) {
  callEventBus.dispatchEvent(new CustomEvent('CALL_CONNECTED', { detail: payload }));
}

// 통화 종료 이벤트(선택)
export function emitCallEnded(payload) {
  callEventBus.dispatchEvent(new CustomEvent('CALL_ENDED', { detail: payload }));
}
