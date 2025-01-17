import React, { useEffect, useState } from 'react'
import './main.scss'
import Header from './components/header/Header'
import CCTVSidemenu from './components/cctvSidemenu/CCTVSidemenu'
import VideoViewer from './components/videoViewer/VideoViewer'
import Graph from './components/graph/Graph'
import cctvData from '../../data/cctvData.json'
import dumpingData from '../../data/dumpingData.json'
import AddModal from './components/cctvSidemenu/AddModal'
import EditModal from './components/cctvSidemenu/EditModal'
import DeleteModal from './components/cctvSidemenu/DeleteModal'

function Main() {
    const [dumpingEvent, setDumpingEvent] = useState([]);
    const [cctvList, setCctvList] = useState([]);
    const [selectedCCTV, setSelectedCCTV] = useState(null);
    const [multiView, setMultiView] = useState(true);
    // modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
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
                        <CCTVSidemenu
                            cctvList={cctvList}
                            onCCTVSelect={setSelectedCCTV}
                            setMultiView={setMultiView}
                            setShowAddModal={setShowAddModal}
                            setShowEditModal={setShowEditModal}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    </div>
                    <div className='video-viewer'>
                        <VideoViewer
                            cctvList={cctvList}
                            setSelectedCCTV={setSelectedCCTV}
                            selectedCCTV={selectedCCTV}
                            multiView={multiView}
                            setMultiView={setMultiView}
                        />
                    </div>
                    <div className='graph'>
                        <Graph dumpingEvent={dumpingEvent} />
                    </div>
                </div>
            </div>
            {showAddModal && <AddModal setShowAddModal={setShowAddModal} />}
            {showEditModal &&
                <EditModal
                    setShowEditModal={setShowEditModal}
                    selectedCCTV={selectedCCTV}
                />}
            {showDeleteModal && <DeleteModal setShowDeleteModal={setShowDeleteModal} />}
        </div>


    )
}

export default Main

