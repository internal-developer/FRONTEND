import axios from "axios";

const api = axios.create({
    // https://88a4bc8c-ee34-4b4f-8049-f82299929461.mock.pstmn.io ==> postman mock server url
    // process.env.REACT_APP_BASE_URL
    baseURL: "http://3.36.174.53:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,  // JSESSIONID 포함
});

// 요청 인터셉터 ==> 요청 헤더에 jwt access token 자동 추가
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
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
        console.log(originalRequest);
        console.log("에러 응답:", error.response);
        console.log("응답 없음", error.request);
        console.log("에러 메시지:", error.message);

        // access token 만료 시 
        if (error.response && error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true; // 재시도 플래그 추가
            try {
                // refresh token으로 새 access token 요청
                const refreshToken = localStorage.getItem("refreshToken");

                const res = await api.post("/auth/refresh", {}, {
                    headers: {
                        "Refresh-Token": `Bearer ${refreshToken}`,
                    },
                });
                // 새 access token 저장
                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);
                console.log("새 access token으로 갱신 성공");

                // 원래 요청 헤더를 새로 발급받은 access token으로 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("새 access Token 발급 실패:", refreshError);

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

