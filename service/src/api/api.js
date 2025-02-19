import axios from "axios";

const api = axios.create({
    // https://88a4bc8c-ee34-4b4f-8049-f82299929461.mock.pstmn.io ==> postman mock server url
    // process.env.REACT_APP_BASE_URL
    baseURL: "http://3.36.174.53:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    //withCredentials: true,  // JSESSIONID 포함
});

// 요청 인터셉터 추가 ==> 요청 헤더에 jwt 토큰 자동으로 추가되도록 
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

