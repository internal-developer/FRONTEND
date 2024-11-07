import React, {useState} from 'react'
import Slider from 'react-slick';
import './VideoViewer.scss'
import dumpingData from '../../../../data/dumpingData.json'

function VideoViewer({cctvList, selectedCCTV}) {
    const cctvId = 5; // 임시로 지정
    const filteredImages = dumpingData.filter(item => item.cctvId === cctvId);
    const [hoveredImageId, setHoveredImageId] = useState(null);

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

    const currentCctv = cctvList.find(cctv => cctv.id === cctvId);
    const videoUrl = currentCctv ? currentCctv.VideoUrl : '';

    return (
        <div className='viewer'>
            <div className='viewer-title'>현재 CCTV: {selectedCCTV ? selectedCCTV.name : '선택되지 않음'}</div>
            <div className='viewer-video'><img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png'/></div>
            {/* <div className='viewer-video'> {videoUrl ? (<img src={videoUrl} alt={`CCTV ${currentCctv.name}`} />) : (<p>영상 URL을 찾을 수 없습니다.</p>)}</div> */}
            <div className='viewer-count'>금일 투기 적발 건수: {filteredImages.length}건</div>
            <div className='viewer-capture'>
                <Slider {...sliderSettings} >
                    {filteredImages.map((item) => (
                        <div 
                            key={item.id}
                            onMouseEnter={() => handleMouseEnter(item.id)}
                            onMouseLeave={handleMouseLeave}
                            className='slider-image-container'
                        >
                            {/* <img src={item.captureImageUrl} alt={`Capture ${item.id}`} className='slider-image' /> */}
                            <img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png' alt={`Capture ${item.id}`} className='slider-image' />
                            {hoveredImageId === item.id && (
                                <div className='image-info'>
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
    )
}

export default VideoViewer