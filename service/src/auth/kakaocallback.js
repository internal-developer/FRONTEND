import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token"); // 백엔드에서 전달한 JWT 토큰

        if (!token) {
            console.error("JWT 토큰 없음");
            return;
        }

        localStorage.setItem("accessToken", token); // JWT 토큰 저장
        console.log("로그인 성공, 토큰:", token);

        // ✅ 로그인 성공 후 메인 페이지로 이동
        navigate("/main");
    }, [searchParams, navigate]);

    return <div>로그인 처리 중...</div>;
}
