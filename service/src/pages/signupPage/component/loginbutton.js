import React, { useEffect } from "react";
import { kakaoLogin } from "../../../auth/auth";

function LoginButton() {
    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("f9e88fc9ed2b6def07cab1e90d1e82e6");
        }
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname",
            success: async function (authObj) {
                try {
                    const userData = await kakaoLogin(authObj.access_token);
                    console.log("User logged in:", userData);
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
            fail: function (err) {
                console.error("Kakao Login Failed:", err);
            },
        });
    };

    return (
        <button onClick={handleKakaoLogin} id="kakao-button" className="login-button">
            카카오 로그인
        </button>
    );
}

export default LoginButton;
