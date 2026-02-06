export class NotificationService {
    constructor() {
        this.socket = null;
        this.listeners = {};
        this.userId = null;
        this.reconnectInterval = 3000;
    }

    connect(userId) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

        this.userId = userId;

        // ✅ URL 결정 로직 (환경변수 기반)
        // ✅ URL 결정 로직 (환경변수 기반)
        const getWsBase = () => {
            // 이 서비스는 FastAPI(/ai)에 연결되므로 FAST_API_BASE_URL 우선 사용
            let apiBase = import.meta.env.VITE_FAST_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '';

            // http -> ws, https -> wss 자동 변환
            if (apiBase.startsWith('http')) {
                apiBase = apiBase.replace(/^http/, 'ws');
            }

            // URL 결합 시 /ai 중복 방지 (Base URL에 이미 /ai가 있다면 제거)
            if (apiBase.endsWith('/ai')) {
                apiBase = apiBase.slice(0, -3);
            }

            return apiBase;
        };

        const wsBase = getWsBase();
        const wsUrl = `${wsBase}/ai/api/v1/agent/notifications/${userId}`;

        console.log(`NotificationService: Connecting to ${wsUrl}`);
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log("NotificationService: Connected");
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("NotificationService: Message received", data);
                this.dispatch(data.type, data);
            } catch (e) {
                console.error("NotificationService: Error parsing message", e);
            }
        };

        this.socket.onclose = () => {
            console.log("NotificationService: Disconnected. Reconnecting in 3s...");
            setTimeout(() => this.connect(this.userId), this.reconnectInterval);
        };

        this.socket.onerror = (error) => {
            console.error("NotificationService: Error", error);
            this.socket.close();
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    on(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }

    off(eventType, callback) {
        if (!this.listeners[eventType]) return;
        this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }

    dispatch(eventType, payload) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(payload));
        }
    }
}

export const notificationService = new NotificationService();
