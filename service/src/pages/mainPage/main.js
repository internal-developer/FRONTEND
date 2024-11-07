import React, { useEffect, useState } from 'react'
import './main.scss'
import Header from './components/header/Header'
import CCTVSidemenu from './components/cctvSidemenu/CCTVSidemenu'
import VideoViewer from './components/videoViewer/VideoViewer'
import Graph from './components/graph/Graph'
import cctvData from '../../data/cctvData.json'
import dumpingData from '../../data/dumpingData.json'

function Main() {
    const [dumpingEvent, setDumpingEvent] = useState([]);
    const [cctvList, setCctvList] = useState([]);
    const [selectedCCTV, setSelectedCCTV] = useState(null);

    useEffect(()=>{
        setDumpingEvent(dumpingData);
        setCctvList(cctvData);
        // 선택된 cctv 디폴트 값 -> 가장 첫번째 cctv 뜨도록 설정
        if (cctvData.length > 0) 
            setSelectedCCTV(cctvData[0]);
    }, []);
    
    return (
        <div className='main'>
            <div className='main-container'>
                <Header />
                <div className='main-content'>
                    <div className='sidemenu'>
                        <CCTVSidemenu cctvList={cctvList} onCCTVSelect={setSelectedCCTV}/>
                    </div>
                    <div className='video-viewer'>
                        <VideoViewer cctvList={cctvList} selectedCCTV={selectedCCTV} />
                    </div>
                    <div className='graph'>
                        <Graph dumpingEvent={dumpingEvent}/>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Main

