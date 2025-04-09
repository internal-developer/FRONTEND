import "./LogList.scss";
import { useEffect, useState } from "react";
import { RiExpandDiagonalLine } from "react-icons/ri";

export default function LogList({ logs, checkedItems, setCheckedItems, handleImageModal }) {
    const [videoError, setVideoError] = useState({});

    const handleCheckbox = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    useEffect(() => {
        console.log("checkedItems 업데이트됨:", checkedItems);
    }, [checkedItems]);

    // jpg인지 mp4인지 구분하는 함수
    const isVideo = (path) => {
        if (!path) return false;
        return path.toLowerCase().endsWith('mp4');
    };

    const handleVideoError = (id) => {
        setVideoError((prev) => ({ ...prev, [id]: true }));
    };

    return (
        <div className="log-list-container">
            {logs.map((log, index) => (
                <div key={log.imageId} className="log-item">
                    <input
                        type="checkbox"
                        className="log-checkbox"
                        checked={checkedItems.includes(log.imageId)}
                        onChange={() => handleCheckbox(log.imageId)}
                    />
                    {isVideo(log.path) ? (
                        <div className="log-video-container">
                            {videoError[log.imageId] ? (
                                <div
                                    className="log-video-error"
                                    onClick={() => handleCheckbox(log.imageId)}
                                >
                                    영상을 재생할 수 없습니다
                                </div>
                            ) : (
                                <>
                                    <video
                                        src={log.path}
                                        muted
                                        preload="metadata"
                                        playsInline
                                        onClick={() => handleCheckbox(log.imageId)}
                                        onError={() => handleVideoError(log.imageId)}
                                    />
                                    <div
                                        className="custom-play-button"
                                        onClick={() => handleImageModal(index)}
                                    >
                                        ▶
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <img
                                className="log-image"
                                src={log.path}
                                alt="logImage"
                                onClick={() => handleCheckbox(log.imageId)}
                            />
                            <RiExpandDiagonalLine
                                className="log-fullscreen-icon"
                                onClick={() => { handleImageModal(index) }}
                            />
                        </>
                    )}
                    <div className="log-info">
                        <span>
                            날짜: {new Date(log.time).getFullYear()}-
                            {String(new Date(log.time).getMonth() + 1).padStart(
                                2,
                                "0"
                            )}
                            -
                            {String(new Date(log.time).getDate()).padStart(
                                2,
                                "0"
                            )}
                        </span>
                        <span>
                            시간:{" "}
                            {String(new Date(log.time).getHours()).padStart(
                                2,
                                "0"
                            )}
                            :
                            {String(new Date(log.time).getMinutes()).padStart(
                                2,
                                "0"
                            )}
                            :
                            {String(new Date(log.time).getSeconds()).padStart(
                                2,
                                "0"
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
