import React from "react";
function Signup() {
    // 임시 로그인 페이지
    // 로그인 버튼 클릭 -> 카카오 로그인 페이지로 이동 -> 로그인 완료 후 프론트의 /main 페이지로 리다이렉트
    const handleLogin = () => {
        window.location.href = `${process.env.REACT_APP_BASE_URL}/oauth2/authorization/kakao`;
    };

    return (
        <div>
            <button style={{ height: '50px' }} onClick={handleLogin}>카카오 로그인</button>
        </div>
    );
}

export default Signup;
