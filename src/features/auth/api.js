import api from "../../app/apiClient";

/**
 * 회원가입 (PUBLIC)
 */
export async function signupApi(payload) {
  try {
    const { data } = await api.post("/api/v1/auth/signup", payload);
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "회원가입에 실패했습니다.";
    throw new Error(msg);
  }
}

/**
 * 로그인 (PUBLIC) - 토큰은 보통 여기서 발급됨
 * 백엔드 연결 전이면 호출 시 네트워크 에러가 날 수 있음(정상)
 */
export async function loginApi(payload) {
  try {
    const { data } = await api.post("/api/v1/auth/login", payload);
    return data; // 예: { accessToken, user }
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "로그인에 실패했습니다.";
    throw new Error(msg);
  }
}

/**
 * 내 정보 조회 (PROTECTED) - 토큰 붙이는 건 로그인 이후 단계에서 인터셉터로 처리하는게 일반적
 * 지금은 백엔드 미연결이면 실패할 수 있음(정상)
 */
export async function meApi() {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "사용자 정보를 불러오지 못했습니다.";
    throw new Error(msg);
  }
}
