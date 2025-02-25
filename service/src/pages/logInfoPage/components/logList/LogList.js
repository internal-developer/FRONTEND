import logExample from "../../../../assets/images/logExample.png";
import "./LogList.scss";
import { useEffect } from "react";

export default function LogList({ logs, checkedItems, setCheckedItems }) {
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

    return (
        <div className="log-list-container">
            {logs.map((log) => (
                <div key={log.imageId} className="log-item">
                    <input
                        type="checkbox"
                        className="log-checkbox"
                        checked={checkedItems.includes(log.imageId)}
                        onChange={() => handleCheckbox(log.imageId)}
                    />
                    {/* <img className="log-image" src={log.path} alt="logImage" /> */}
                    {/* 예시 이미지 */}
                    <img
                        className="log-image"
                        src={logExample}
                        alt="logImage"
                    />
                    <div className="log-info">
                        <span>
                            날짜: {log.time.toString().slice(0, 4)}-
                            {log.time.toString().slice(4, 6)}-
                            {log.time.toString().slice(6, 8)}
                        </span>
                        <span>
                            시간: {log.time.toString().slice(8, 10)}:
                            {log.time.toString().slice(10)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
