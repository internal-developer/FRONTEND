import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./signup.scss";
import kakaoLogo from "../../assets/images/loginbutton/kakao_logo.png";

export default function SignUpPage() {
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        const REST_API_KEY = "f768ba6915a8b6719ac46d7646324cdd";
        const REDIRECT_URI = "http://3.36.174.53:8080/login/oauth2/code/kakao";
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
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
