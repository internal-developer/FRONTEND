import React, { useState, useEffect } from 'react'
import './Modal.scss'
import api from "../../../../api/api";

function EditModal({ setShowEditModal, selectedCCTV, setSelectedCCTV, setCctvList }) {
    //const [url, setUrl] = useState('');
    //const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [webcamList, setWebcamList] = useState([]); // 웹캠 목록 저장용 -> 하단 웹캠 선택 콤보박스에서 사용
    const [webcam, setWebcam] = useState("");

    // selectedCCTV 정보를 불러와서 상태 초기화
    useEffect(() => {
        if (selectedCCTV) {
            //setUrl(selectedCCTV.videoUrl || '');
            //setStatus(selectedCCTV.status || '');
            setName(selectedCCTV.cctvName || '');
            setLocation(selectedCCTV.location || '');
            setDate(selectedCCTV.cctvDate || '');
            setWebcam(selectedCCTV.webcamId || '');
        }

        // local에 연결된 웹캠 목록 가져오기
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput'); // 웹캠만 뜨도록 필터링
                setWebcamList(videoDevices);

                // 저장된 웹캠이 local 웹캠 목록에 존재하면 선택
                const matchedWebcam = videoDevices.find(device => device.deviceId === selectedCCTV?.webcamId);
                if (matchedWebcam) {
                    setWebcam(matchedWebcam.deviceId);
                } else {
                    setWebcam("UNAVAILABLE"); // 존재하지 않으면 UNAVAILABLE로 임시 저장
                }

            })
            .catch(error => {
                console.error("웹캠 목록 가져오기 실패:", error);
            });
    }, [selectedCCTV]);

    const cctvId = selectedCCTV.cctvId;

    const editCCTV = () => {
        const updateCCTV = { cctvName: name, location, cctvDate: date, webcamId: webcam === "UNAVAILABLE" ? selectedCCTV.webcamId : webcam };
        api.patch(`/cleanguard/cctv/${cctvId}`, updateCCTV)
            .then((response) => {
                console.log("수정된 CCTV:", response.data);
                // CCTV 리스트에서 수정된 CCTV만 업데이트
                setCctvList(prevList =>
                    prevList.map(cctv =>
                        cctv.cctvId === cctvId ? { ...cctv, ...response.data } : cctv
                    ));
                setSelectedCCTV(response.data);
                setShowEditModal(false);
                alert("CCTV 정보가 성공적으로 수정되었습니다.");
            })
            .catch((error) => {
                console.error("CCTV 수정 실패:", error);
                if (error.response) {
                    alert(`CCTV 수정 실패: ${error.response.data.message}`);
                } else if (error.request) {
                    alert("서버와의 연결이 원활하지 않습니다. 다시 시도하세요.");
                } else {
                    alert("요청을 처리하는 중 오류가 발생했습니다.");
                }
            });
    };


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
                    <div className='add-input-container'>
                        <div>CCTV 이름</div>
                        <input type='text' name='cctv-name' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='add-input-container'>
                        <div>위치</div>
                        <input type='text' name='cctv-location' value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    {/* <div className='add-input-container'>
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
                    </div> */}
                    <div className='add-input-container'>
                        <div>설치일자</div>
                        <input type='datetime-local' name='cctv-date' value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    {/* <div className='add-input-container'>
                        <div>CCTV Url</div>
                        <input type='text' name='cctv-url' value={url} onChange={(e) => setUrl(e.target.value)} />
                    </div> */}
                    <div className="add-input-container">
                        <div>웹캠</div>
                        <select
                            className="webcam-dropbox"
                            value={webcam || ""}
                            onChange={(e) => setWebcam(e.target.value)}
                        >
                            {webcam === "UNAVAILABLE" && (
                                <option value="UNAVAILABLE" disabled>저장된 웹캠을 찾을 수 없습니다</option>
                            )}

                            {webcamList.map(webcam => (
                                <option key={webcam.deviceId} value={webcam.deviceId}>
                                    {webcam.label || `Webcam ${webcam.deviceId}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='add-container-footer'>
                    <button className='add-button' onClick={editCCTV}>
                        수정
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditModal