import React, { useEffect, useState } from "react";
import "./main.scss";
import Header from "./components/header/Header";
import CCTVSidemenu from "./components/cctvSidemenu/CCTVSidemenu";
import VideoViewer from "./components/videoViewer/VideoViewer";
import Graph from "./components/graph/Graph";
//import cctvData from '../../data/cctvData.json'
import dumpingData from "../../data/dumpingData.json";
import AddModal from "./components/cctvSidemenu/AddModal";
import EditModal from "./components/cctvSidemenu/EditModal";
import DeleteModal from "./components/cctvSidemenu/DeleteModal";
import api from "../../api/api"; // axios 인스턴스 호출

function Main() {
    const [dumpingEvent, setDumpingEvent] = useState([]);
    const [cctvList, setCctvList] = useState([]);
    const [selectedCCTV, setSelectedCCTV] = useState(null);
    const [multiView, setMultiView] = useState(true);
    const [roleName, setRoleName] = useState("user"); // 임시 roleName 'user'
    // modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // useEffect(() => {
    //     api.get("/main")
    //         .then((response) => {
    //             console.log("로그인된 사용자:", response.data);
    //         })
    //         .catch(() => {
    //             console.log("로그인되지 않음");

    //         });
    // }, []);

    useEffect(() => {
        // CCTV 데이터 가져오기 
        // api.get(`/cleanguard/cctv/${roleName}`) // roleName에 따라 cctv목록 불러오기
        api.get(`/cleanguard/cctv/`) // 전체 cctv목록 불러오기 -> 수정요망
            .then((response) => {
                setCctvList(response.data);
                console.log("CCTV 데이터 가져오기 성공:", response.data);
            })
            .catch((error) => {
                console.error("CCTV 데이터 가져오기 실패:", error);
            });

        // dumpingData 가져오기
        // api.get(`/cleanguard/image/${roleName}`)
        //     .then((response) => {
        //         setDumpingEvent(response.data);
        //         console.log("Dumping 데이터 가져오기 성공:", response.data);
        //     })
        //     .catch((error) => {
        //         console.error("Dumping 데이터 가져오기 실패:", error);
        //     });

        // 선택된 cctv 디폴트 값 -> 가장 첫번째 cctv 뜨도록 설정
        // if (cctvData.length > 0)
        //     setSelectedCCTV(cctvData[0]);
    }, [roleName]);

    return (
        <div className="main">
            <div className="main-container">
                <Header />
                <div className="main-content">
                    <div className="sidemenu">
                        <CCTVSidemenu
                            cctvList={cctvList}
                            onCCTVSelect={setSelectedCCTV}
                            setMultiView={setMultiView}
                            setShowAddModal={setShowAddModal}
                            setShowEditModal={setShowEditModal}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    </div>
                    <div className="video-viewer">
                        <VideoViewer
                            cctvList={cctvList}
                            setSelectedCCTV={setSelectedCCTV}
                            selectedCCTV={selectedCCTV}
                            multiView={multiView}
                            setMultiView={setMultiView}
                            // dumpingData={dumpingEvent}
                            dumpingData={dumpingData}
                        />
                    </div>
                    <div className="graph">
                        <Graph dumpingEvent={dumpingEvent} />
                    </div>
                </div>
            </div>
            {showAddModal && <AddModal setShowAddModal={setShowAddModal} />}
            {showEditModal && (
                <EditModal
                    setShowEditModal={setShowEditModal}
                    selectedCCTV={selectedCCTV}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    selectedCCTV={selectedCCTV} />
            )}
        </div>
    );
}

export default Main;
