import React, { useState, useEffect } from 'react'
import './CCTVSidemenu.scss'

function CCTVSidemenu({cctvList, onCCTVSelect}) {
    return (
        <div className='menu'>
            <div className='menu-title'>Menu</div>
            <div className='menu-subtitle'>연결된 CCTV 목록</div>
            <div className='menu-cctvList'>
                <ul>
                    {cctvList.map((cctv) => (
                        <li key={cctv.id} onClick={()=> onCCTVSelect(cctv)}>
                            {cctv.name} ({cctv.location})
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default CCTVSidemenu