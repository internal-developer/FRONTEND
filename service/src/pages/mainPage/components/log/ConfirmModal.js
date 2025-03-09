import React from "react";
import "./ConfirmModal.scss";

export default function ConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="confirm-background">
            <div className="confirm-box">
                <div className="confirm-text">
                    <span>선택한 이미지 데이터를</span>
                    <span>영구적으로 삭제하시겠습니까?</span>
                </div>
                <div className="confirm-buttons">
                    <button className="confirm-button" onClick={onCancel}>
                        취소
                    </button>
                    <button className="cancel-button" onClick={onConfirm}>
                        영구삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
