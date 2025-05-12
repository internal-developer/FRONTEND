import "./AlertToast.scss";
import { useEffect } from "react";

export default function AlertToast({
    onClose,
    cctvName,
    cctvLocation,
    imgSrc,
}) {
    useEffect(() => {
        // 3초 후에 자동으로 닫기
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="alert-box">
            <img src={imgSrc} alt="이미지" />
            <div className="alert-box-span-box">
                <span>
                    " {cctvName} ({cctvLocation}) " 에서 무단투기 현장이
                    적발되었습니다.
                </span>
            </div>
        </div>
    );
}
