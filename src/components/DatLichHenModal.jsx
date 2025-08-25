import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
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
        const now = new Date();

        if (selectedDateTime < now) {
            toast.error("Ngày giờ hẹn không được nhỏ hơn hiện tại!");
            return;
        }

        try {
            const res = await datLichHenApi.datLichHen(nhaDatId, selectedDateTime.toISOString());
            toast.success(res.data.message);
            setSelectedDate("");
            setSelectedTime("");
            onClose(); // đóng modal
        } catch (error) {
            toast.error(error.response?.data?.message || "Đặt lịch thất bại");
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Đặt lịch hẹn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Chọn ngày hẹn</Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Chọn giờ hẹn</Form.Label>
                        <Form.Control
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleBookAppointment}>
                    Đặt lịch
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DatLichHenModal;
