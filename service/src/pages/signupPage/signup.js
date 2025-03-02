import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./signup.scss";
import kakaoLogo from "../../assets/images/loginbutton/kakao_logo.png";

export default function SignUpPage() {
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        const BACKEND_OAUTH2_URL = "http://3.36.174.53:8080/oauth2/authorization/kakao";
        window.location.href = BACKEND_OAUTH2_URL;
    };
    

    return (
        <div className="main">
            <div className="signup-main-container">
                <p className="sign-up">Sign up</p>
                <p className="signup-text">회원가입</p>
                <button onClick={handleKakaoLogin} className="kakao-login-btn">
                    <img
                        src={kakaoLogo}
                        alt="아이콘"
                        className="kakao-login-btn-logo"
                    />
                    카카오로 로그인하기
                </button>
            </div>
        </div>
    );
}
