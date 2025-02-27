import React, { useState, useEffect } from "react";
import countryHouseIcon from "../../../../assets/images/country_house.png";
import LogList from "./LogList";
import FeedbackModal from "./FeedbackModal";
import api from "../../../../api/api";
import "./Log.scss";

export default function Log({
    selectedCCTV,
    onShowLog,
    multiView,
    dumpingData,
    setSelectedCCTV,
}) {
    const [checkedItems, setCheckedItems] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const cctvId = selectedCCTV ? selectedCCTV.cctvId : null;
    // const [dumpingEvent, setDumpingEvent] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
    }, [multiView, dumpingData, cctvId, filteredImages]);

    // useEffect(() => {
    //     console.log(
    //         "multiView: ",
    //         multiView,
    //         "\n",
    //         "selectedCCTV: ",
    //         selectedCCTV,
    //         "\n",
    //         "cctvId: ",
    //         cctvId,
    //         "\n",
    //         "filteredImages: ",
    //         filteredImages
    //     );
    // }, [filteredImages]);

    const handleClassificationError = () => {
        if (checkedItems.length === 0) {
            alert("선택된 항목이 없습니다.");
            return;
        }

        // 체크되지 않은 이미지 목록
        const successItems = filteredImages
            .filter((item) => !checkedItems.includes(item.imageId))
            .map((item) => item.imageId);

        // 실패한 이미지 삭제 및 로그 저장
        const deleteFailImages = api.delete("/cleanguard/image/fail", {
            data: checkedItems,
        });

        // 성공한 이미지 로그 저장
        const saveSuccessImages = successItems.length
            ? api.delete("/cleanguard/image/success", { data: successItems })
            : Promise.resolve(); // 성공 이미지가 없으면 요청 안 보냄

        Promise.all([deleteFailImages, saveSuccessImages])
            .then(([failResponse, successResponse]) => {
                console.log("분류 오류 처리 성공:", failResponse.data);
                if (successItems.length) {
                    console.log("성공 로그 저장 성공:", successResponse.data);
                }

                setShowFeedbackModal(true); // 성공 모달 표시

                // 최신 데이터 다시 가져오기
                api.get("/cleanguard/image/user")
                    .then((response) => {
                        setFilteredImages(response.data); // 리스트 업데이트
                        setCheckedItems([]); // 선택된 항목 초기화
                        console.log("목록 갱신 성공:", response.data);
                    })
                    .catch((error) => {
                        console.error("목록 갱신 실패:", error);
                    });
            })
            .catch((error) => {
                console.error("분류 오류 처리 실패:", error);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    return (
        <div className="viewer">
            {showFeedbackModal && (
                <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
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
