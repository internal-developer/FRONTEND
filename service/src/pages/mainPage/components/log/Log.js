import React, { useState, useEffect } from "react";
import countryHouseIcon from "../../../../assets/images/country_house.png";
import checkMark from "../../../../assets/images/check_mark.png";
import trashCan from "../../../../assets/images/trash_can.png";
import LogList from "./LogList";
import FeedbackModal from "./FeedbackModal";
import ConfirmModal from "./ConfirmModal";
import api from "../../../../api/api";
import "./Log.scss";

export default function Log({
    selectedCCTV,
    onShowLog,
    multiView,
    dumpingData,
    setSelectedCCTV,
    roleName,
}) {
    const [checkedItems, setCheckedItems] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const cctvId = selectedCCTV ? selectedCCTV.cctvId : null;
    // const [dumpingEvent, setDumpingEvent] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [imgSrc, setImgSrc] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        // 멀티뷰일 경우, 모든 투기 데이터를 보여줌
        if (multiView) {
            setFilteredImages(dumpingData);
            setSelectedCCTV(null);
        }
        // 단일뷰일 경우, 선택된 CCTV의 투기 데이터만 보여줌
        else if (cctvId !== null) {
            // cctvId가 null이 아닐 때만 필터링 실행
            setFilteredImages(
                dumpingData.filter((item) => item.cctv.cctvId === cctvId)
            );
        } else {
            setFilteredImages([]); // 선택된 CCTV가 없으면 빈 배열
        }
    }, [multiView, dumpingData, cctvId]);

    // 분류 오류 이벤트를 처리하는 함수수
    const handleClassificationError = async () => {
        if (checkedItems.length === 0) {
            alert("선택된 항목이 없습니다.");
            return;
        }

        // 체크되지 않은 이미지 목록
        const successItems = filteredImages
            .filter((item) => !checkedItems.includes(item.imageId))
            .map((item) => item.imageId);

        try {
            // 실패한 이미지 삭제 요청
            const deleteFailImages = await api.delete(
                "/cleanguard/image/fail",
                {
                    params: { imageIds: checkedItems },
                    paramsSerializer: (params) => {
                        return Object.keys(params)
                            .map((key) =>
                                []
                                    .concat(params[key])
                                    .map(
                                        (val) =>
                                            `${key}=${encodeURIComponent(val)}`
                                    )
                                    .join("&")
                            )
                            .join("&");
                    },
                }
            );

            console.log("fail 삭제 응답:", deleteFailImages.data);

            // 성공한 이미지 post 요청
            let successResponse = null;
            if (successItems.length) {
                try {
                    successResponse = await api.post(
                        "/cleanguard/image/success",
                        null, // body를 비워두고 params로 데이터를 전달
                        {
                            params: { imageIds: successItems },
                            paramsSerializer: (params) => {
                                return Object.keys(params)
                                    .map((key) =>
                                        []
                                            .concat(params[key])
                                            .map(
                                                (val) =>
                                                    `${key}=${encodeURIComponent(
                                                        val
                                                    )}`
                                            )
                                            .join("&")
                                    )
                                    .join("&");
                            },
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    console.log("success 저장 응답:", successResponse.data);
                } catch (error) {
                    console.error("Success 이미지 저장 실패:", error);
                    console.log("서버 응답:", error.response?.data);
                    alert(
                        `Success 저장 실패: ${
                            error.response?.data?.message || error.message
                        }`
                    );
                }
            }

            setText1("정상적으로 처리되었습니다.");
            setText2("감사합니다 :)");
            setImgSrc(checkMark);

            setShowFeedbackModal(true); // 성공 모달 표시

            // 최신 데이터 다시 가져오기
            if (roleName) {
                const response = await api.get(`/cleanguard/image/${roleName}`);
                setFilteredImages(response.data);
                setCheckedItems([]); // 선택된 항목 초기화
                console.log("목록 갱신 성공:", response.data);
            }
        } catch (error) {
            console.error("분류 오류 처리 실패:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    // 영구 삭제 이벤트를 처리하는 함수
    const handlePermanentDelete = async () => {
        if (checkedItems.length === 0) {
            alert("선택된 항목이 없습니다.");
            return;
        }

        try {
            // 선택된 이미지 삭제 요청
            const deleteResponse = await api.delete("/cleanguard/image/", {
                params: { imageIds: checkedItems },
                paramsSerializer: (params) => {
                    return Object.keys(params)
                        .map((key) =>
                            []
                                .concat(params[key])
                                .map(
                                    (val) => `${key}=${encodeURIComponent(val)}`
                                )
                                .join("&")
                        )
                        .join("&");
                },
            });

            console.log("영구 삭제 응답:", deleteResponse.data);

            setText1("정상적으로 처리되었습니다.");
            setText2("감사합니다 :)");
            setImgSrc(trashCan);

            setShowFeedbackModal(true);

            // 목록 갱신
            if (roleName) {
                const response = await api.get(`/cleanguard/image/${roleName}`);
                setFilteredImages(response.data);
                setCheckedItems([]);
                console.log("목록 갱신 성공:", response.data);
            }
        } catch (error) {
            console.error("영구 삭제 실패:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleConfirmModal = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        setShowConfirmModal(false);
        handlePermanentDelete();
    };

    return (
        <div className="viewer">
            {showFeedbackModal && (
                <FeedbackModal
                    onClose={() => setShowFeedbackModal(false)}
                    text1={text1}
                    text2={text2}
                    imgSrc={imgSrc}
                />
            )}
            {showConfirmModal && (
                <ConfirmModal
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            <div className="viewer-topbar">
                <div className="viewer-title">
                    현재 CCTV:{" "}
                    {selectedCCTV ? selectedCCTV.cctvName : "선택되지 않음"}
                </div>
                <button className="viewer-main-button" onClick={onShowLog}>
                    <img
                        src={countryHouseIcon}
                        alt="아이콘"
                        className="viewer-main-button-icon"
                    />
                    Main
                </button>
                <div className="viewer-button-group">
                    <button
                        className="viewer-button-group-action"
                        style={{ backgroundColor: "#A0A0A0" }}
                        onClick={handleClassificationError}
                    >
                        분류 오류
                    </button>
                    <button
                        className="viewer-button-group-action"
                        style={{ backgroundColor: "#AF0000" }}
                        // onClick={handlePermanentDelete}
                        onClick={handleConfirmModal}
                    >
                        영구 삭제
                    </button>
                </div>
            </div>
            <LogList
                logs={filteredImages}
                checkedItems={checkedItems}
                setCheckedItems={setCheckedItems}
            />
        </div>
    );
}
