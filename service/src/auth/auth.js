import { api } from "../api/api";

// 카카오 로그인 (OAuth)
export async function kakaoLogin(token) {
    try {
        const response = await api.post("/auth/kakao", { token });
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data;
    } catch (error) {
        console.error("Kakao login failed:", error);
        throw error;
    }
}

// 로그아웃
export async function handleLogout() {
    try {
        const response = await api.get("/cleanguard/logout");
        console.log("로그아웃 응답:", response.data);

        const redirectUrl = response.data?.logoutUrl;
        if (
            redirectUrl &&
            typeof redirectUrl === "string" &&
            redirectUrl.startsWith("https://kauth.kakao.com/oauth/logout")
        ) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = redirectUrl;
        } else {
            throw new Error("로그아웃 오류 발생");
        }
    } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        throw error; // Header에서 에러 처리
    }
}
