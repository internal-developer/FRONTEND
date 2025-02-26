import LogList from "./components/logList/LogList";
import FeedbackModal from "./components/modal/FeedbackModal";
import "./logInfo.scss";
import countryHouseIcon from "../../assets/images/country_house.png";
// import dumpingData from "../../data/dumpingData.json";

import React, { useState, useEffect } from "react";
import Header from "../mainPage/components/header/Header";
import CCTVSidemenu from "../mainPage/components/cctvSidemenu/CCTVSidemenu";
import AddModal from "../mainPage/components/cctvSidemenu/AddModal";
import EditModal from "../mainPage/components/cctvSidemenu/EditModal";
import DeleteModal from "../mainPage/components/cctvSidemenu/DeleteModal";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function LogInfoPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cctvList, setCctvList] = useState([]); // CCTV 리스트 예시
    const [selectedCCTV, setSelectedCCTV] = useState(null);

    const [checkedItems, setCheckedItems] = useState([]);
    const [dumpingEvent, setDumpingEvent] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    useEffect(() => {
        // image 데이터 요청
        api.get("/cleanguard/image/user")
            .then((response) => {
                setDumpingEvent(response.data);
                console.log(
                    "로그상세페이지 Dumping 데이터 가져오기 성공:",
                    response.data
                );
            })
            .catch((error) => {
                console.error(
                    "로그상세페이지 Dumping 데이터 가져오기 실패:",
                    error
                );
            });
    }, [window.location.search]);

    const navigate = useNavigate();
    const navigateToMain = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        navigate(
            `/main?access_token=${accessToken}&refresh_token=${refreshToken}`
        );
    };

    const handleClassificationError = () => {
        if (checkedItems.length === 0) {
            alert("선택된 항목이 없습니다.");
            return;
        }

        const data = checkedItems;
        api.delete("/cleanguard/image", { data })
            .then((response) => {
                console.log(
                    "상세페이지 분류 오류 처리(로그 삭제) 성공:",
                    response.data
                );

                // 성공 모달 표시
                setShowFeedbackModal(true);

                // 리스트 갱신: 서버에서 최신 데이터를 다시 가져오기
                api.get("/cleanguard/image/user")
                    .then((response) => {
                        setDumpingEvent(response.data); // 리스트 업데이트
                        setCheckedItems([]); // 선택된 항목 초기화
                        console.log(
                            "상세페이지 로그 삭제 후 목록 갱신 성공:",
                            response.data
                        );
                    })
                    .catch((error) => {
                        console.error(
                            "상세페이지 로그 삭제 후후 목록 갱신 실패:",
                            error
                        );
                    });
            })
            .catch((error) => {
                console.error("상세페이지 분류 오류 처리 실패:", error);
                alert("오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    return (
        <div className="main">
            {showFeedbackModal && (
                <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
            )}
            <div className="main-container">
                <Header />
                <div className="main-content">
                    <div className="sidemenu">
                        <CCTVSidemenu
                            cctvList={cctvList}
                            setShowAddModal={setShowAddModal}
                            setShowEditModal={setShowEditModal}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    </div>
                    <div className="viewer">
                        <div className="viewer-topbar">
                            <div className="viewer-title">
                                현재 CCTV:{" "}
                                {selectedCCTV
                                    ? selectedCCTV.cctvName
                                    : "선택되지 않음"}
                            </div>
                            <button
                                className="viewer-main-button"
                                onClick={navigateToMain}
                            >
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
                            logs={dumpingEvent}
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    </div>
                </div>
            </div>
            {showAddModal && <AddModal setShowAddModal={setShowAddModal} />}
            {showEditModal && <EditModal setShowEditModal={setShowEditModal} />}
            {showDeleteModal && (
                <DeleteModal setShowDeleteModal={setShowDeleteModal} />
            )}
        </div>
    );
}
