import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RiArrowLeftWideFill, RiArrowRightWideFill } from "react-icons/ri";
import { FiPlus, FiMinus, FiRefreshCw } from "react-icons/fi";
import './ImageModal.scss';

function ImageModal({ images, setShowImageModal, setSelectedImage, selectedImage }) {
    const previewRef = useRef([]);

    // 이미지 확대 및 축소 상태
    const imageRef = useRef(null);
    const scaleToastRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
    const [showScaleToast, setShowScaleToast] = useState(false);
    // const [showControls, setShowControls] = useState(false); // 이미지 확대, 축소 버튼 표시 여부
    const [videoError, setVideoError] = useState({});

    // 다음, 이전 이미지로 이동 함수
    const handleNext = () => {
        if (selectedImage < images.length - 1) {
            resetImageState();
            setSelectedImage(selectedImage + 1);
        }
    };
    const handlePrev = () => {
        if (selectedImage > 0) {
            resetImageState();
            setSelectedImage(selectedImage - 1);
        }
    };

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    const isVideo = (path) => {
        if (!path) return false;
        return path.toLowerCase().endsWith('mp4');
    };

    const handleVideoError = (id) => {
        setVideoError((prev) => ({ ...prev, [id]: true }));
    };

    /* ==== 이미지 확대 및 축소 함수 시작 ====*/

    // 이미지 확대 및 축소 시 비율 토스트 표시
    const handleScaleToast = (newScale) => {
        setShowScaleToast(true);
        if (scaleToastRef.current) clearTimeout(scaleToastRef.current);
        scaleToastRef.current = setTimeout(() => setShowScaleToast(false), 1000);
    };

    // 이미지 상태 초기화 (확대/위치)
    const resetImageState = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // 확대 버튼 클릭
    const handleZoomIn = () => {
        const newScale = Math.min(scale + 0.1, 4); // 최대 4배
        setScale(newScale);
        console.log(images);
        handleScaleToast(newScale);
    };

    // 축소 버튼 클릭
    const handleZoomOut = () => {
        const newScale = Math.max(scale - 0.1, 1); // 최소 1배
        setScale(newScale);
        handleScaleToast(newScale);
    };

    // 원래 크기로 돌아가기
    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        handleScaleToast(1);
    };

    // 마우스 휠로 확대 및 축소
    const handleWheel = useCallback((e) => {
        if (e.cancelable) e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(Math.max(scale + delta, 1), 4);
        setScale(newScale);
        handleScaleToast(newScale);
    }, [scale]);


    // 드래그 시작 (마우스 다운 시 즉시 이동 시작)
    const handleMouseDown = (e) => {
        if (scale <= 1) return; // 확대되지 않았으면 드래그 안 함
        setIsDragging(true);
        setDragStartPos({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    // 드래그 중 (마우스 이동 시 실시간으로 위치 업데이트)
    const handleMouseMove = (e) => {
        if (!isDragging || scale <= 1) return;

        const container = containerRef.current;
        const img = imageRef.current;

        const scaledWidth = img.offsetWidth * scale;
        const scaledHeight = img.offsetHeight * scale;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
        const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

        let newX = e.clientX - dragStartPos.x;
        let newY = e.clientY - dragStartPos.y;

        newX = Math.min(Math.max(newX, -maxX), maxX);
        newY = Math.min(Math.max(newY, -maxY), maxY);

        setPosition({ x: newX, y: newY });
    };

    // 드래그 종료 (마우스 업/떠날 때)
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => {
        setIsDragging(false);
        //setShowControls(false);
    }

    // scale이 1이 될 때 위치 초기화
    useEffect(() => {
        if (scale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [scale]);

    /* ====이미지 확대 및 축소 함수 끝====*/

    // 선택된 이미지 변경 시 미리보기 스크롤 위치 변경
    useEffect(() => {
        if (previewRef.current[selectedImage]) {
            previewRef.current[selectedImage].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
        resetImageState();
    }, [selectedImage]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel, { passive: false });
            }
        };
    }, [handleWheel]);

    return (
        <div className='image'>
            <div className='image-container'>
                <div className='image-container-left'>
                    <div className='image-container-header'>
                        <div className='image-container-header-info'>
                            <div className='image-container-header-counter'>{selectedImage + 1}/{images.length}</div>
                            <div className='image-container-header-time'>
                                {formatDateTime(images[selectedImage].time)} | {images[selectedImage].cctv.location}
                            </div>
                        </div>
                        <div className='image-container-header-title'>
                            이미지 뷰어
                        </div>
                        <div className='image-container-header-close' onClick={() => setShowImageModal(false)}>
                            닫기
                        </div>
                    </div>
                    <div className='image-container-body' ref={containerRef}>
                        <div className={`image-container-body-arrow ${selectedImage === 0 ? 'disabled' : ''}`} onClick={handlePrev}><RiArrowLeftWideFill /></div>
                        <div
                            className='image-container-body-mainImage'
                            // onWheel={handleWheel}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            // onMouseEnter={() => setShowControls(true)}
                            style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
                        >
                            {isVideo(images[selectedImage].path) ? (
                                <video
                                    ref={imageRef}
                                    src={images[selectedImage].path}
                                    autoPlay
                                    muted
                                    controls
                                    style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.2s ease',
                                    }}
                                // draggable="false"
                                />) : (
                                <img
                                    ref={imageRef}
                                    src={images[selectedImage].path}
                                    style={{
                                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                        transition: isDragging ? 'none' : 'transform 0.2s ease',
                                    }}
                                    draggable="false"
                                />)}


                            {showScaleToast && (
                                <div className="scale-toast">
                                    {Math.round(scale * 100)}%
                                </div>
                            )}
                            {/* {showControls && ( )} */}
                            <div className="zoom-controls">
                                <button onClick={handleZoomIn} ><FiPlus /></button>
                                <button onClick={handleZoomOut} ><FiMinus /></button>
                                <button onClick={handleResetZoom} ><FiRefreshCw /></button>
                            </div>

                        </div>
                        <div className={`image-container-body-arrow ${selectedImage === images.length - 1 ? 'disabled' : ''}`} onClick={handleNext}> <RiArrowRightWideFill /></div>

                    </div>
                </div>
                <div className='image-container-footer-wrapper'>
                    <div className='image-container-footer'>
                        {images.map((image, index) => (
                            <div key={image.imageId} className="preview-image-container">
                                {isVideo(image.path) ? (
                                    videoError[image.path] ? (
                                        <div
                                            className={`preview-image-error ${index === selectedImage ? "selected" : ""}`}
                                            onClick={() => setSelectedImage(index)}
                                            ref={(el) => (previewRef.current[index] = el)}
                                        >
                                            영상을 재생할 수 없습니다
                                        </div>
                                    ) : (
                                        <video
                                            src={image.path}
                                            muted
                                            playsInline
                                            preload="metadata"
                                            className={`preview-image ${index === selectedImage ? "selected" : ""}`}
                                            onClick={() => setSelectedImage(index)}
                                            onError={() => handleVideoError(image.path)}
                                            ref={(el) => (previewRef.current[index] = el)}
                                        />)
                                ) : (
                                    <img
                                        src={image.path}
                                        alt={`이미지 미리보기: 인덱스 ${index}`}
                                        className={`preview-image ${index === selectedImage ? "selected" : ""}`}
                                        onClick={() => setSelectedImage(index)}
                                        ref={(el) => (previewRef.current[index] = el)}
                                    />)}
                                <div className='preview-image-info'>{formatDateTime(image.time)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ImageModal