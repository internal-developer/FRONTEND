import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/mainPage/main";
import SignUpPage from "./pages/signupPage/signup";
import UserInfoPage from "./pages/userinfoPage/userinfo";
import KakaoCallback from "./auth/kakaocallback";
import LogInfoPage from "./pages/logInfoPage/logInfo";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Navigate to="/signup" />}></Route>
                <Route path="/signup" element={<SignUpPage />}></Route>
                <Route path="/main" element={<MainPage />}></Route>
                <Route path="/userinfo" element={<UserInfoPage />}></Route>
                <Route
                    path="/auth/kakao/callback"
                    element={<KakaoCallback />}
                ></Route>
                <Route path="/loginfo" element={<LogInfoPage />}></Route>
            </Routes>
        </div>
    );
}

export default App;
