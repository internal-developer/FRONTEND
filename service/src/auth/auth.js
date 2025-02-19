import api from "../api/api";

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
export async function logout() {
    try {
        await api.get("/cleanguard/logout");
        localStorage.removeItem("accessToken");
        window.location.reload();
    } catch (error) {
        console.error("Logout failed:", error);
    }
}
