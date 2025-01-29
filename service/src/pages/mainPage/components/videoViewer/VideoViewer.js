import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { RiFullscreenFill } from "react-icons/ri";
import Slider from "react-slick";
import "./VideoViewer.scss";
// import dumpingData from '../../../../data/dumpingData.json'

function VideoViewer({
    cctvList,
    setSelectedCCTV,
    selectedCCTV,
    multiView,
    setMultiView,
    dumpingData,
}) {
    const cctvId = selectedCCTV ? selectedCCTV.cctvId : null;
    const filteredImages = dumpingData.filter((item) => item.cctvId === cctvId);
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [shownCctv, setShownCctv] = useState({}); // 멀티뷰에서 보여질 cctv

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
    const currentCctv = cctvList.find((cctv) => cctv.cctvId === cctvId);
    const videoUrl = currentCctv ? currentCctv.videoUrl : "";

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
                                    <img src={cctv.videoUrl} />
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

                {/* 
                    하단 슬라이더 코드는 따로 수정하지 않음. 단일뷰 상태 코드 복붙함 
                        ==> 코드 수정 요망
                 */}
                <div className="viewer-count">
                    금일 투기 적발 건수: {filteredImages.length}건
                </div>
                <div className="viewer-capture">
                    <Slider {...sliderSettings}>
                        {filteredImages.map((item) => (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={handleMouseLeave}
                                className="slider-image-container"
                            >
                                {/* <img src={item.captureImageUrl} alt={`Capture ${item.id}`} className='slider-image' /> */}
                                <img
                                    src="https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png"
                                    alt={`Capture ${item.id}`}
                                    className="slider-image"
                                />
                                {hoveredImageId === item.id && (
                                    <div className="image-info">
                                        <p>ID: {item.id}</p>
                                        <p>Name: {item.name}</p>
                                        <p>Location: {item.location}</p>
                                        <p>Timestamp: {item.timestamp}</p>
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
                {videoUrl ? (
                    <img src={videoUrl} alt={`CCTV ${currentCctv.cctvName}`} />
                ) : (
                    <p>영상 URL을 찾을 수 없습니다.</p>
                )}
            </div>
            <div className="viewer-count">
                금일 투기 적발 건수: {filteredImages.length}건
            </div>
            <div className="viewer-capture">
                <Slider {...sliderSettings}>
                    {filteredImages.map((item) => (
                        <div
                            key={item.id}
                            onMouseEnter={() => handleMouseEnter(item.id)}
                            onMouseLeave={handleMouseLeave}
                            className="slider-image-container"
                        >
                            {/* <img src={item.captureImageUrl} alt={`Capture ${item.id}`} className='slider-image' /> */}
                            <img
                                src="https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png"
                                alt={`Capture ${item.id}`}
                                className="slider-image"
                            />
                            {hoveredImageId === item.id && (
                                <div className="image-info">
                                    <p>ID: {item.id}</p>
                                    <p>Name: {item.name}</p>
                                    <p>Location: {item.location}</p>
                                    <p>Timestamp: {item.timestamp}</p>
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
