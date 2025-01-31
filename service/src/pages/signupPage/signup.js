import './signup.scss';
import api from "../api/api";

export default function SignUpPage() {
    return (
        <div className="SignUpPage">
            <div className="form-container">
                <h2 className="sign-up">Sign up</h2>
                <p className="signup-text">회원가입</p>
                <button id="kakao-button" className="login-button"></button>
            </div>
        </div>
    );
}
