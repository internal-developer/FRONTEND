import React, { useEffect, useState, useRef } from "react";
import "./main.scss";
import Header from "./components/header/Header";
import CCTVSidemenu from "./components/cctvSidemenu/CCTVSidemenu";
import VideoViewer from "./components/videoViewer/VideoViewer";
import Graph from "./components/graph/Graph";
import Log from "./components/log/Log";
//import cctvData from '../../data/cctvData.json'
// import dumpingData from "../../data/dumpingData.json";
import AddModal from "./components/cctvSidemenu/AddModal";
import EditModal from "./components/cctvSidemenu/EditModal";
import DeleteModal from "./components/cctvSidemenu/DeleteModal";
import AlertToast from "./components/videoViewer/AlertToast";
import { api } from "../../api/api"; // axios 인스턴스 호출
import { EventSourcePolyfill } from "event-source-polyfill";
import { useNavigate } from "react-router-dom";
import alertMark from "../../assets/images/alert_mark.png";

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
    const [showAlertToast, setShowAlertToast] = useState(false);
    const [alertCCTVName, setAlertCCTVName] = useState(""); // alert에 cctvName 전달하기 위해 저장
    const [alertCCTVLocation, setAlertCCTVLocation] = useState(""); // alert에 cctvLocation 전달하기 위해 저장
    const [initialLoad, setInitialLoad] = useState(true); // 최초 렌더링때는 AlertToast 띄우지 않도록 제어 변수 추가
    const webRTCInstances = useRef({});

    // modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 재접속 핸들러
    const handleRestartStream = async (stream) => {
        const instance = webRTCInstances.current[stream];
        if (instance && instance.reconnect) {
            await instance.reconnect();
        }
    };

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
            // api.get(`/cleanguard/cctv/`)
            //     .then((response) => {
            //         console.log(
            //             "전체 CCTV 데이터 가져오기 성공:",
            //             response.data
            //         );
            //     })
            //     .catch((error) => {
            //         console.error("전체 CCTV 데이터 가져오기 실패:", error);
            //     });
        }
    }, [roleId]);

    useEffect(() => {
        // image 데이터 요청(SSE)
        if (roleId) {
            const accessToken = localStorage.getItem("accessToken");
            const sseUrl = `http://3.36.174.53:8080/cleanguard/image/sse/${roleId}`;
            let eventSource;
            let reconnCount = 0;

            // 새로고침 감지를 위해 sessionStorage에 타임스탬프 저장
            const loadTimestamp = Date.now();
            sessionStorage.setItem("loadTimestamp", loadTimestamp.toString());
            sessionStorage.setItem("isInitialLoad", "true");

            const connect = () => {
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
                        const newData = JSON.parse(event.data);
                        const isInitialLoad = sessionStorage.getItem("isInitialLoad") === "true";

                        setDumpingEvent((prev) => {
                            const existImage = new Set(prev.map((item) => item.imageId));
                            const newImage = newData.filter((item) => !existImage.has(item.imageId));

                            // 초기 로드 시 또는 데이터가 없으면 토스트를 띄우지 않음
                            if (
                                !isInitialLoad &&
                                newImage.length > 0 &&
                                newImage[0]?.cctv?.cctvName &&
                                newImage[0]?.cctv?.location
                            ) {
                                setAlertCCTVName(newImage[0].cctv.cctvName);
                                setAlertCCTVLocation(newImage[0].cctv.location);
                                setShowAlertToast(true);
                            }
                            return [...prev, ...newImage];
                        });

                        // 초기 로드 후 즉시 플래그를 false로 설정
                        sessionStorage.setItem("isInitialLoad", "false");
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
                    }, 1000);
                };
            };

            connect();

            return () => {
                eventSource.close();
                console.log("SSE 연결 종료");
            };
        }
    }, [roleId]);

    // useEffect(() => {
    //     // image 데이터 요청(SSE)
    //     if (roleId) {
    //         const accessToken = localStorage.getItem("accessToken");
    //         const sseUrl = `http://3.36.174.53:8080/cleanguard/image/sse/${roleId}`;
    //         let eventSource;
    //         let reconnCount = 0;

    //         if (sessionStorage.getItem("initialLoad") === null) {
    //             sessionStorage.setItem("initialLoad", "true");
    //         }

    //         const connect = () => {
    //             // 재연결 시도 횟수 제한 -> 무한 연결 시도 방지
    //             if (reconnCount >= 3) {
    //                 console.log("SSE 재연결 최대 시도 횟수 초과(3회)");
    //                 return;
    //             }

    //             eventSource = new EventSourcePolyfill(sseUrl, {
    //                 headers: {
    //                     Authorization: `Bearer ${accessToken}`,
    //                 },
    //             });

    //             eventSource.onopen = () => {
    //                 console.log("SSE 연결 성공");
    //                 reconnCount = 0;
    //             };

    //             eventSource.onmessage = (event) => {
    //                 try {
    //                     const newData = JSON.parse(event.data); // 서버로부터 이미지 배열 전체가 옴
    //                     const isInitialLoad =
    //                         sessionStorage.getItem("initialLoad") === "true";

    //                     setDumpingEvent((prev) => {
    //                         // 중복되지 않는 새 이미지만 필터링하여 업데이트
    //                         const existImage = new Set(
    //                             prev.map((item) => item.imageId)
    //                         );
    //                         const newImage = newData.filter(
    //                             (item) => !existImage.has(item.imageId)
    //                         );
    //                         console.log("newImage", newImage);
    //                         console.log("newImage length:", newImage.length);
    //                         console.log("isInitialLoad", isInitialLoad);
    //                         console.log(
    //                             "조건 통과 여부",
    //                             !isInitialLoad &&
    //                                 newImage.length > 0 &&
    //                                 newImage[0]?.cctv?.cctvName &&
    //                                 newImage[0]?.cctv?.location
    //                         );

    //                         // cctvName, location값이 존재하면 alert에 전달하기 위해 저장
    //                         if (
    //                             !isInitialLoad &&
    //                             newImage.length > 0 &&
    //                             newImage[0].cctv?.cctvName &&
    //                             newImage[0].cctv?.location
    //                         ) {
    //                             setAlertCCTVName(newImage[0].cctv.cctvName);
    //                             setAlertCCTVLocation(newImage[0].cctv.location);
    //                             setShowAlertToast(true); // 새 이벤트가 생기면 alert 띄우기
    //                         }
    //                         return [...prev, ...newImage];
    //                     });
    //                     // sessionStorage를 사용하여 탭당 상태 저장
    //                     if (isInitialLoad) {
    //                         sessionStorage.setItem("initialLoad", "false");
    //                     }
    //                     // console.log(
    //                     //     "이미지 데이터 가져오기 성공(SSE) :",
    //                     //     newData
    //                     // );
    //                 } catch (error) {
    //                     console.error("SSE 데이터 파싱 오류:", error);
    //                 }
    //             };

    //             eventSource.onerror = (error) => {
    //                 console.error("SSE 연결 오류:", error);
    //                 eventSource.close();
    //                 reconnCount += 1;
    //                 setTimeout(() => {
    //                     console.log("SSE 재연결 시도");
    //                     connect();
    //                 }, 1000); // 1초 후 재연결 시도
    //             };
    //         };

    //         // 초기 연결
    //         connect();

    //         // 컴포넌트 언마운트 시 SSE 연결 종료
    //         return () => {
    //             eventSource.close();
    //             console.log("SSE 연결 종료");
    //         };
    //     }
    // }, [roleId]);

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
                {showAlertToast && (
                    <AlertToast
                        onClose={() => setShowAlertToast(false)}
                        cctvName={alertCCTVName}
                        cctvLocation={alertCCTVLocation}
                        imgSrc={alertMark}
                    />
                )}

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
                            handleRestartStream={handleRestartStream}
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
                            setDumpingEvent={setDumpingEvent}
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
                                    webRTCInstances={webRTCInstances}
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
