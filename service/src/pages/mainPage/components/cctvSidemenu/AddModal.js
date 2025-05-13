import React, { useEffect, useState } from "react";
import "./Modal.scss";
import { api, streamApi } from "../../../../api/api";

function AddModal({ setShowAddModal, setCctvList, roleId, userInfo }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(() => {
        // 디폴트 값: 오늘 날짜, 시간 
        const now = new Date();
        const kstOffset = 9 * 60; // KST는 UTC+9
        const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
        return kstDate.toISOString().slice(0, 16);
    });
    // const [cameraType, setCameraType] = useState(""); // 카메라 타입 (ip camera or webcam)
    // const [webcamList, setWebcamList] = useState([]); // 웹캠 목록 저장용 -> 하단 웹캠 선택 콤보박스에서 사용
    const [webcam, setWebcam] = useState(null); // webcam 기능 사용 x -> webcamid 값 null 값 넣음
    const [streamName, setStreamName] = useState("");
    const [cameraId, setCameraId] = useState("");
    const [cameraPassword, setCameraPassword] = useState("");
    const [cameraIp, setCameraIp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     // local에 연결된 웹캠 목록 가져오기
    //     navigator.mediaDevices.enumerateDevices()
    //         .then(devices => {
    //             const videoDevices = devices.filter(device => device.kind === 'videoinput'); // 웹캠만 뜨도록 필터링
    //             setWebcamList(videoDevices);
    //             console.log("웹캠 목록:", videoDevices); // 웹캠 목록 확인 로그

    //             // 디폴트로 첫번째 웹캠 선택되도록 설정
    //             if (videoDevices.length > 0) {
    //                 setWebcam(videoDevices[0].deviceId);
    //             }
    //         })
    //         .catch(error => {
    //             console.error("웹캠 목록 가져오기 실패:", error);
    //         });
    // }, []);

    const validateInput = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = true;
        if (!location.trim()) newErrors.location = true;
        if (!date) newErrors.date = true;
        if (!streamName.trim()) newErrors.streamName = true;
        if (!cameraIp.trim()) newErrors.cameraIp = true;
        else {
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(cameraIp)) newErrors.cameraIp = true;
        }
        if (!cameraId.trim()) newErrors.cameraId = true;
        if (!cameraPassword.trim()) newErrors.cameraPassword = true;
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            alert("모든 항목을 입력하세요.")
        }
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field) => {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
        });
    };

    const addCCTV = async () => {
        setErrors({});
        setIsLoading(true);

        if (!validateInput()) {
            setIsLoading(false);
            return;
        }

        const newCCTV = {
            cctvName: name,
            location,
            cctvDate: date,
            webcamId: webcam,
            stream: streamName,
        };

        const streamRequest = {
            streamName,
            cameraId,
            cameraPassword,
            cameraIp
        };

        try {
            const cctvResponse = await api.post("/cleanguard/cctv/", newCCTV);
            console.log("추가된 CCTV :", cctvResponse.data);

            const streamResponse = await streamApi.post("/api/stream/start", streamRequest);
            console.log("스트림 시작 :", streamResponse.data);

            if (roleId) {
                const currentStream = userInfo.role.stream || [];
                const roleDTO = {
                    roleId: roleId,
                    roleName: userInfo.role.roleName,
                    stream: [...currentStream, streamName],
                };
                const roleResponse = await api.post(`/cleanguard/role/${roleId}`, roleDTO);
                console.log("역할에 스트림 추가:", roleResponse.data);
            }

            // cctv 리스트에 새 cctv 추가
            const cctvListResponse = await api.get(`/cleanguard/cctv/${roleId}`);
            setCctvList(cctvListResponse.data);
            setShowAddModal(false);
            alert("CCTV가 성공적으로 추가되었습니다.");
            console.log(newCCTV);
        } catch (error) {
            console.error("CCTV 추가 or 스트림 실패:", error);
            alert("CCTV 추가 중 오류가 발생했습니다. 다시 시도하세요");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add">
            <div className="add-container">
                <div className="add-container-header">
                    <div>&nbsp;</div>
                    <div className="add-container-header-title">새 CCTV 추가</div>
                    <div
                        className="add-container-header-close"
                        onClick={() => setShowAddModal(false)}
                    >
                        닫기
                    </div>
                </div>
                <div className="add-container-body">
                    <div className="add-input-container">
                        <div>CCTV 이름</div>
                        <input
                            type="text"
                            name="cctv-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onClick={() => clearError("name")}
                            disabled={isLoading}
                            className={errors.name ? "error" : ""}
                            placeholder="CCTV 이름을 입력하세요"
                        />
                    </div>
                    <div className="add-input-container">
                        <div>위치</div>
                        <input
                            type="text"
                            name="cctv-location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onClick={() => clearError("location")}
                            disabled={isLoading}
                            className={errors.location ? "error" : ""}
                            placeholder="설치 위치를 입력하세요"
                        />
                    </div>
                    {/* <div className="add-input-container">
                        <div>상태</div>
                        <div className="add-radio-container">
                            <input
                                type="radio"
                                name="cctv-status"
                                value="등록"
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <span>등록</span>
                            <input
                                type="radio"
                                name="cctv-status"
                                value="미등록"
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <span>미등록</span>
                            <input
                                type="radio"
                                name="cctv-status"
                                value="오류"
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <span>오류</span>
                        </div>
                    </div> */}
                    <div className="add-input-container">
                        <div>설치 날짜</div>
                        <input
                            type="datetime-local"
                            name="cctv-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onClick={() => clearError("date")}
                            disabled={isLoading}
                            className={errors.date ? "error" : ""}
                        />
                    </div>
                    <div className="add-input-container">
                        <div>IP 주소</div>
                        <input
                            type="text"
                            name="camera-ip"
                            value={cameraIp}
                            onChange={(e) => setCameraIp(e.target.value)}
                            placeholder="ex) 123.123.1.123"
                            onClick={() => clearError("cameraIp")}
                            disabled={isLoading}
                            className={errors.cameraIp ? "error" : ""}
                        />
                    </div>
                    <div className="add-input-container">
                        <div>카메라 ID</div>
                        <input
                            type="text"
                            name="camera-id"
                            value={cameraId}
                            onChange={(e) => setCameraId(e.target.value)}
                            onClick={() => clearError("cameraId")}
                            disabled={isLoading}
                            className={errors.cameraId ? "error" : ""}
                            placeholder="카메라 ID를 입력하세요"
                        />
                    </div>
                    <div className="add-input-container">
                        <div>카메라 패스워드</div>
                        <input
                            type="password"
                            name="camera-password"
                            value={cameraPassword}
                            onChange={(e) => setCameraPassword(e.target.value)}
                            onClick={() => clearError("cameraPassword")}
                            disabled={isLoading}
                            className={errors.cameraPassword ? "error" : ""}
                            placeholder="카메라 패스워드를 입력하세요"
                        />
                    </div>
                    <div className="add-input-container">
                        <div>스트림 이름</div>
                        <input
                            type="text"
                            name="stream-name"
                            value={streamName}
                            onChange={(e) => setStreamName(e.target.value)}
                            onClick={() => clearError("streamName")}
                            disabled={isLoading}
                            className={errors.streamName ? "error" : ""}
                            placeholder="스트림 이름을 입력하세요"
                        />
                    </div>



                    {/* <div className="add-input-container">
                        <div>현재 연결된 웹캠 목록</div>
                        <select
                            className="webcam-dropbox"
                            value={webcam || ""}
                            onChange={(e) => setWebcam(e.target.value)}
                        >
                            {webcamList.length === 0 ? ( // 연결된 웹캠이 없을 시
                                <option value="" disabled>
                                    현재 연결된 웹캠이 없습니다.
                                </option>
                            ) : (
                                webcamList.map(webcam => (
                                    <option key={webcam.deviceId} value={webcam.deviceId}>
                                        {webcam.label || `Webcam ${webcam.deviceId}`}
                                    </option>
                                ))
                            )}
                        </select>
                    </div> */}
                </div>
                <div className="add-container-footer">
                    <button
                        className="add-button"
                        onClick={addCCTV}
                        disabled={isLoading}
                    >
                        {isLoading ? "처리 중..." : "추가"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddModal;
