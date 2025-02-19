import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { IoIosSettings } from "react-icons/io";
// import { RiDeleteBin6Line } from "react-icons/ri";
import { RiFullscreenFill } from "react-icons/ri";
import Slider from "react-slick";
import "./VideoViewer.scss";
// import dumpingData from "../../../../data/dumpingData.json";

function VideoViewer({
    cctvList,
    setSelectedCCTV,
    selectedCCTV,
    multiView,
    setMultiView,
    dumpingData,
}) {
    const cctvId = selectedCCTV ? selectedCCTV.cctvId : null;
    const filteredImages = dumpingData.filter(
        (item) => item.cctv?.cctvId === cctvId
    );
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [shownCctv, setShownCctv] = useState({}); // 멀티뷰에서 보여질 cctv
    const [availableWebcams, setAvailableWebcams] = useState([]); // 연결 가능한 웹캠들
    // const [showCheckboxes, setShowCheckboxes] = useState(false);
    // const [selectedImages, setSelectedImages] = useState({}); // 삭제할 슬라이드 이미지

    useEffect(() => {
        // 웹캠 목록 가져오기
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setAvailableWebcams(videoDevices);
            })
            .catch(error => {
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
    // 삭제 아이콘에 연결된 함수
    // const toggleCheckboxes = () => setShowCheckboxes((prev) => !prev);
    // const handleImageSelect = (imageId) => {
    //     setSelectedImages((prev) => ({
    //         ...prev,
    //         [imageId]: !prev[imageId],
    //     }));
    // };

    const currentCctv = cctvList.find((cctv) => cctv.cctvId === cctvId);
    const webcamId = currentCctv ? currentCctv.webcamId : "";
    // 웹캠과 cctvList의의 webcamId가 일치하는지 확인
    const isWebcamAvailable = (webcamId) => {
        return availableWebcams.some(webcam => webcam.deviceId === webcamId);
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
                                <div key={cctv.cctvId} className="multi-viewer-video">
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
                    <Slider {...sliderSettings}>
                        {dumpingData.map((item) => (
                            <div
                                key={item.imageId}
                                onMouseEnter={() =>
                                    handleMouseEnter(item.imageId)
                                }
                                onMouseLeave={handleMouseLeave}
                                className="slider-image-container"
                            >
                                {/* <img
                                    src={item.path} // 이미지가 화면에 잘 나오는지 확인 할 필요 있음!!!!!!!!!
                                    alt={`Capture ${item.imageId}`}
                                    className="slider-image"
                                /> */}

                                {/* 임시 이미지 */}
                                <img
                                    src="https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png"
                                    alt={`Capture ${item.imageId}`}
                                    className="slider-image"
                                />
                                {hoveredImageId === item.imageId && (
                                    <div className="image-info">
                                        {/* <p>ID: {item.imageId}</p>
                                        <p>Name: {item.name}</p> */}
                                        <p>{item.cctv.location}</p>
                                        <p>{item.time}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Slider>
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
                            deviceId: webcamId
                        }} />
                ) : (
                    <p>웹캠 연결 오류</p>
                )}
            </div>
            <div className="viewer-count">
                금일 투기 적발 건수: {filteredImages.length}건
            </div>
            <div className="viewer-capture">
                <Slider {...sliderSettings}>
                    {filteredImages.map((item) => (
                        <div
                            key={item.imageId}
                            onMouseEnter={() => handleMouseEnter(item.imageId)}
                            onMouseLeave={handleMouseLeave}
                            className="slider-image-container"
                        >
                            {/* <img src={item.path} alt={`Capture ${item.imageId}`} className='slider-image' /> */}

                            {/* 임시 이미지 */}
                            <img
                                src="https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png"
                                alt={`Capture ${item.imageId}`}
                                className="slider-image"
                            />
                            {hoveredImageId === item.imageId && (
                                <div className="image-info">
                                    {/* <p>ID: {item.imageId}</p>
                                    <p>Name: {item.name}</p> */}
                                    <p>{item.cctv.location}</p>
                                    <p>{item.time}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default VideoViewer;
