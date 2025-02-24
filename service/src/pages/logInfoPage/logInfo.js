import LogList from "./components/logList/LogList";
import "./logInfo.scss";
import countryHouseIcon from "../../assets/images/country_house.png";
import dumpingData from "../../data/dumpingData.json";

import React, { useState, useEffect } from "react";
import Header from "../mainPage/components/header/Header";
import CCTVSidemenu from "../mainPage/components/cctvSidemenu/CCTVSidemenu";
import AddModal from "../mainPage/components/cctvSidemenu/AddModal";
import EditModal from "../mainPage/components/cctvSidemenu/EditModal";
import DeleteModal from "../mainPage/components/cctvSidemenu/DeleteModal";
import { useNavigate } from "react-router-dom";

export default function LogInfoPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cctvList, setCctvList] = useState([]); // CCTV 리스트 예시
    const [selectedCCTV, setSelectedCCTV] = useState(null);

    const navigate = useNavigate();
    const navigateToMain = () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        navigate(
            `/main?access_token=${accessToken}&refresh_token=${refreshToken}`
        );
    };

    // api imageDTO list 가져오기. 일단 예시로 작성해놓음(dumpingData)

    const [checkedItems, setCheckedItems] = useState([]);

    return (
        <div className="main">
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
                        {/* <img src={logExample} alt="이미지" /> */}
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
                            logs={dumpingData}
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
