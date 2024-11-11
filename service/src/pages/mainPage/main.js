import React, { useEffect, useState } from 'react'
import './main.scss'
import Header from './components/header/Header'
import CCTVSidemenu from './components/cctvSidemenu/CCTVSidemenu'
import VideoViewer from './components/videoViewer/VideoViewer'
import Graph from './components/graph/Graph'
import dumpingData from '../../data/dumpingData.json'

function Main() {
    const [dumpingEvent, setDumpingEvent] = useState([]);

    useEffect(()=>{
        setDumpingEvent(dumpingData);
    }, []);

    return (
        <div className='main'>
            <div className='main-container'>
                <Header />
                <div className='main-content'>
                    <div className='sidemenu'>
                        <CCTVSidemenu />
                    </div>
                    <div className='video-viewer'>
                        <VideoViewer />
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

