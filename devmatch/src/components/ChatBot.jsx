import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const GEMINI_API_KEY = "AIzaSyCEpvgSuxgLudVdJN903YiYus7Oir7zB-g";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY;
const SYSTEM_PROMPT = "You are a helpful, friendly assistant for a freelance/job matching platform. Always provide a clear, helpful answer, even if you need to make reasonable assumptions or ask the user for more details. Never reply with 'I don't know.'";

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const greetings = ['hi', 'hello', 'hey', 'السلام عليكم', 'اهلا', 'مرحبا'];
    if (greetings.includes(input.trim().toLowerCase())) {
      setTimeout(() => {
        setMessages(msgs => [...msgs, { sender: 'bot', text: 'Hello! 👋 How can I assist you today?' }]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${input}` }]
            }
          ]
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
                || data?.candidates?.[0]?.content?.text
                || (typeof data === 'string' ? data : null)
                || 'Sorry, no response from AI.';
      setMessages(msgs => [...msgs, { sender: 'bot', text: aiText }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error: Could not get response.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center chatbot-bg position-relative" style={{background: 'linear-gradient(135deg, #232526 0%, #414345 100%)'}}>
      {/* Modern Glassy Chat Container */}
      <div className="rounded-5 shadow-lg p-0 mb-4 w-100" style={{ maxWidth: 500, background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(16px)', border: '1.5px solid #6c63ff33' }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 rounded-top-5 bg-gradient" style={{background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)'}}>
          <div className="d-flex align-items-center gap-2">
            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25 shadow" style={{width: 44, height: 44}}>
              <Sparkles size={28} className="text-primary" />
            </span>
            <span className="fw-bold fs-4 text-white text-shadow">DevMatch AI</span>
          </div>
          <button onClick={onClose} className="btn btn-light btn-sm rounded-circle border-0 ms-2" style={{width: 36, height: 36}} title="Close">
            <span className="fs-4 text-danger">&times;</span>
          </button>
        </div>
        {/* Messages */}
        <div className="px-4 py-4" style={{maxHeight: '55vh', overflowY: 'auto'}}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
              <div className={`p-3 rounded-4 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white user-bubble' : 'bg-white text-dark bot-bubble'}`} style={{maxWidth: '75%', minWidth: 80, fontWeight: 500, fontSize: '1.08rem', boxShadow: msg.sender === 'user' ? '0 2px 12px #6c63ff33' : '0 2px 12px #48c6ef22'}}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="d-flex justify-content-start mb-3">
              <div className="p-3 rounded-4 bg-white text-primary shadow-sm d-flex align-items-center gap-2 bot-bubble" style={{minWidth: 80}}>
                <span className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                Thinking...
              </div>
            </div>
          )}
        </div>
        {/* Input */}
        <form onSubmit={handleSend} className="d-flex gap-2 px-4 py-3 bg-white bg-opacity-75 rounded-bottom-5 border-top align-items-center" style={{backdropFilter: 'blur(8px)'}}>
          <input
            className="form-control form-control-lg rounded-pill bg-light border-0 shadow-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            style={{fontSize: '1.1rem'}}
          />
          <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow fw-bold" disabled={loading}>
            <Sparkles size={18} />
            Send
          </button>
        </form>
      </div>
      {/* Modern background animation */}
      <style>{`
        .chatbot-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 0;
          background: radial-gradient(circle at 80% 20%, #6c63ff33 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, #48c6ef33 0%, transparent 60%);
          pointer-events: none;
        }
        .user-bubble {
          border-bottom-right-radius: 0.5rem !important;
        }
        .bot-bubble {
          border-bottom-left-radius: 0.5rem !important;
        }
        .text-shadow {
          text-shadow: 0 2px 8px #6c63ff55, 0 1px 1px #222;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
