import logExample from "../../../../assets/images/logExample.png";
import "./LogList.scss";
import { useState } from "react";

export default function LogList() {
    const logs = Array(13).fill({
        id: Math.random().toString(36).substring(2, 9), // 고유 ID 생성
        image: logExample,
        date: "2025-01-01",
        time: "00-00",
    });

    const [checkedItems, setCheckedItems] = useState([]);

    const handleCheckbox = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="log-list-container">
            {logs.map((log) => (
                <div key={log.id} className="log-item">
                    <input
                        type="checkbox"
                        className="log-checkbox"
                        checked={checkedItems.includes(log.id)}
                        onChange={() => handleCheckbox(log.id)}
                    />
                    <img className="log-image" src={log.image} alt="logImage" />
                    <div className="log-info">
                        <span>날짜: {log.date}</span>
                        <span>시간: {log.time}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
