// import logExample from "../../../../assets/images/logExample.png";
import "./LogList.scss";
import { useEffect } from "react";
import { RiExpandDiagonalLine } from "react-icons/ri";

export default function LogList({ logs, checkedItems, setCheckedItems, handleImageModal }) {
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
        // console.log("path:",path);
        if (!path) return false;
        return path.toLowerCase().endsWith('mp4');
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
                        <video
                            className="log-image"
                            src={log.path}
                            // onClick={() => handleCheckbox(log.imageId)}
                            // autoPlay
                            // muted
                            // loop
                            controls
                            width="640"
                            height="360"
                        />
                    ) : (
                        <img
                            className="log-image"
                            src={log.path}
                            alt="logImage"
                            onClick={() => handleCheckbox(log.imageId)}
                        />
                    )}

                    <RiExpandDiagonalLine
                        className="log-fullscreen-icon"
                        onClick={() => { handleImageModal(index) }}
                    />
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
