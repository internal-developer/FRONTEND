import React, { useEffect, useState } from "react";
import "./main.scss";
import Header from "./components/header/Header";
import CCTVSidemenu from "./components/cctvSidemenu/CCTVSidemenu";
import VideoViewer from "./components/videoViewer/VideoViewer";
import Graph from "./components/graph/Graph";
import Log from "./components/log/Log";
//import cctvData from '../../data/cctvData.json'
import dumpingData from "../../data/dumpingData.json";
import AddModal from "./components/cctvSidemenu/AddModal";
import EditModal from "./components/cctvSidemenu/EditModal";
import DeleteModal from "./components/cctvSidemenu/DeleteModal";
import { api } from "../../api/api"; // axios 인스턴스 호출
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useNavigate } from "react-router-dom";

function Main() {
    const [dumpingEvent, setDumpingEvent] = useState([]);
    const [cctvList, setCctvList] = useState([]);
    const [selectedCCTV, setSelectedCCTV] = useState(null);
    const [multiView, setMultiView] = useState(true);
    const [roleId, setRoleId] = useState(null); // 역할 아이디(roleId) 저장
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLog, setShowLog] = useState(false);
    const navigate = useNavigate();

    // modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        // 사용자 데이터 요청
        api.get("/cleanguard")
            .then((response) => {
                setUserInfo(response.data);
                setRoleId(response.data.role.roleId); // 역할 정보 저장

                // roleId가 1일 때 userinfo 페이지로 리다이렉트
                if (response.data.role.roleId == 1) {
                    navigate("/userinfo");
                }
                setLoading(false);
                console.log("사용자 정보 가져오기 성공:", response.data);
            })
            .catch((error) => {
                console.error("사용자 정보 가져오기 실패:", error);
                setLoading(false);
            });
    }, [navigate]);

    useEffect(() => {
        // cctv 데이터 요청
        if (roleId) {
            api.get(`/cleanguard/cctv/${roleId}`)
                .then((response) => {
                    setCctvList(response.data);
                    console.log("CCTV 데이터 가져오기 성공:", response.data);
                })
                .catch((error) => {
                    console.error("CCTV 데이터 가져오기 실패:", error);
                });

            // (전체 cctv 데이터 요청 -> 삭제 예정)    
            api.get(`/cleanguard/cctv/`)
                .then((response) => {
                    console.log("전체 CCTV 데이터 가져오기 성공:", response.data);
                })
                .catch((error) => {
                    console.error("전체 CCTV 데이터 가져오기 실패:", error);
                });
        }
    }, [roleId]);

    useEffect(() => {
        // image 데이터 요청(SSE)
        if (roleId) {
            const accessToken = localStorage.getItem("accessToken");
            const sseUrl = `http://3.36.174.53:8080/cleanguard/image/sse/${roleId}`;
            let eventSource;
            let reconnCount = 0;

            const connect = () => {

                // 재연결 시도 횟수 제한 -> 무한 연결 시도 방지
                if (reconnCount >= 3) {
                    console.log("SSE 재연결 최대 시도 횟수 초과(3회)");
                    return;
                }

                eventSource = new EventSourcePolyfill(sseUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                eventSource.onopen = () => {
                    console.log("SSE 연결 성공");
                    reconnCount = 0;
                };

                eventSource.onmessage = (event) => {
                    try {
                        const newData = JSON.parse(event.data); // 서버로부터 이미지 배열 전체가 옴
                        setDumpingEvent((prev) => {
                            // 중복되지 않는 새 이미지만 필터링하여 업데이트
                            const existImage = new Set(prev.map((item) => item.imageId));
                            const newImage = newData.filter((item) => !existImage.has(item.imageId));
                            return [...prev, ...newImage];
                        });
                        //console.log("이미지 데이터 가져오기 성공(SSE) :", newData);
                    } catch (error) {
                        console.error("SSE 데이터 파싱 오류:", error);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error("SSE 연결 오류:", error);
                    eventSource.close();
                    reconnCount += 1;
                    setTimeout(() => {
                        console.log("SSE 재연결 시도");
                        connect();
                    }, 1000); // 1초 후 재연결 시도
                };
            };

            // 초기 연결
            connect();

            // 컴포넌트 언마운트 시 SSE 연결 종료
            return () => {
                eventSource.close();
                console.log("SSE 연결 종료");
            };
        }

    }, [roleId]);


    useEffect(() => {
        if (roleId) {
            //log 데이터 요청
            api.get(`/cleanguard/log/${roleId}`)
                .then((response) => {
                    console.log("log 데이터 가져오기 성공:", response.data);
                })
                .catch((error) => {
                    console.error("log 데이터 가져오기 실패:", error);
                });
        }
    }, [roleId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main">
            <div className="main-container">
                <Header userInfo={userInfo} />
                <div className="main-content">
                    <div className="sidemenu">
                        <CCTVSidemenu
                            cctvList={cctvList}
                            onCCTVSelect={setSelectedCCTV}
                            setMultiView={setMultiView}
                            setShowAddModal={setShowAddModal}
                            setShowEditModal={setShowEditModal}
                            setShowDeleteModal={setShowDeleteModal}
                            setShowLog={setShowLog}
                        />
                    </div>
                    {showLog ? (
                        <Log
                            setSelectedCCTV={setSelectedCCTV}
                            selectedCCTV={selectedCCTV}
                            onShowLog={() => setShowLog(false)}
                            multiView={multiView}
                            dumpingData={dumpingEvent}
                            roleId={roleId}
                        />
                    ) : (
                        <>
                            <div className="video-viewer">
                                <VideoViewer
                                    cctvList={cctvList}
                                    setSelectedCCTV={setSelectedCCTV}
                                    selectedCCTV={selectedCCTV}
                                    multiView={multiView}
                                    setMultiView={setMultiView}
                                    dumpingData={dumpingEvent}
                                    onShowLog={() => setShowLog(true)}
                                />
                            </div>
                            <div className="graph">
                                <Graph dumpingEvent={dumpingEvent} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {showAddModal && (
                <AddModal
                    setShowAddModal={setShowAddModal}
                    setCctvList={setCctvList}
                    roleId={roleId}
                    userInfo={userInfo}
                />
            )}
            {showEditModal && (
                <EditModal
                    setShowEditModal={setShowEditModal}
                    selectedCCTV={selectedCCTV}
                    setSelectedCCTV={setSelectedCCTV}
                    setCctvList={setCctvList}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    selectedCCTV={selectedCCTV}
                    setCctvList={setCctvList}
                    setMultiView={setMultiView}
                />
            )}
        </div>
    );
}

export default Main;
