import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
    // process.env.REACT_APP_BASE_URL
    baseURL: "http://3.36.174.53:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 토큰 만료 여부 확인 함수
const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.exp)
        return true;
    return decoded.exp * 1000 < Date.now();
}

// 토큰 자동 갱신 예약 함수
let refreshTimeoutId = null;
const scheduleRefresh = () => {
    // 이전 타이머가 있으면 제거
    if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
    }
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
        const decoded = jwtDecode(accessToken);
        if (decoded && decoded.exp) {
            const refreshTime = decoded.exp * 1000 - Date.now(); // 만료까지 남은 시간
            if (refreshTime <= 0) {
                // 이미 만료 시간이 1분 이내면 즉시 갱신
                console.log("토큰이 곧 만료됩니다. 즉시 갱신합니다.");
                refreshAccessToken();
            } else {
                // 만료 1분 전에 갱신 예약
                console.log(`토큰 갱신 예약 완료: ${Math.round(refreshTime / 1000)}초 후 갱신`);
                refreshTimeoutId = setTimeout(() => {
                    refreshAccessToken();
                }, refreshTime);
            }
        }
    } catch (error) {
        console.error("토큰 갱신 예약 중 오류:", error);
    }
};

// 토큰 갱신 함수
let refreshPromise = null;
const refreshAccessToken = async () => {
    if (refreshPromise) {
        return refreshPromise; // 이미 토큰 갱신 중이면 기존 Promise 반환
    }

    refreshPromise = new Promise(async (resolve, reject) => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            // refreshToken이 없으면 바로 로그아웃 처리
            if (!refreshToken) {
                handleLogout();
                console.log("유효한 refresh token이 없습니다.");
                return;
            }
            // refresh token으로 새 access token 요청
            const res = await axios.post("http://3.36.174.53:8080/auth/refresh", {}, {
                headers: {
                    "Refresh-Token": `Bearer ${refreshToken}`,
                },
            });
            // 새 access token 저장
            const newAccessToken = res.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            console.log("새 access token으로 갱신 성공");
            scheduleRefresh(); // 다음 갱신 예약
            resolve(newAccessToken);
        } catch (refreshError) {
            console.error("새 access Token 발급 실패:", refreshError);
            console.error("오류 세부 정보:", refreshError.response?.data);
            handleLogout();
            reject(refreshError);
        } finally {
            refreshPromise = null;
        }
    });
    return refreshPromise;
};

// 요청 인터셉터 ==> 요청 헤더에 jwt access token 자동 추가
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken && isTokenExpired(accessToken)) {
            try {
                const newAccessToken = await refreshAccessToken();
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error("토큰 갱신 실패:", error);
            }
        } else if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 ==> access token 만료 시 refresh token으로 갱신
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        // 401 오류이고 재시도하지 않은 경우에만 처리
        if (error.response && error.response.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true; // 재시도 방지 플래그 추가
            try {
                const newAccessToken = await refreshAccessToken();
                // 원래 요청 헤더를 새로 발급받은 access token으로 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const handleLogout = async () => {
    try {
        // 예약된 갱신 타이머가 있으면 취소
        if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId);
            refreshTimeoutId = null;
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        await api.get("/cleanguard/logout");
        console.log("로그아웃 완료");
        window.location.href = "/signup";
    } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        // 로그아웃 요청 실패해도 클라이언트 측에서 강제 로그아웃 처리
        window.location.href = "/signup";
    }
};

// 초기화 함수 ==> 앱 시작 시 호출
const initAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        // 토큰이 있으면 자동 갱신 예약
        scheduleRefresh();
    }
    // URL에 전달된 jwt 토큰을 로컬 스토리지에 저장
    const query = new URLSearchParams(window.location.search);
    const urlAccessToken = query.get("access_token");
    const urlRefreshToken = query.get("refresh_token");

    if (urlAccessToken && urlRefreshToken) {
        localStorage.setItem("accessToken", urlAccessToken);
        localStorage.setItem("refreshToken", urlRefreshToken);
        // 새 토큰으로 갱신 예약
        scheduleRefresh();
    }
};

initAuth();

export default api;

