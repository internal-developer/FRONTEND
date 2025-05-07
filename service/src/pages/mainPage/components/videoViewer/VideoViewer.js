import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { IoIosSettings } from "react-icons/io";
import { RiFullscreenFill } from "react-icons/ri";
import Slider from "react-slick";
import "./VideoViewer.scss";
import { useVideoHandler } from "../../../../hooks/useVideoHandler";
import { KinesisWebRTC } from "./KinesisWebRTC";

function VideoViewer({
    cctvList,
    setSelectedCCTV,
    selectedCCTV,
    multiView,
    setMultiView,
    dumpingData,
    onShowLog,
}) {
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [shownCctv, setShownCctv] = useState({}); // 멀티뷰에서 보여질 cctv
    // const [availableWebcams, setAvailableWebcams] = useState([]); // 연결 가능한 웹캠들
    const { videoError, isVideo, handleVideoError } = useVideoHandler();
    const dropdownRef = useRef(null);
    const [error, setError] = useState({});
    const videoRef = useRef({}); // CCTV별 videoRef 관리

    const stream = selectedCCTV ? selectedCCTV.stream : null;

    // useEffect(() => {
    //     // 웹캠 목록 가져오기
    //     navigator.mediaDevices
    //         .enumerateDevices()
    //         .then((devices) => {
    //             const videoDevices = devices.filter(
    //                 (device) => device.kind === "videoinput"
    //             );
    //             setAvailableWebcams(videoDevices);
    //         })
    //         .catch((error) => {
    //             console.error("웹캠 목록을 가져오는 중 오류 발생:", error);
    //         });
    // }, []);

    // CCTV별 videoRef 동적 생성
    const getVideoRef = (stream) => {
        if (!videoRef.current[stream]) {
            videoRef.current[stream] = React.createRef();
        }
        return videoRef.current[stream];
    };

    useEffect(() => {
        setShownCctv(
            cctvList.reduce((tmp, cctv) => {
                tmp[cctv.stream] = true; // 멀티뷰 디폴트 값 -> 모든 cctv true
                return tmp;
            }, {})
        );
    }, [cctvList]);

    const [filteredImages, setFilteredImages] = useState([]);
    useEffect(() => {
        // 멀티뷰일 경우, 모든 투기 데이터를 보여줌
        if (multiView) {
            setFilteredImages(dumpingData);
            setSelectedCCTV(null);
        }
        // 단일뷰일 경우, 선택된 CCTV의 투기 데이터만 보여줌
        else if (stream !== null) {
            // stream가 null이 아닐 때만 필터링 실행
            setFilteredImages(
                dumpingData.filter((item) => item.cctv.stream === stream)
            );
        } else {
            setFilteredImages([]); // 선택된 CCTV가 없으면 빈 배열
        }
    }, [multiView, dumpingData, stream]);

    // 외부 클릭 감지 로직 추가
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest(".filter-icon")
            ) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // multiView 변경 시 드롭다운 닫기
    useEffect(() => {
        if (!multiView) {
            setShowDropdown(false);
        }
    }, [multiView]);

    // WebRTC 연결 관리
    const cleanups = useRef({});
    useEffect(() => {
        // 멀티뷰일 때 각 CCTV별 WebRTC 연결
        if (multiView) {
            const initMultiWebRTC = async () => {
                for (const cctv of cctvList) {
                    if (shownCctv[cctv.stream] && cctv.stream) {
                        try {
                            cleanups.current[cctv.stream] = await KinesisWebRTC({
                                channelName: cctv.stream,
                                region: "ap-northeast-2",
                                videoRef: getVideoRef(cctv.stream),
                                setError: (err) =>
                                    setError((prev) => ({ ...prev, [cctv.stream]: err })),
                            });
                        } catch (err) {
                            setError((prev) => ({
                                ...prev,
                                [cctv.stream]: "초기화에 실패했습니다.",
                            }));
                            console.error(`WebRTC error for ${cctv.cctvName}:`, err);
                        }
                    }
                }
            };
            initMultiWebRTC();
        }
        // 단일뷰일 때 WebRTC 연결
        else if (selectedCCTV && selectedCCTV.stream) {
            const initWebRTC = async () => {
                try {
                    cleanups.current[selectedCCTV.stream] = await KinesisWebRTC({
                        channelName: selectedCCTV.stream,
                        region: "ap-northeast-2",
                        videoRef: getVideoRef(selectedCCTV.stream),
                        setError: (err) =>
                            setError((prev) => ({ ...prev, [selectedCCTV.stream]: err })),
                    });
                } catch (err) {
                    setError((prev) => ({
                        ...prev,
                        [selectedCCTV.stream]: "초기화에 실패했습니다.",
                    }));
                    console.error(`WebRTC error for ${selectedCCTV.cctvName}:`, err);
                }
            };
            initWebRTC();
        }

        // 클린업
        return () => {
            Object.values(cleanups.current).forEach((cleanup) => cleanup && cleanup());
            cleanups.current = {};
        };

    }, [selectedCCTV, multiView, shownCctv, cctvList]);

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        draggable: true,
        swipeToSlide: true, // 드래그 거리에 따라 슬라이드 넘어가도록
    };

    const handleMouseEnter = (id) => setHoveredImageId(id);
    const handleMouseLeave = () => setHoveredImageId(null);
    const countShownCctv = () => {
        let cnt = 0;
        Object.values(shownCctv).forEach((val) => {
            if (val === true) {
                cnt++;
            }
        });
        return cnt;
    };

    const currentCctv = cctvList.find((cctv) => cctv.stream === stream);
    // const webcamId = currentCctv ? currentCctv.webcamId : "";
    // 웹캠과 cctvList의의 webcamId가 일치하는지 확인
    // const isWebcamAvailable = (webcamId) => {
    //     if (!webcamId) return availableWebcams.length > 0; // cctv webcamId가 ""로 비어있는 경우, 탐지된 웹캠이 한 개일 때 기본적으로 탐지된 웹캠을 사용하도록 설정.
    //     return availableWebcams.some((webcam) => webcam.deviceId === webcamId);
    // };

    // 슬라이더 공통 컴포넌트 (멀티뷰/단일뷰 공통)
    const renderSlider = (item) => (
        <div
            key={item.imageId}
            onMouseEnter={() => handleMouseEnter(item.imageId)}
            onMouseLeave={handleMouseLeave}
            className="slider-image-container"
        >
            {isVideo(item.path) ? (
                videoError[item.imageId] ? (
                    <div className="slider-error">
                        영상을 재생할 수 없습니다
                    </div>
                ) : (
                    <video
                        src={item.path}
                        muted
                        preload="metadata"
                        playsInline
                        className="slider-image"
                        onError={() => handleVideoError(item.imageId)}
                    />
                )
            ) : (
                <img
                    src={item.path}
                    alt={`Capture ${item.imageId}`}
                    className="slider-image"
                />
            )}
            <div
                className={`image-info ${hoveredImageId === item.imageId ? "show" : ""
                    }`}
            >
                <p>{item.cctv.location}</p>
                <p>
                    {new Date(item.time).getFullYear()}-
                    {String(new Date(item.time).getMonth() + 1).padStart(
                        2,
                        "0"
                    )}
                    -{String(new Date(item.time).getDate()).padStart(2, "0")}
                </p>
                <p>
                    {String(new Date(item.time).getHours()).padStart(2, "0")}:
                    {String(new Date(item.time).getMinutes()).padStart(2, "0")}
                </p>
            </div>
        </div>
    );

    // 멀티뷰 상태일 때 UI
    if (multiView) {
        const getGridStyle = (length) => {
            if (length === 1) {
                return { gridTemplateColumns: "1fr" }; // 1x1
            } else if (length === 2) {
                return { gridTemplateColumns: "1fr 1fr" }; // 2x1
            } else if (length <= 4) {
                return { gridTemplateColumns: "1fr 1fr" }; // 2x2
            } else {
                return {
                    gridTemplateColumns: "repeat(auto-fill, minmax(1fr, 1fr))",
                };
            }
        };
        return (
            <div className="viewer">
                <div className="multi-viewer-icon">
                    <IoIosSettings
                        className="filter-icon"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="multi-dropdown" ref={dropdownRef}>
                            {cctvList.map((cctv) => (
                                <div
                                    key={cctv.stream}
                                    className="multi-dropdown-toggle"
                                >
                                    <input
                                        type="checkbox"
                                        className="multi-dropdown-toggle-switch"
                                        id={cctv.stream}
                                        checked={shownCctv[cctv.stream]}
                                        onChange={() =>
                                            setShownCctv((prev) => ({
                                                ...prev,
                                                [cctv.stream]:
                                                    !prev[cctv.stream],
                                            }))
                                        }
                                    />
                                    <div
                                        className="multi-dropdown-toggle-label"
                                        htmlFor={cctv.stream}
                                    >
                                        {cctv.cctvName}{" "}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div
                    className="multi-viewer-video-container"
                    style={getGridStyle(countShownCctv())}
                >
                    {cctvList.map(
                        (cctv) =>
                            shownCctv[cctv.stream] && (
                                <div
                                    key={cctv.stream}
                                    className="multi-viewer-video"
                                >
                                    {/* {isWebcamAvailable(cctv.webcamId) ? (
                                        <Webcam
                                            audio={false}
                                            style={{
                                                objectFit: "fill",
                                                position: "absolute",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            videoConstraints={{
                                                deviceId: cctv.webcamId,
                                            }}
                                        />
                                    ) : (
                                        <div className="viewer-video-error">
                                            카메라 연결 오류
                                        </div>
                                    )} */}
                                    {cctv.stream ? (
                                        <>
                                            <video
                                                ref={getVideoRef(cctv.stream)}
                                                autoPlay
                                                playsInline
                                                muted
                                                style={{
                                                    objectFit: "fill",
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                            {error[cctv.stream] && (
                                                <div
                                                    className="viewer-video-error"
                                                    style={{
                                                        height: "4%",
                                                        backgroundColor:
                                                            "#ffffff",
                                                        color: "#1D1D1D",
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    {error[cctv.stream]}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div
                                            className="viewer-video-error"
                                        // style={{ height: "100%" }}
                                        >
                                            카메라 연결 오류
                                        </div>
                                    )}
                                    <div
                                        className="multi-viewer-title"
                                        onClick={() => {
                                            setMultiView(false);
                                            setSelectedCCTV(cctv);
                                        }}
                                    >
                                        {cctv.cctvName}
                                        <RiFullscreenFill className="fullscreen-icon" />
                                    </div>
                                </div>
                            )
                    )}
                </div>

                {/* 슬라이더 코드 */}
                <div className="viewer-count">
                    금일 투기 적발 건수: {dumpingData.length}건
                </div>
                <div className="viewer-capture">
                    <Slider
                        {...sliderSettings}
                        key={(multiView ? dumpingData : filteredImages).length}
                    >
                        {filteredImages.map((item) => renderSlider(item))}
                    </Slider>
                    <button
                        className="viewer-capture-button"
                        onClick={onShowLog}
                    >
                        상세기록 보러가기
                    </button>
                </div>
            </div>
        );
    }

    // 사이드 메뉴에서 CCTV 이름을 클릭했을 때 UI -> 단일뷰 상태
    return (
        <div className="viewer">
            <div className="viewer-title">
                현재 CCTV:{" "}
                {selectedCCTV ? selectedCCTV.cctvName : "선택되지 않음"}
            </div>
            <div className="viewer-video">
                {" "}
                {/* {webcamId && isWebcamAvailable(webcamId) ? (
                    <Webcam
                        style={{
                            objectFit: "fill",
                            //position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                        audio={false}
                        videoConstraints={{
                            deviceId: webcamId,
                        }}
                    />
                )  */}
                {selectedCCTV && selectedCCTV.stream ? (
                    <>
                        <video
                            ref={getVideoRef(selectedCCTV.stream)}
                            autoPlay
                            playsInline
                            muted
                            controls
                            style={{
                                objectFit: "fill",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                        {error[selectedCCTV.stream] && (
                            <div
                                className="viewer-video-error"
                                style={{
                                    height: "4%",
                                    backgroundColor: "#ffffff",
                                    color: "#1D1D1D",
                                    fontSize: "15px",
                                }}
                            >
                                {error[selectedCCTV.stream]}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="viewer-video-error">카메라 연결 오류</div>
                )}
            </div>
            <div className="viewer-count">
                금일 투기 적발 건수: {filteredImages.length}건
            </div>
            <div className="viewer-capture">
                <Slider
                    {...sliderSettings}
                    key={(multiView ? dumpingData : filteredImages).length}
                >
                    {filteredImages.map((item) => renderSlider(item))}
                </Slider>
                <button className="viewer-capture-button" onClick={onShowLog}>
                    상세기록 보러가기
                </button>
            </div>
        </div>
    );
}

export default VideoViewer;
