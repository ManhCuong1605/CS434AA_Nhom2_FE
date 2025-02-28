import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import banner1 from "../assets/slide/banner1.jpg";
import banner2 from "../assets/slide/banner2.jpg";
import banner3 from "../assets/slide/banner3.jpg";

function Slide() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [banner1, banner2, banner3];


    const prevSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="carousel slide">
            <div className="carousel-inner">
                {images.map((src, index) => (
                    <div key={index} className={`carousel-item ${index === activeIndex ? "active" : ""}`}>
                        <img
                            src={src}
                            className="d-block w-100"
                            alt={`Slide ${index + 1}`}
                            style={{ height: "500px", objectFit: "cover" }}
                        />
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" onClick={prevSlide}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Trước</span>
            </button>
            <button className="carousel-control-next" type="button" onClick={nextSlide}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Sau</span>
            </button>
        </div>
    );
}

export default Slide;
