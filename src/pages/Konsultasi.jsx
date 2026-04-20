import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Star, Send, Loader, ArrowLeft, Bot, User } from 'lucide-react';
import { chatKonsultasi } from '../utils/api';
import './Ekstensi.css';

const pakarList = [
  { id: 'hama', name: 'Dr. Ir. Wahyudi', focus: 'Ahli Hama & Penyakit Tanaman', rating: 4.9, emoji: '🐛', color: '#ef4444' },
  { id: 'tanah', name: 'Siti Aminah, SP.', focus: 'Manajemen Tanah & Pupuk', rating: 4.8, emoji: '🌍', color: '#f59e0b' },
  { id: 'padi', name: 'Budi Santoso, M.Si', focus: 'Penyuluh Padi & Palawija', rating: 4.7, emoji: '🌾', color: '#10b981' },
  { id: 'umum', name: 'Asisten Tani.Smart', focus: 'Konsultasi Pertanian Umum', rating: 5.0, emoji: '🤖', color: '#6366f1' },
];

export default function Konsultasi() {
  const [selectedPakar, setSelectedPakar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startChat = (pakar) => {
    setSelectedPakar(pakar);
    setMessages([{
      role: 'assistant',
      content: `Halo! Saya ${pakar.name}, ${pakar.focus.toLowerCase()}. Ada yang bisa saya bantu seputar pertanian Anda hari ini? 😊`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = {
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const data = await chatKonsultasi(userMsg.content, history, selectedPakar.id);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Chat View
  if (selectedPakar) {
    return (
      <div className="extensi-container animate-fade-in">
        <div className="chat-header glass-panel">
          <button className="btn-icon" onClick={() => { setSelectedPakar(null); setMessages([]); }}>
            <ArrowLeft size={20} />
          </button>
          <div className="chat-pakar-info">
            <div className="chat-avatar" style={{ background: selectedPakar.color }}>{selectedPakar.emoji}</div>
            <div>
              <h3>{selectedPakar.name}</h3>
              <span className="text-muted">{selectedPakar.focus}</span>
            </div>
          </div>
          <div className="chat-status-online">● Online</div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`}>
              <div className="bubble-icon">
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="bubble-content">
                <p>{msg.content}</p>
                <span className="bubble-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {sending && (
            <div className="chat-bubble assistant">
              <div className="bubble-icon"><Bot size={16} /></div>
              <div className="bubble-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-bar glass-panel">
          <textarea
            placeholder="Ketik pertanyaan Anda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={sending}
          />
          <button className="btn-primary chat-send" onClick={handleSend} disabled={!input.trim() || sending}>
            {sending ? <Loader size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    );
  }

  // Pakar List View
  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Konsultasi Pakar</h1>
        <p className="text-muted">Chat langsung dengan AI pakar pertanian. Tanyakan apa saja seputar tanaman, hama, pupuk, dan lainnya.</p>
      </div>

      <div className="pakar-list">
        {pakarList.map((p) => (
          <div key={p.id} className="pakar-card glass-panel" onClick={() => startChat(p)} style={{ cursor: 'pointer' }}>
            <div className="pakar-avatar">
              <div className="avatar-placeholder" style={{ background: p.color, fontSize: '1.8rem' }}>{p.emoji}</div>
              <div className="status-dot online"></div>
            </div>
            <div className="pakar-info">
              <h3>{p.name}</h3>
              <p className="focus">{p.focus}</p>
              <div className="rating">
                <Star size={14} fill="var(--warning)" color="var(--warning)" />
                <span>{p.rating}</span>
              </div>
            </div>
            <div className="pakar-actions">
              <button className="btn-primary">
                <MessageSquare size={16} /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
