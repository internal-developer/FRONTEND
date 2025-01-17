import React, { useState, useEffect } from 'react'
import './Modal.scss'

function EditModal({ setShowEditModal, selectedCCTV }) {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [url, setUrl] = useState('');

    // selectedCCTV 정보를 불러와서 상태 초기화
    useEffect(() => {
        if (selectedCCTV) {
            setName(selectedCCTV.name || '');
            setLocation(selectedCCTV.location || '');
            setStatus(selectedCCTV.status || '');
            setDate(selectedCCTV.installationDate || '');
            setUrl(selectedCCTV.VideoUrl || '');
        }
    }, [selectedCCTV]);


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
                        <input type='text' name='cctv-name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='add-input-container'>
                        <div>위치</div>
                        <input type='text' name='cctv-location' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className='add-input-container'>
                        <div>상태</div>
                        <div className='add-radio-container'>
                            <input
                                type='radio'
                                name='cctv-status'
                                value='Active'
                                checked={status === 'Active'}
                                onChange={(e) => setStatus(e.target.value)} /><span>등록</span>
                            <input type='radio'
                                name='cctv-status'
                                value='Inactive'
                                checked={status === 'Inactive'}
                                onChange={(e) => setStatus(e.target.value)} /><span>미등록</span>
                            <input type='radio'
                                name='cctv-status'
                                value='Error'
                                checked={status === 'Error'}
                                onChange={(e) => setStatus(e.target.value)} /><span>오류</span>
                        </div>
                    </div>
                    <div className='add-input-container'>
                        <div>설치일자</div>
                        <input type='datetime-local' name='cctv-date' value={date} onChange={(e)=>setDate(e.target.value)}/>
                    </div>
                    <div className='add-input-container'>
                        <div>CCTV Url</div>
                        <input type='text' name='cctv-url' value={url} onChange={(e) => setUrl(e.target.value)} />
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