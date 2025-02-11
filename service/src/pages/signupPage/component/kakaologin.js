import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cleanguard } from "../../../api/user";
import api from "../../api/api";

const KakaoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadKakaoSdk = () => {
      if (!window.Kakao) {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
          window.Kakao.init(process.env.REACT_APP_KAKAO_SECRET);
        };
        document.head.appendChild(script);
      } else if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_SECRET);
      }
    };

    loadKakaoSdk();
  }, []);

  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      console.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      scope: "profile_nickname",
      success: async function (authObj) {
        try {
          const response = await window.Kakao.API.request({
            url: "/v2/user/me",
          });
          const kakaoAccount = response.kakao_account;
          console.log(kakaoAccount);

          // 사용자가 서버에 로그인 상태인지 확인하려면 /cleanguard GET 요청을 통해 정보를 받아옵니다
          const result = await cleanguard(authObj.access_token);

          console.log("사용자 데이터가 서버에 성공적으로 전송되었습니다.");
          console.log("서버 응답:", result);

          if (result && result.accessToken) {
            // 응답에 토큰이 있는 경우 저장
            console.log("토큰:", result.accessToken);
            localStorage.setItem("token", result.accessToken);

            // 기존 사용자와 신규 사용자를 구분하여 리디렉션
            navigate("/userform");
          } else {
            console.error("서버 응답에 토큰이 없습니다.");
          }
        } catch (error) {
          console.error(
            "카카오 사용자 데이터를 가져오거나 서버에 전송하는 중 오류가 발생했습니다:",
            error
          );
        }
      },
      fail: (error) => {
        console.error("카카오 로그인 실패:", error);
      },
    });
  };

  return (
    <div className="kakaoLogin">
      <button onClick={handleKakaoLogin}>Login with Kakao</button>
    </div>
  );
};

export default KakaoLogin;
