import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TimKiem() {
    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Trên toàn quốc"
                        />
                        <button className="btn btn-danger" type="button">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="col-md-8 mx-auto">
                    <div className="d-flex gap-2">
                        <select className="form-select">
                            <option>Khu vực</option>
                        </select>
                        <select className="form-select">
                            <option>Loại nhà đất</option>
                        </select>
                        <select className="form-select">
                            <option>Mức giá</option>
                        </select>
                        <select className="form-select">
                            <option>Diện tích</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimKiem;
