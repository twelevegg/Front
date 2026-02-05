import { apiFetch } from './client';

export const memberService = {
    /**
     * 신입 사원 목록 조회 (기본: 최근 3개월)
     * GET /api/v1/members/new?months=3
     */
    getNewHires: async (months = 3) => {
        return await apiFetch(`/api/v1/members/new?months=${months}`);
    }
};
