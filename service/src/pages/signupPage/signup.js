import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import './signup.scss';

export default function SignUpPage() {
    const navigate = useNavigate();

    const handleKakaoLogin = () => {
        const BACKEND_OAUTH2_URL = "http://3.36.174.53:8080/oauth2/authorization/kakao";
        window.location.href = BACKEND_OAUTH2_URL;
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
