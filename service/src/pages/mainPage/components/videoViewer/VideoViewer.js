import React, {useState} from 'react'
import Slider from 'react-slick';
import './VideoViewer.scss'
import dumpingData from '../../../../data/dumpingData.json'

function VideoViewer() {
    const cctvId = 5; // 임시로 지정
    const filteredImages = dumpingData.filter(item => item.cctvId === cctvId);
    
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className='viewer'>
            <div className='viewer-title'>현재 CCTV: </div>
            <div className='viewer-video'><img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png'/></div>
            <div className='viewer-count'>금일 투기 적발 건수: {filteredImages.length}건</div>
            <div className='viewer-capture'>
                <Slider {...sliderSettings} >
                    {filteredImages.map((item) => (
                        <div key={item.id}>
                            {/* <img src={item.captureImageUrl} alt={`Capture ${item.id}`} className='slider-image' /> */}
                            <img src='https://www.sisanews.kr/news/photo/202408/109831_94595_3144.png' alt={`Capture ${item.id}`} className='slider-image' />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default VideoViewer