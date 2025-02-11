import './signup.scss';
import LoginButton from "./component/loginbutton";
import KakaoLogin from './component/kakaologin';

export default function SignUpPage() {
    return (
        <div className="SignUpPage">
            <div className="form-container">
                <h2 className="sign-up">Sign up</h2>
                <p className="signup-text">회원가입</p>
                <KakaoLogin/>
            </div>
        </div>
    );
}
