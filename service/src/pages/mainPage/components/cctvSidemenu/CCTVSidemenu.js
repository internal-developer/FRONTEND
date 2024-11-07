import React, { useState } from 'react'
import './CCTVSidemenu.scss'

function CCTVSidemenu({ cctvList, onCCTVSelect }) {
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
                            key={cctv.id}
                            onClick={() => onCCTVSelect(cctv)}
                            onMouseEnter={()=>handleMouseEnter(cctv)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {cctv.name} ({cctv.location})
                            {hoveredCCTV === cctv && showPopup === true &&(
                                <div className='popup'>
                                    <div>추가</div>
                                    <div>수정</div>
                                    <div>삭제</div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CCTVSidemenu