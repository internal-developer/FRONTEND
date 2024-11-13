import React from 'react'
import './Modal.scss'

function EditModal({ setShowEditModal }) {
    return (
        <div className='add'>
            <div className='add-container'>
                <div className='add-container-header'>
                    <div>&nbsp;</div>
                    <div className='add-container-header-title'>
                        CCTV 정보 수정
                    </div>
                    <div className='add-container-header-close' onClick={() => setShowEditModal(false)}>
                        닫기
                    </div>
                </div>
                <div className='add-container-body'>
                    {/* << body 내용 수정 필요 >>
                     - 일단 text input으로 구현
                     - CCTV Url 부분 수정 필요
                      */}
                    <div className='add-input-container'>
                        <div>CCTV 이름</div>
                        <input type='text' name='cctv-name' />
                    </div>
                    <div className='add-input-container'>
                        <div>위치</div>
                        <input type='text' name='cctv-location' />
                    </div>
                    <div className='add-input-container'>
                        <div>상태</div>
                        <div className='add-radio-container'>
                            <input type='radio' name='cctv-status' /><span>등록</span>
                            <input type='radio' name='cctv-status' /><span>미등록</span>
                            <input type='radio' name='cctv-status' /><span>오류</span>
                        </div>
                    </div>
                    <div className='add-input-container'>
                        <div>설치일자</div>
                        <input type='datetime-local' name='cctv-date' />
                    </div>
                    <div className='add-input-container'>
                        <div>CCTV Url</div>
                        <input type='text' name='cctv-url' />
                    </div>
                </div>
                <div className='add-container-footer'>
                    <button className='add-button' onClick={() => {/* 추가 로직 */ }}>
                        수정
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditModal