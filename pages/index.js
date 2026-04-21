// Import required modules and components
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css'; // Example CSS module for styles

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [userInput, setUserInput] = useState('');

    const MAX_TURNS = 8;

    useEffect(() => {
        if (turnCount >= MAX_TURNS) {
            // Handle transition to resolution phase
            setUserInput(''); // Clear input
            return;
        }
    }, [turnCount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (turnCount >= MAX_TURNS) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(prevMessages => [...prevMessages, { text: userInput, isUser: true }, { text: data.reply, isUser: false }]);
            setTurnCount(prevCount => prevCount + 1);
            setUserInput('');
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.journeyLog}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.isUser ? styles.userBubble : styles.botBubble}>
                        {msg.text} <span className={styles.timestamp}>[{new Date().toUTCString()}]</span>
                    </div>
                ))}
                {error && <div className={styles.errorBubble}>{error}</div>}
            </div>
            <form onSubmit={handleSubmit} className={styles.chatForm}>
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={turnCount >= MAX_TURNS}
                    className={styles.textarea}
                />
                <button type="submit" className={styles.submitButton} disabled={turnCount >= MAX_TURNS}>Send</button>
            </form>
            {loading && <div className={styles.loading}>Loading...</div>}
        </div>
    );
};

export default ChatComponent;