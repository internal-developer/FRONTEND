// import logExample from "../../../../assets/images/logExample.png";
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
                    <img className="log-image" src={log.path} alt="logImage" />
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
