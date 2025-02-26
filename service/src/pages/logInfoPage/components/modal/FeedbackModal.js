import "../modal/FeedbackModal.scss";
import checkMark from "../../../../assets/images/check_mark.png";
import { useEffect } from "react";

export default function FeedbackModal(onClose) {
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
            <img src={checkMark} alt="이미지" />
            <div className="feedback-box-span-box">
                <span>정상적으로 처리되었습니다.</span>
                <span>감사합니다 :)</span>
            </div>
        </div>
    );
}
