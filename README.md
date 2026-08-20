# CleanGuard

**CleanGuard**는 기존에 설치된 CCTV만으로 공공장소의 무단투기를 자동으로 감지하는 AI 기반 서비스입니다.

- AI가 CCTV 영상 속 사람과 쓰레기의 움직임을 실시간으로 분석해 무단투기 행위를 스스로 판별하고 증거를 남깁니다.
- 관리자는 CleanGuard가 걸러낸 감지 기록과 통계만 확인하면 되므로, 반복적인 단속·모니터링 없이도 넓은 지역을 효율적으로 관리할 수 있습니다.
- 쌓인 감지 데이터는 향후 예방 정책을 세우는 데도 활용할 수 있습니다.

---

## 서비스 핵심 기능

CleanGuard는 **관리자가 사용하는 웹 서비스**와, 그 뒤에서 무단투기를 판별하는 **인공지능 모델** 두 축으로 이루어져 있습니다.

### 🖥️ 관리자 웹 기능

- 담당 CCTV의 연결 상태와 위치를 한눈에 파악
- 여러 대의 CCTV 화면을 동시에 보는 **멀티뷰**, 하나만 크게 보는 **단일뷰** 지원
- AI가 감지한 무단투기 장면의 캡처 영상과 로그 조회
- 지역별·시간대별 투기 발생 빈도를 통계로 제공해 상습 투기 지점 파악 지원

### 🤖 인공지능 기능

- **YOLOv11** 객체 탐지 모델을 직접 튜닝해 사람과 쓰레기 객체를 실시간 탐지
- Python + OpenCV로 구현한 행위 조건부 판단 로직으로, 단순히 물건이 놓이거나 지나가는 상황과 실제 투기 행위를 구분해 오탐지 최소화
- 무단투기로 판단되면 이벤트 기록 → 영상 저장 → 관리자 화면 경고 알림까지 자동 처리

---

## 프론트엔드 핵심 기능

서비스 기능을 관리자가 실제로 사용할 수 있도록, 프론트엔드에서는 다음 기능들을 구현했습니다.

| 기능 | 설명 |
|---|---|
| 카카오 계정 로그인 | 별도 회원가입 없이 카카오 OAuth2로 로그인, JWT 기반 인증으로 세션 유지 |
| CCTV 추가 / 삭제 / 수정 | 이름·위치·IP 주소·스트림 정보와 함께 CCTV 등록 및 관리 |
| 투기 건수 그래프 | 지역별 · 시간별 투기 건수를 그래프로 시각화 |
| 기록 및 상세 페이지 | CCTV별 감지 이력 목록 조회 및 상세 내용·캡처 이미지 확인 |
| 오탐 처리 및 영구 삭제 | 잘못 감지된 이미지를 오탐으로 분류하거나 불필요한 기록을 영구 삭제 |

---

## 시연

카카오 로그인 → CCTV 등록 → 실시간 모니터링 → 무단투기 감지 알림 → 기록 관리까지, 전체 흐름을 아래 순서로 확인할 수 있습니다.

### 1. 로그인
카카오 계정으로 로그인합니다. 최초 로그인 시에는 관리자 / 일반 사용자 역할을 먼저 설정합니다.

https://github.com/user-attachments/assets/4e752d23-3c0a-4085-a3cb-b5bd79d037a5

### 2. 메인 화면 및 CCTV 등록
메인 화면에서 등록된 CCTV 목록을 확인하고, IP 카메라 2대를 새로 추가합니다.

https://github.com/user-attachments/assets/a476f894-4eae-4c84-8185-18ead563d06a

### 3. 실시간 영상 및 통계 확인
CCTV 영상을 멀티뷰 또는 단일뷰로 확인하고, 지역별·시간별 투기 건수 그래프로 현황을 파악합니다.

https://github.com/user-attachments/assets/e50e671a-b210-4b69-80b2-966333293633

### 4. 무단투기 감지 및 알림
무단투기 상황이 발생하면 AI가 감지해 알림 토스트를 띄우고, 감지된 CCTV 위치를 즉시 알려줍니다.

https://github.com/user-attachments/assets/4a0fd4d2-5141-40d2-aa83-5229f5c95b88

### 5. 상세 페이지 및 캡처 영상 확인
감지 이벤트의 상세 기록 페이지에서 캡처 이미지를 확인하고, 오탐 항목은 분류 오류 처리하거나 영구 삭제합니다.

https://github.com/user-attachments/assets/35ee4e1a-4aec-48ad-a74b-558a917bfa62

### 6. CCTV 추가 / 수정 / 삭제
사이드 메뉴에서 CCTV 정보를 수정하거나 더 이상 사용하지 않는 CCTV를 삭제합니다.

https://github.com/user-attachments/assets/378a1876-084c-4f1b-8659-70e210af8ea1

### 7. 유저 정보 및 로그아웃
헤더의 프로필 영역에서 내 정보와 역할을 확인하고 로그아웃합니다.

https://github.com/user-attachments/assets/30df1269-2abf-4028-86d8-ec3cbd2aa26b


---

## 기대 효과

CleanGuard가 실제 지자체에 도입된다면 다음과 같은 효과를 기대할 수 있습니다.

| 효과 | 내용 |
|---|---|
| 🚨 단속 자동화 및 인력 부담 해소 | AI가 무단투기를 자동으로 감지·기록해 사람이 CCTV를 직접 지켜볼 필요가 줄어듭니다. |
| 📍 반복 투기 지역 사전 대응 | 시간대·장소별 감지 로그 분석으로 상습 투기 지점을 미리 파악해 선제 대응할 수 있습니다. |
| 🗺️ 전국 지자체 확장 가능성 | 기존 CCTV 인프라만 있으면 적용 가능한 구조로, 연수구 파일럿을 시작으로 전국 확장이 용이합니다. |
| 🏙️ 스마트 도시 솔루션 기여 | 생활환경 개선과 행정 효율성 향상을 동시에 이끄는 스마트 도시 솔루션으로 기능합니다. |

---

## 기술 스택

CleanGuard는 AI 탐지, 백엔드, 프론트엔드가 맞물려 동작하는 시스템입니다. 이 저장소는 그중 **프론트엔드**를 담당합니다.

### 시스템 전체 구성

| 구분 | 기술 스택 |
| :--- | :--- |
| **AI / 객체 탐지** | ![YOLOv11](https://img.shields.io/badge/YOLOv11-111F68?style=flat-square) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white) |
| **백엔드** | ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **프론트엔드** | ![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black) |

### 프론트엔드 상세 스택

| 구분 | 기술 스택 |
| :--- | :--- |
| **언어 및 프레임워크** | ![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Create React App](https://img.shields.io/badge/Create%20React%20App-09D3AC?style=flat-square&logo=createreactapp&logoColor=white) |
| **라우팅** | ![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **통신** | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) ![SSE](https://img.shields.io/badge/Server--Sent%20Events-000000?style=flat-square) |
| **인증** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![Kakao](https://img.shields.io/badge/Kakao%20OAuth-FFCD00?style=flat-square&logo=kakao&logoColor=black) |
| **실시간 CCTV 스트리밍** | ![AWS](https://img.shields.io/badge/AWS%20Kinesis%20Video%20Streams-232F3E?style=flat-square&logo=amazonaws&logoColor=white) ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat-square&logo=webrtc&logoColor=white) |
| **차트 / 통계** | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) |
| **스타일링** | ![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=sass&logoColor=white) |

---

## 프로젝트 구조

이 저장소는 CleanGuard 시스템 중 프론트엔드만 담당하며, 소스는 `service/` 디렉터리 아래 페이지 단위로 구성되어 있습니다.

```
FRONTEND/
└── service/                # React 프로젝트 루트
    └── src/
        ├── App.js             # 라우트 정의
        ├── api/               # axios 인스턴스, JWT 인증 인터셉터
        ├── auth/              # 카카오 로그인/로그아웃, 콜백 처리
        └── pages/
            ├── signupPage/      # 카카오 로그인 진입 페이지
            ├── userinfoPage/    # 역할 설정 + CCTV 선택
            └── mainPage/        # CCTV 관제 대시보드
                └── components/
                    ├── cctvSidemenu/  # CCTV 목록 / 추가 / 수정 / 삭제
                    ├── videoViewer/   # 실시간 영상 뷰어 (WebRTC)
                    ├── graph/         # 투기 건수 통계 그래프
                    └── log/           # 감지 기록, 분류 오류 처리
```

