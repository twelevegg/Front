import { getWebSocketUrl } from '../utils/websocketUtils.js';

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

        // ✅ URL 결정 (유틸 사용)
        const wsUrl = getWebSocketUrl(`/ai/api/v1/agent/notifications/${userId}`);

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
