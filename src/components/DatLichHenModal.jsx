import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Calendar3, Clock } from "react-bootstrap-icons"; // icon đẹp
import datLichHenApi from "../api/DatLichHenApi";

const DatLichHenModal = ({ show, onClose, nhaDatId }) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Vui lòng chọn ngày và giờ hẹn!");
            return;
        }

        const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
        const isoUTC = new Date(
            selectedDateTime.getTime() - selectedDateTime.getTimezoneOffset() * 60000
        ).toISOString();

        const now = new Date();
        if (selectedDateTime < now) {
            toast.error("Ngày giờ hẹn không được nhỏ hơn hiện tại!");
            return;
        }

        try {
            const res = await datLichHenApi.datLichHen(
                nhaDatId,
                selectedDateTime.toISOString()
            );
            toast.success(res.data.message);
            setSelectedDate("");
            setSelectedTime("");
            onClose(); // đóng modal
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt lịch thất bại");
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>📅 Đặt lịch hẹn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <Calendar3 className="me-2 text-primary" />
                            Chọn ngày hẹn
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={selectedDate ? "is-valid" : ""}
                            placeholder="Chọn ngày"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <Clock className="me-2 text-success" />
                            Chọn giờ hẹn
                        </Form.Label>
                        <Form.Control
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className={selectedTime ? "is-valid" : ""}
                            placeholder="Chọn giờ"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    ❌ Hủy
                </Button>
                <Button variant="success" onClick={handleBookAppointment}>
                    ✅ Đặt lịch
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DatLichHenModal;
