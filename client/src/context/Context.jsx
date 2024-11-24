import { createContext, useState } from "react";
import axios from "axios";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState([]); // Stores conversation history
    const [loading, setLoading] = useState(false);

    const onSent = async () => {
        if (input.trim() === "") return; // Avoid empty submissions

        // Append the user's input to the conversation
        setConversation((prev) => [...prev, { role: "user", content: input }]);

        setLoading(true);
        const userMessage = input.trim();
        setInput(""); // Clear input field

        try {
            const response = await axios.post(
                "http://localhost:8000/generate-cybersecurity-content",
                { topic: userMessage }
            );

            const botResponse = response.data.html_response || "No response received.";

            // Append the bot's response to the conversation
            setConversation((prev) => [...prev, { role: "bot", content: botResponse }]);
        } catch (error) {
            console.error("Error during API call:", error);
            setConversation((prev) => [
                ...prev,
                { role: "bot", content: "Something went wrong. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        input,
        setInput,
        conversation,
        onSent,
        loading,
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
