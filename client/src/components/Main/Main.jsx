import React, { useContext, useEffect, useRef, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets.js";
import { Context } from "../../context/Context.jsx";
import { jsPDF } from "jspdf";

const Main = () => {
    const { onSent, conversation, loading, setInput, input } = useContext(Context);
    const resultRef = useRef(null);
    const [rows, setRows] = useState(1);

    useEffect(() => {
        const updateRows = () => {
            if (window.innerWidth <= 600) {
                setRows(2);
            } else {
                setRows(1);
            }
        };

        updateRows();
        window.addEventListener("resize", updateRows);
        return () => window.removeEventListener("resize", updateRows);
    }, []);

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSend = () => {
        onSent(); // Trigger the onSent function in Context
    };

    const handleKeyUp = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent adding a new line
            handleSend();
        }
    };

    const downloadChatAsPDF = () => {
        const doc = new jsPDF();

        // Title for the chat
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Chat History", 10, 10);

        // Iterate over the conversation and add content to the PDF
        let yOffset = 20; // Vertical position in the PDF
        conversation.forEach((message, index) => {
            doc.setFont("helvetica", message.role === "user" ? "bold" : "normal");
            doc.setFontSize(12);
            const roleText = message.role === "user" ? "User: " : "Bot: ";
            const content = `${roleText}${message.content.replace(/<[^>]+>/g, "")}`; // Strip HTML tags

            // Split long messages into multiple lines
            const lines = doc.splitTextToSize(content, 180);
            lines.forEach((line) => {
                doc.text(line, 10, yOffset);
                yOffset += 10;
                if (yOffset > 280) {
                    // Add a new page if the content exceeds the page limit
                    doc.addPage();
                    yOffset = 10;
                }
            });
        });

        // Trigger PDF download
        doc.save("chat-history.pdf");
    };

    return (
        <main className="main">
            <nav className="nav">
                <p>SafeNet.io</p>
            </nav>
            <div className="main-container">
                <div className="result" ref={resultRef}>
                    {conversation.length === 0 ? (
                        <div className="greet">
                            <p>
                                <span>Hello user</span>
                            </p>
                            <p>How can I help you today?</p>
                        </div>
                    ) : (
                        conversation.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-message ${message.role === "user" ? "user" : "bot"}`}
                            >
                                {message.role === "user" ? (
                                    <div className="user-message">
                                        <p>{message.content}</p>
                                    </div>
                                ) : (
                                    <div className="bot-message">
                                        <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="loader">
                            <hr />
                            <hr />
                            <hr />
                        </div>
                    )}
                    {conversation.length > 0 && (
                        <button className="download-chat" onClick={downloadChatAsPDF}>Download Chat</button>
                    )}
                </div>
                <div className="main-bottom">
                    <div className="search-box">
                        <textarea
                            rows={rows}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyUp={handleKeyUp}
                            value={input}
                            placeholder="Enter a prompt here"
                        />
                        <div className="icon-container">
                            <button type="submit" onClick={handleSend}>
                                <img src={assets.send_icon} alt="Send" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Main;
