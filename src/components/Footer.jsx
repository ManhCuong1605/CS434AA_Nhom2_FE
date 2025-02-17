import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
function Footer() {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-5">
            <div className="container">
                <p className="mb-0">© 2024 Bất Động Sản. All rights reserved.</p>
                <p className="mb-0">
                    <a href="" className="text-white text-decoration-none">Về chúng tôi</a> |
                    <a href="" className="text-white text-decoration-none mx-2">Liên hệ</a> |
                    <a href="" className="text-white text-decoration-none mx-2">Chính sách</a>
                </p>
            </div>
        </footer>
    )
}

export default Footer
