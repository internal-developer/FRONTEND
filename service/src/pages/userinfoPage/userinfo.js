import "./userinfo.scss";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { IoIosArrowBack } from "react-icons/io";

export default function UserInfoPage() {
    const [step, setStep] = useState(1); // step 1: 역할 선택, step 2: CCTV 선택
    const [cctvList, setCctvList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentRoleId, setCurrentRoleId] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedCCTV, setSelectedCCTV] = useState([]);
    const [initialCCTV, setInitialCCTV] = useState([]); // 초기 CCTV 상태 저장
    const navigate = useNavigate();

    useEffect(() => {
        // 사용자 데이터 요청
        api.get("/cleanguard")
            .then((response) => {
                console.log("사용자 정보 가져오기 성공(userinfo.js):", response.data);
                const role = response.data.role;
                setCurrentRoleId(role.roleId);
                // 역할이 정해져 있는 경우(roleId!=1) 수정 모드로 진입
                if (role.roleId !== 1) {
                    setEditMode(true);
                    setSelectedRole(role.roleName);
                    setSelectedCCTV(role.stream || []);
                    setInitialCCTV(role.stream || []);
                }
            })
            .catch((error) => {
                console.error("사용자 정보 가져오기 실패(userinfo.js):", error);
            });
    }, [navigate]);

    useEffect(() => {
        // cctv 데이터 요청
        if (!currentRoleId || !selectedRole) return;

        const cctvPromise = selectedRole == "admin"
            ? api.get("/cleanguard/cctv/")
            : api.get(`/cleanguard/cctv/${currentRoleId}`);

        cctvPromise
            .then((response) => {
                setCctvList(response.data);
                console.log("CCTV 데이터 가져오기 성공(userinfo.js):", response.data);
            }).catch((error) => {
                console.error("CCTV 데이터 가져오기 실패(userinfo.js):", error);
            });

    }, [currentRoleId, selectedRole]);

    // 역할 생성/수정 처리 함수
    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            alert("역할을 선택해주세요.");
            return;
        }

        try {
            const roleDTO = {
                roleName: selectedRole,
                stream: selectedCCTV,
            };

            if (editMode) {
                // 역할 수정
                roleDTO.roleId = currentRoleId; // 수정 모드에서 roleId 포함하기 (추가 모드에서는 roldId 포함x)
                const response = await api.patch(`/cleanguard/role/${currentRoleId}`, roleDTO);
                console.log("수정된 역할 :", response.data);
            } else {
                // 역할 추가 
                const response = await api.post("/cleanguard/role", roleDTO);
                console.log("추가된 역할 :", response.data);
                setCurrentRoleId(response.data.roleId);
                setSelectedRole(response.data.roleName);
            }

            // 역할 추가/수정 성공 후 사용자 정보 다시 가져오기
            const userInfoRes = await api.get("/cleanguard");
            console.log("역할 추가 후 업데이트된 사용자 정보:", userInfoRes.data);
            const updatedRole = userInfoRes.data.role;
            setSelectedRole(updatedRole.roleName);
            setSelectedCCTV(updatedRole.stream || []);
            setInitialCCTV(updatedRole.stream || []);
            //alert(editMode ? "역할이 성공적으로 수정되었습니다." : "역할이 성공적으로 추가되었습니다.");
            setStep(2);
        } catch (error) {
            console.error(editMode ? "역할 수정 실패:" : "역할 추가 실패:", error);
            alert(editMode ? "역할 수정 중 오류가 발생했습니다. 다시 시도하세요" : "역할 추가 중 오류가 발생했습니다. 다시 시도하세요");
        }
    };

    // CCTV stream 추가/수정 처리 함수
    const handleStreamSubmit = async (e) => {
        e.preventDefault();
        if (!currentRoleId || currentRoleId === 1) {
            alert("역할이 설정되지 않았습니다. 다시 시도해주세요.");
            setStep(1);
            return;
        }

        try {
            const roleDTO = {
                roleId: currentRoleId,
                roleName: selectedRole,
                stream: selectedCCTV,
            };
            await api.post(`/cleanguard/role/${currentRoleId}`, roleDTO);
            console.log("추가/수정된 stream :", roleDTO);
            alert("CCTV가 성공적으로 추가되었습니다.");
            setInitialCCTV(selectedCCTV); // 제출 후 초기 상태 업데이트
            setTimeout(() => navigate("/main"), 1000);
        } catch (error) {
            console.error("stream 추가 실패:", error);
            alert("CCTV 추가 중 오류가 발생했습니다. 다시 시도하세요.");
        }
    };

    // CCTV 체크박스 개별 선택 핸들러
    const handleCCTVSelect = (streamName) => {
        setSelectedCCTV((prev) =>
            prev.includes(streamName)
                ? prev.filter((name) => name !== streamName)
                : [...prev, streamName]
        );
    };

    // CCTV 체크박스 전체 선택/해제 핸들러
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCCTV(cctvList.map((cctv) => cctv.stream));
        } else {
            setSelectedCCTV([]);
        }
    };

    // 뒤로 가기 시 초기 CCTV 상태로 복원
    const handleGoBack = () => {
        setSelectedCCTV(initialCCTV);
        setStep(1);
    };

    useEffect(() => {
        console.log("checkedItems 업데이트됨:", selectedCCTV);
    }, [selectedCCTV]);

    return (
        <div className="main">
            <div className="userinfo-main-container">
                {step === 1 ? (
                    // step 1: 역할 선택
                    <form className="userinfo-form" onSubmit={handleRoleSubmit}>
                        <div className="userinfo-label" >
                            <div className="userinfo-title">{editMode ? "역할 수정" : "역할 설정"}</div>
                            역할을 선택해주세요.
                            {/* <label className="userinfo-label">
                                닉네임을 입력해주세요.
                                <input
                                    className="userinfo-input"
                                    type="text"
                                    placeholder="8-16자의 한글만 사용 가능합니다."
                                />
                            </label>
                            <label className="userinfo-label">
                                전화번호를 입력해주세요.
                                <input
                                    className="userinfo-input"
                                    type="text"
                                    placeholder="010-1234-5678"
                                />
                            </label> */}
                            <select
                                className="userinfo-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">역할을 선택해주세요.</option>
                                <option value="admin">관리자</option>
                                {/* <option value="manager">매니저</option> */}
                                <option value="user">일반 사용자</option>
                            </select>
                        </div>
                        <div className="userinfo-form-container">
                            <div className="userinfo-message">
                                역할 설정 후 CCTV를 추가할 수 있습니다.
                            </div>
                            <button className="userinfo-button" type="submit">
                                다음
                            </button>

                        </div>
                    </form>
                ) : (
                    // step 2: CCTV 선택
                    <form className="userinfo-form-step2" onSubmit={handleStreamSubmit}>
                        <div className="userinfo-label-step2">
                            <div className="userinfo-title-step2"> CCTV 추가</div>
                            관리할 CCTV를 선택해주세요.
                        </div>
                        <div className="userinfo-cctv-container">
                            {cctvList.length === 0 ? (
                                <div className="userinfo-message2">
                                    아직 등록된 CCTV가 없습니다. <br /> 시작하기를 눌러 메인 화면으로 이동하세요.
                                </div>
                            ) : (
                                <div className="userinfo-cctv-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCCTV.length === cctvList.length && cctvList.length > 0}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th>CCTV 이름</th>
                                                <th>위치</th>
                                                <th>설치 날짜</th>
                                                <th>스트림 이름</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cctvList.map((cctv) => (
                                                <tr
                                                    key={cctv.stream}
                                                    onClick={() => handleCCTVSelect(cctv.stream)}
                                                >
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCCTV.includes(cctv.stream)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={() => handleCCTVSelect(cctv.stream)}
                                                        />
                                                    </td>
                                                    <td>{cctv.cctvName}</td>
                                                    <td>{cctv.location}</td>
                                                    <td>{cctv.cctvDate}</td>
                                                    <td>{cctv.stream}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="userinfo-form-container">
                            <div
                                className="userinfo-button-retry"
                                onClick={handleGoBack}
                            >
                                <IoIosArrowBack className="userinfo-retry-icon" />
                                역할 다시 선택하기
                            </div>
                            <button
                                className="userinfo-button"
                                type="submit"
                            //disabled={cctvList.length === 0 || !currentRoleId}
                            >
                                시작하기
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
}
