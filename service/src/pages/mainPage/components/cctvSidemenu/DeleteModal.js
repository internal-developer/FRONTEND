import React from 'react';
import './Modal.scss';

function DeleteModal({ setShowDeleteModal }) {
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
                    <button className='delete-button confirm'>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;
