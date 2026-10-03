import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:8000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Floater {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface Heart {
  id: number;
  left: number;
  delay: number;
  emoji: string;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

type MascotState = 'happy' | 'thinking' | 'excited';

const SUGGESTIONS = [
  { emoji: '💻', text: "I can't decide between Mac or Windows" },
  { emoji: '🐱', text: 'Should I get a cat?' },
  { emoji: '✈️', text: 'Solo trip or group trip?' },
  { emoji: '🎓', text: 'Study abroad or stay home?' },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "hey bestie 🌸 I'm DecideForMe — your chaotic lil' decision-making partner. tell me what's cooking, and we'll figure it out together fr. no overthinking on my watch ✨",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('happy');
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [userMessageCount, setUserMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [floaters] = useState<Floater[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      emoji: ['🌸', '✨', '💖', '🎀', '⭐', '💫', '🍭', '🌈', '🦋', '☁️', '🎀', '💐', '🌷', '🌟', '🫧', '🧸'][i],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 14 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.6,
    }))
  );

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading) setMascotState('thinking');
    else setMascotState('happy');
  }, [isLoading]);

  const spawnHearts = () => {
    const newHearts: Heart[] = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      left: 30 + Math.random() * 40,
      delay: Math.random() * 0.3,
      emoji: ['💖', '💕', '🩷', '💗', '🌸'][Math.floor(Math.random() * 5)],
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id)));
    }, 2500);
  };

  const shootConfetti = () => {
    const pieces: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      emoji: ['🎉', '✨', '⭐', '💖', '🌸', '🎊', '💫', '🍭', '🎀'][Math.floor(Math.random() * 9)],
    }));
    setConfetti(pieces);
    setMascotState('excited');
    setTimeout(() => setConfetti([]), 4000);
    setTimeout(() => setMascotState('happy'), 4000);
  };

  const sendMessage = async (text?: string) => {
    const userText = text || input;
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: userText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setUserMessageCount((c) => c + 1);

    if (userMessageCount + 1 === 4) {
      setTimeout(() => shootConfetti(), 800);
    }

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: updatedMessages,
      });
      const aiMessage: Message = { role: 'assistant', content: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
      spawnHearts();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "bestie the vibes are off 😭 something broke on my end. is the backend running?",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const vibePercent = Math.min(100, userMessageCount * 25);
  const vibeLabel =
    vibePercent === 0
      ? 'chill vibes only'
      : vibePercent < 50
      ? "gettin' to know you 👀"
      : vibePercent < 100
      ? 'almost there bestie ✨'
      : 'ready for the verdict 💅';

  return (
    <div className="stage">
      <div className="cursor-glow" style={{ left: cursor.x, top: cursor.y }} />

      <div className="floaters">
        {floaters.map((f) => (
          <span
            key={f.id}
            className="floater"
            style={{
              left: `${f.left}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
              fontSize: `${f.size}rem`,
            }}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      {confetti.length > 0 && (
        <div className="confetti-field">
          {confetti.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            >
              {c.emoji}
            </span>
          ))}
        </div>
      )}

      {hearts.length > 0 && (
        <div className="hearts-field">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="heart"
              style={{ left: `${h.left}%`, animationDelay: `${h.delay}s` }}
            >
              {h.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="chat-card">
        <div className={`mascot ${mascotState}`}>
          {mascotState === 'thinking' ? '🤔' : mascotState === 'excited' ? '🥳' : '🐱'}
        </div>

        <header className="chat-header">
          <div className="title-wrap">
            <h1 className="title">
              DecideForMe <span className="sparkle">✨</span>
            </h1>
            <p className="tagline">your chaotic lil' decision partner</p>
          </div>
          <div className="status-dot" title="online" />
        </header>

        <div className="vibe-meter">
          <div className="vibe-labels">
            <span className="vibe-emoji">🌸</span>
            <span className="vibe-text">{vibeLabel}</span>
            <span className="vibe-percent">{vibePercent}%</span>
          </div>
          <div className="vibe-track">
            <div className="vibe-fill" style={{ width: `${vibePercent}%` }} />
          </div>
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="avatar assistant-avatar">🌸</div>
              )}
              <div className={`bubble ${msg.role}`}>
                <p>{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="avatar user-avatar">👤</div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-row assistant">
              <div className="avatar assistant-avatar">🌸</div>
              <div className="bubble assistant typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            <p className="suggestions-label">try one of these 👇</p>
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="chip"
                  onClick={() => sendMessage(s.text)}
                >
                  <span className="chip-emoji">{s.emoji}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          className="input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type your dilemma, bestie..."
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className="send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="send"
          >
            {isLoading ? '💭' : '✨'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;