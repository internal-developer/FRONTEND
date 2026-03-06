import { useState } from 'react';

export function useVideoHandler() {
    const [videoError, setVideoError] = useState({});

    // jpg인지 mp4인지 구분하는 함수
    const isVideo = (path) => {
        if (!path) return false;
        return path.toLowerCase().endsWith('mp4');
    };

    const handleVideoError = (id) => {
        setVideoError((prev) => ({ ...prev, [id]: true }));
    };

    return {
        videoError,
        setVideoError, 
        isVideo,
        handleVideoError,
    };
}