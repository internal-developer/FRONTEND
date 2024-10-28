import React, { useState, useEffect } from 'react'
import './CCTVSidemenu.scss'
import cctvData from '../../../../data/cctvData.json'

function CCTVSidemenu() {
    const [cctvList, setCctvList] = useState([]);

    useEffect(() => {
        // api 호출 - 목업 데이터 임시로 넣음(cctvData)
        setCctvList(cctvData);
    }, [])

    return (
        <div className='menu'>
            <div className='menu-title'>Menu</div>
            <div className='menu-subtitle'>연결된 CCTV 목록</div>
            <div className='menu-cctvList'>
                <ul>
                    {cctvList.map((cctv) => (
                        <li key={cctv.id}>
                            {cctv.name} ({cctv.location})
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default CCTVSidemenu