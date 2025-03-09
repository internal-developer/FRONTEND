import "./FeedbackModal.scss";
import { useEffect } from "react";

export default function FeedbackModal({ onClose, text1, text2, imgSrc }) {
    useEffect(() => {
        // 3초 후에 자동으로 모달 닫기
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="feedback-box">
            <img src={imgSrc} alt="이미지" />
            <div className="feedback-box-span-box">
                <span>{text1}</span>
                <span>{text2}</span>
            </div>
        </div>
    );
}
