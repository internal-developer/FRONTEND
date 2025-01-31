import React, { useState } from 'react'
import './CCTVSidemenu.scss'

function CCTVSidemenu({
    cctvList,
    onCCTVSelect,
    setMultiView,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal
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
        <div className='menu'>
            <div className='menu-title'>Menu</div>
            <div className='menu-subtitle'>연결된 CCTV 목록</div>
            <div className='menu-cctvList'>
                <ul>
                    {cctvList.map((cctv) => (
                        <li
                            key={cctv.cctvId}
                            onClick={() => { onCCTVSelect(cctv); setMultiView(false);}}
                            onMouseEnter={() => handleMouseEnter(cctv)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {cctv.cctvName} ({cctv.location})
                            {hoveredCCTV === cctv && showPopup === true && (
                                <div className='popup'>
                                    <div onClick={() => setShowAddModal(true)}>추가</div>
                                    <div onClick={() => setShowEditModal(true)}>수정</div>
                                    <div onClick={() => setShowDeleteModal(true)}>삭제</div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <button className='menu-multiView-btn' onClick={() => setMultiView(true)}>CCTV 멀티뷰</button>
        </div>

    )
}

export default CCTVSidemenu