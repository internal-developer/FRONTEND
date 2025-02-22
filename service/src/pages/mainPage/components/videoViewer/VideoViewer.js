import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { IoIosSettings } from "react-icons/io";
import { RiFullscreenFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./VideoViewer.scss";

function VideoViewer({
    cctvList,
    setSelectedCCTV,
    selectedCCTV,
    multiView,
    setMultiView,
    dumpingData,
}) {
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [shownCctv, setShownCctv] = useState({}); // 멀티뷰에서 보여질 cctv
    const [availableWebcams, setAvailableWebcams] = useState([]); // 연결 가능한 웹캠들

    const cctvId = selectedCCTV ? selectedCCTV.cctvId : null;

    useEffect(() => {
        // 웹캠 목록 가져오기
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                const videoDevices = devices.filter(
                    (device) => device.kind === "videoinput"
                );
                setAvailableWebcams(videoDevices);
            })
            .catch((error) => {
                console.error("웹캠 목록을 가져오는 중 오류 발생:", error);
            });
    }, []);

    useEffect(() => {
        setShownCctv(
            cctvList.reduce((tmp, cctv) => {
                tmp[cctv.cctvId] = true; // 멀티뷰 디폴트 값 -> 모든 cctv true
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
        else if (cctvId !== null) {
            // cctvId가 null이 아닐 때만 필터링 실행
            setFilteredImages(
                dumpingData.filter((item) => item.cctv.cctvId === cctvId)
            );
        } else {
            setFilteredImages([]); // 선택된 CCTV가 없으면 빈 배열
        }
    }, [multiView, dumpingData, cctvId]);

    // useEffect(() => {
    //     console.log(
    //         "multiView: ",
    //         multiView,
    //         "\n",
    //         "selectedCCTV: ",
    //         selectedCCTV,
    //         "\n",
    //         "cctvId: ",
    //         cctvId,
    //         "\n",
    //         "filteredImages: ",
    //         filteredImages
    //     );
    // }, [filteredImages]);

    const navigate = useNavigate();
    const navigateToLoginfo = () => navigate("/loginfo");

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
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

    const currentCctv = cctvList.find((cctv) => cctv.cctvId === cctvId);
    const webcamId = currentCctv ? currentCctv.webcamId : "";
    // 웹캠과 cctvList의의 webcamId가 일치하는지 확인
    const isWebcamAvailable = (webcamId) => {
        return availableWebcams.some((webcam) => webcam.deviceId === webcamId);
    };

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
                    {/* <RiDeleteBin6Line
                        className="filter-icon"
                        onClick={toggleCheckboxes}
                    /> */}
                    <IoIosSettings
                        className="filter-icon"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                        <div className="multi-dropdown">
                            {cctvList.map((cctv) => (
                                <div
                                    key={cctv.cctvId}
                                    className="multi-dropdown-toggle"
                                >
                                    <input
                                        type="checkbox"
                                        className="multi-dropdown-toggle-switch"
                                        id={cctv.cctvId}
                                        checked={shownCctv[cctv.cctvId]}
                                        onChange={() =>
                                            setShownCctv((prev) => ({
                                                ...prev,
                                                [cctv.cctvId]:
                                                    !prev[cctv.cctvId],
                                            }))
                                        }
                                    />
                                    <div
                                        className="multi-dropdown-toggle-label"
                                        htmlFor={cctv.cctvId}
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
                            shownCctv[cctv.cctvId] && (
                                <div
                                    key={cctv.cctvId}
                                    className="multi-viewer-video"
                                >
                                    {isWebcamAvailable(cctv.webcamId) ? (
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
                                        <p>웹캠 연결 오류</p>
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
                        {filteredImages.map((item) => (
                            <div
                                key={item.imageId}
                                onMouseEnter={() =>
                                    handleMouseEnter(item.imageId)
                                }
                                onMouseLeave={handleMouseLeave}
                                className="slider-image-container"
                            >
                                <img
                                    src={item.path}
                                    alt={`Capture ${item.imageId}`}
                                    className="slider-image"
                                />

                                {hoveredImageId === item.imageId && (
                                    <div className="image-info">
                                        <p>{item.cctv.location}</p>
                                        <p>
                                            {new Date(
                                                item.time
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            {new Date(
                                                item.time
                                            ).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Slider>
                    <button
                        className="viewer-capture-button"
                        onClick={navigateToLoginfo}
                    >
                        상세페이지 보러가기
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
            {/* <div className='viewer-video'><img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png'/></div> */}
            <div className="viewer-video">
                {" "}
                {webcamId && isWebcamAvailable(webcamId) ? (
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
                ) : (
                    <p>웹캠 연결 오류</p>
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
                    {filteredImages.map((item) => (
                        <div
                            key={item.imageId}
                            onMouseEnter={() => handleMouseEnter(item.imageId)}
                            onMouseLeave={handleMouseLeave}
                            className="slider-image-container"
                        >
                            <img
                                src={item.path}
                                alt={`Capture ${item.imageId}`}
                                className="slider-image"
                            />
                            {hoveredImageId === item.imageId && (
                                <div className="image-info">
                                    <p>{item.cctv.location}</p>
                                    <p>
                                        {new Date(
                                            item.time
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        {new Date(
                                            item.time
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </Slider>
                <button
                    className="viewer-capture-button"
                    onClick={navigateToLoginfo}
                >
                    상세페이지 보러가기
                </button>
            </div>
        </div>
    );
}

export default VideoViewer;
