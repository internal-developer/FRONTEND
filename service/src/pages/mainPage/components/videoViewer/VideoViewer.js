import React from 'react'
import './VideoViewer.scss'

function VideoViewer() {
    return (
        <div className='viewer'>
            <div className='viewer-title'>현재 CCTV: </div>
            <div className='viewer-video'><img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png'/></div>
            <div className='viewer-count'>금일 투기 적발 건수: 5건</div>
            <div className='viewer-capture'></div>
        </div>
    )
}

export default VideoViewer