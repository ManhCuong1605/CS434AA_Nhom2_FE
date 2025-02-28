import React from "react";
import "../style/MoTaChiTiet.css";

const MoTaChiTiet = ({ description }) => {
    return (
        <div className="description-section">
            <h3>Thông tin chi tiết</h3>
            <p>{description}</p>
        </div>
    );
};

export default MoTaChiTiet;