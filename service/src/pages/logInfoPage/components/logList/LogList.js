import logExample from "../../../../assets/images/logExample.png";
import "./LogList.scss";

export default function LogList() {
    const logs = Array(13).fill({
        image: logExample,
        date: "2025-01-01",
        time: "00-00",
    });

    return (
        <div className="log-list-container">
            {logs.map((log, index) => (
                <div key={index} className="log-item">
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
