import React from 'react';
import './Modal.scss';
import api from "../../../../api/api";

function DeleteModal({ setShowDeleteModal, selectedCCTV }) {
    const cctvId = selectedCCTV.cctvId;
    const deleteCCTV = () => {
        api
            .delete(`/cleanguard/cctv/${cctvId}`)
            .then((response) => {
                console.log("CCTV 삭제:", response.data);
                setShowDeleteModal(false);
                alert("CCTV가 삭제되었습니다.");
            })
            .catch((error) => {
                console.error("CCTV 삭제 실패:", error);
                alert("CCTV 삭제 중 오류가 발생했습니다. 다시 시도하세요.");
            });

    };

    return (
        <div className='delete'>
            <div className='delete-container'>
                <div className='delete-container-header'>
                    <div>&nbsp;</div>
                    <div className='delete-container-header-title'>삭제 확인</div>
                </div>
                <div className='delete-container-body'>
                    <p>정말로 삭제하시겠습니까?</p>
                </div>
                <div className='delete-container-footer'>
                    <button className='delete-button cancel' onClick={() => setShowDeleteModal(false)}>
                        취소
                    </button>
                    <button className='delete-button confirm' onClick={deleteCCTV}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
