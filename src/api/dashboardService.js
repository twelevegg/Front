import { apiFetch, apiFetchFast } from './client';

export const dashboardService = {
    /**
     * 관리자용 글로벌 KPI 조회
     * GET /api/v1/dashboards/admin/kpi
     */
    getGlobalKpi: async () => {
        // apiFetch returns the parsed JSON data directly
        return await apiFetch('/api/v1/dashboards/admin/kpi');
    },

    /**
     * 상담원용 개인 KPI 조회
     * GET /api/v1/dashboards/my/kpi
     * (Dev Mode: Using test endpoint with memberId param for easier testing)
     */
    getMemberKpi: async (memberId = 1) => {
        // 실제 운영 환경에서는 Auth Token에서 memberId를 추출하므로 /api/v1/dashboards/my/kpi 를 사용해야 함.
        // 현재 개발 편의성을 위해 PathVariable로 id를 받는 테스트 엔드포인트 사용 가능 여부 확인 필요.
        // Controller에 /my/kpi/test/{memberId} 가 있으므로 이를 사용.
        return await apiFetch(`/api/v1/dashboards/my/kpi/test/${memberId}`);
    },

    /**
     * 심사위원용 실시간 상담 시뮬레이션 시작
     * POST /ai/api/v1/simulation/start
     */
    startSimulation: async () => {
        // AI 서버 (FastAPI)로 요청
        // Spring이 아닌 FastAPI로 직접 요청해야 하므로 apiFetchFast 사용
        // VITE_FAST_API_BASE_URL에 이미 /ai가 포함되어 있으므로 /ai 제거
        return await apiFetchFast('/api/v1/simulation/start', {
            method: 'POST'
        });
    }
};

