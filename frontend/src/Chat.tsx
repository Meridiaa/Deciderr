import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css'; 

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm DecideForMe. Tell me about a decision you're struggling with." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/chat`, {
        messages: updatedMessages,
      });
      const aiMessage: Message = { role: 'assistant', content: response.data.reply };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1>DecideForMe</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <em>DecideForMe is thinking...</em>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe your situation..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;