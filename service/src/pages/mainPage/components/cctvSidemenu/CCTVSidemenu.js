import React, { useState } from "react";
import "./CCTVSidemenu.scss";

function CCTVSidemenu({
    cctvList,
    onCCTVSelect,
    setMultiView,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowLog,
}) {
    const [hoveredCCTV, setHoveredCCTV] = useState(null);
    const [showPopup, setShowPopup] = useState(true);

    const handleMouseEnter = (cctv) => {
        setHoveredCCTV(cctv);
        setShowPopup(true);
    };

    const handleMouseLeave = () => {
        setHoveredCCTV(null);
        setShowPopup(false);
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
