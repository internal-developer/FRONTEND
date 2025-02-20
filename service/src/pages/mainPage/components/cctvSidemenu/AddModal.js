import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import "./Modal.scss";
import api from "../../../../api/api";

function AddModal({ setShowAddModal, setCctvList }) {
    //const [url, setUrl] = useState("");
    //const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [webcamList, setWebcamList] = useState([]); // 웹캠 목록 저장용 -> 하단 웹캠 선택 콤보박스에서 사용
    const [webcam, setWebcam] = useState("");

    useEffect(() => {
        // local에 연결된 웹캠 목록 가져오기
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput'); // 웹캠만 뜨도록 필터링
                setWebcamList(videoDevices);
                console.log("웹캠 목록:", videoDevices); // 웹캠 목록 확인 로그

                // 디폴트로 첫번째 웹캠 선택되도록 설정
                if (videoDevices.length > 0) {
                    setWebcam(videoDevices[0].deviceId);
                }
            })
            .catch(error => {
                console.error("웹캠 목록 가져오기 실패:", error);
            });
    }, []);

    const addCCTV = () => {
        const newCCTV = { cctvName: name, location, cctvDate: date, webcamId: webcam };
        api
            .post("/cleanguard/cctv/", newCCTV)
            .then((response) => {
                console.log("추가된 CCTV :", response.data);
                // cctv 리스트에 새 cctv 추가
                setCctvList(prevList => [...prevList, response.data]);
                setShowAddModal(false);
                alert("CCTV가 성공적으로 추가되었습니다.");
                console.log(newCCTV)
            })
            .catch((error) => {
                console.error("CCTV 추가 실패:", error);
                alert("CCTV 추가 중 오류가 발생했습니다. 다시 시도하세요");
            });
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
                        />
                    </div>
                    <div className="add-input-container">
                        <div>위치</div>
                        <input
                            type="text"
                            name="cctv-location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                        <div>설치일자</div>
                        <input
                            type="datetime-local"
                            name="cctv-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    {/* <div className="add-input-container">
                        <div>CCTV Url</div>
                        <input
                            type="text"
                            name="cctv-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div> */}
                    <div className="add-input-container">
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
                    </div>
                </div>
                <div className="add-container-footer">
                    <button className="add-button" onClick={addCCTV}>
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddModal;
