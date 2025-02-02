import React, { useState } from "react";
import "./Modal.scss";
import api from "../../../../api/api";

function AddModal({ setShowAddModal }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    //const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [url, setUrl] = useState("");

    const addCCTV = () => {
        // if (!url.startsWith("rtsp://") && !url.startsWith("http://")) {
        //     alert("올바른 CCTV URL을 입력하세요 (rtsp:// 또는 http://)");
        //     return;
        // }

        const newCCTV = { cctvName: name, location, cctvDate: date, videoUrl: url };
        api
            .post("/cleanguard/cctv", newCCTV)
            .then((response) => {
                console.log("추가된 CCTV :", response.data);
                setShowAddModal(false);
                alert("CCTV가 성공적으로 추가되었습니다.");
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
                    <div className="add-input-container">
                        <div>CCTV Url</div>
                        <input
                            type="text"
                            name="cctv-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
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
