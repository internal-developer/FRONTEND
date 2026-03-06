import React, { useState } from "react";
import "./CCTVSidemenu.scss";
import { streamApi } from "../../../../api/api";

function CCTVSidemenu({
    cctvList,
    onCCTVSelect,
    setMultiView,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowLog,
    handleRestartStream,
}) {
    const [hoveredCCTV, setHoveredCCTV] = useState(null);
    const [showPopup, setShowPopup] = useState(true);
    const [restarting, setRestarting] = useState({});

    const handleMouseEnter = (cctv) => {
        setHoveredCCTV(cctv);
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setHoveredCCTV(null);
        setShowPopup(false);
    };

    const handleRestart = async (cctv) => {
        try {
            setRestarting((prev) => ({ ...prev, [cctv.stream]: true }));

            const streamRequestDTO = {
                streamName: cctv.stream,
                cameraId: cctv.id,
                cameraPassword: cctv.passwd,
                cameraIp: cctv.ip,
            };

            const response = await streamApi.post("/api/stream/restart", streamRequestDTO);
            console.log(`${cctv.stream} 스트림 재접속:`, response.data);

            // 부모 컴포넌트에 재접속 알림
            handleRestartStream(cctv.stream);
            //alert(`${cctv.cctvName} 재접속 요청이 완료되었습니다.`);

        } catch (err) {
            alert(`재접속 실패: ${err.message}`);
            console.error(` ${cctv.stream} 재접속 실패:`, err);
        } finally {
            setRestarting((prev) => ({ ...prev, [cctv.stream]: false }));
        }
    };

    return (
        <div className="menu">
            <div className="menu-title">Menu</div>
            <div className="menu-subtitle">연결된 CCTV 목록</div>
            <div className="menu-cctvList">
                {cctvList.length === 0 ? (
                    <div className="menu-cctvList-empty">
                        <p>연결된 CCTV가 없습니다</p>
                        <div className="menu-cctvList-empty-add-btn" onClick={() => setShowAddModal(true)}>
                            + 추가하기
                        </div>
                    </div>
                ) : (
                    <>
                        {cctvList.map((cctv) => (
                            <div className="menu-cctvList-li"
                                key={cctv.stream}
                                onClick={() => {
                                    onCCTVSelect(cctv);
                                    setMultiView(false);
                                }}
                                onMouseEnter={() => handleMouseEnter(cctv)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {cctv.cctvName} ({cctv.location})
                                <div
                                    className={`popup ${hoveredCCTV === cctv && showPopup
                                        ? "visible"
                                        : ""
                                        }`}
                                >
                                    <div onClick={() => setShowAddModal(true)}>
                                        추가
                                    </div>
                                    <div onClick={() => setShowEditModal(true)}>
                                        수정
                                    </div>
                                    <div onClick={() => setShowDeleteModal(true)}>
                                        삭제
                                    </div>
                                    <div onClick={() => setShowLog(true)}>
                                        상세 기록
                                    </div>
                                    <div
                                        onClick={() => handleRestart(cctv)}
                                        disabled={restarting[cctv.stream]}
                                    >
                                        {restarting[cctv.stream] ? "재접속 중" : "재접속"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            {cctvList.length !== 0 && (
                <button
                    className="menu-multiView-btn"
                    onClick={() => setMultiView(true)}
                >
                    CCTV 멀티뷰
                </button>
            )}
        </div>
    );
}

export default CCTVSidemenu;
