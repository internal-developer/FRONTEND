import api from "./api";

// 로그인한 사용자 정보 가져오기
export async function cleanguard() {
    try {
        const response = await api.get("/cleanguard");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        return null;
    }
}

// 사용자 정보 수정
export async function updateUserInfo(updatedData) {
    try {
        const response = await api.patch("/cleanguard", updatedData);
        return response.data;
    } catch (error) {
        console.error("Failed to update user info:", error);
        throw error;
    }
}
