import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import './signup.scss';

export default function SignUpPage() {
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        const REST_API_KEY = "f768ba6915a8b6719ac46d7646324cdd";
        const REDIRECT_URI = "http://3.36.174.53:8080/login/oauth2/code/kakao";
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };

    return (
        <div className="SignUpPage">
            <div className="form-container">
                <h2 className="sign-up">Sign up</h2>
                <p className="signup-text">회원가입</p>
                <button onClick={handleKakaoLogin} className="kakao-login-btn">
                    
                </button>
            </div>
        </div>
    );
}
