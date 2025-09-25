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


export default DatLichHenModal;
