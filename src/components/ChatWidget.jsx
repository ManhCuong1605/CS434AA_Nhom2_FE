import React, { useState, useEffect } from "react";
import { BsChatDots, BsX } from "react-icons/bs";
import "../style/ChatWidget.css";
import { useChat } from "../context/ChatContext"; // Import context

const ChatWidget = ({ initialMessage = "" }) => {
    const { isChatOpen, setIsChatOpen } = useChat(); // Lấy trạng thái chat từ context
    const [messages, setMessages] = useState(
        initialMessage ? [{ text: initialMessage, type: "user" }] : []
    );
    const [userMessage, setUserMessage] = useState("");

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setMessages([{ text: "Xin chào! Chúng tôi có thể giúp gì cho bạn?", type: "agent" }]);
        }
    }, [isChatOpen, messages.length]);

    const handleSendMessage = () => {
        if (userMessage.trim() !== "") {
            setMessages([...messages, { text: userMessage, type: "user" }]);
            setUserMessage("");

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { text: "Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.", type: "agent" }
                ]);
            }, 1000);
        }
    };

    return (
        <div>
            <div className="chat-icon" onClick={() => setIsChatOpen(!isChatOpen)}>
                {isChatOpen ? <BsX size={24} /> : <BsChatDots size={24} />}
            </div>

            {isChatOpen && (
                <div className="chat-box">
                    <div className="chat-header">
                        <strong>Hỗ trợ khách hàng</strong>
                        <button onClick={() => setIsChatOpen(false)}>X</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.type}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Gửi</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
