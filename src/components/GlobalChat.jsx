import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import './GlobalChat.css';

export default function GlobalChat({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (!user || user.role !== 'petani') return;

    // Get base URL for socket
    const SOCKET_URL = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join', user.id);
    });

    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
      if (!isOpen && message.isFromAdmin) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, isOpen]);

  // Load history
  useEffect(() => {
    if (user && user.role === 'petani') {
      api.get('/chat/history')
        .then(data => {
          setMessages(data);
          // Calculate unread count (messages from admin that are unread)
          const unread = data.filter(m => m.isFromAdmin && !m.isRead).length;
          setUnreadCount(unread);
        })
        .catch(err => console.error("Gagal memuat chat:", err));
    }
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle open
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // reset unread when opened
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Send via API (API will broadcast via Socket.io)
      const sentMsg = await api.post('/chat/send', { message: newMessage });
      // We don't append immediately if the server broadcasts it back to us.
      // But actually, the server only broadcasts to 'admin_room' and 'user_id' which is us,
      // so it WILL broadcast back to us. But to prevent lag, we can optimistic append,
      // wait, the server emits to `user_${req.user.id}`, so we will receive it via socket.
      // Or we can just append it now and ignore our own broadcast. 
      // It's safer to just let the API response append it if we want to avoid duplicates.
      // Let's just append the response.
      
      // Wait, to avoid duplicate: the socket might arrive faster.
      // Let's just check if it's already in the state.
      setMessages(prev => {
        if (prev.find(m => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });
      
      setNewMessage('');
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  if (!user || user.role !== 'petani') return null;

  return (
    <div className="global-chat-container">
      {isOpen ? (
        <div className="chat-window animate-fade-in glass-panel">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar bg-primary">
                <User size={20} color="white" />
              </div>
              <div>
                <h4>Admin Pusat Bantuan</h4>
                <span className="chat-status">🟢 Online</span>
              </div>
            </div>
            <button onClick={toggleChat} className="chat-close-btn">
              <X size={20} />
            </button>
          </div>
          
          <div className="chat-body">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <MessageSquare size={32} />
                <p>Belum ada percakapan. Kirim pesan untuk mulai bertanya kepada Admin.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`chat-bubble-wrapper ${msg.isFromAdmin ? 'admin' : 'user'}`}>
                  <div className="chat-bubble">
                    <p>{msg.message}</p>
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input 
              type="text" 
              placeholder="Ketik pesan Anda..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-fab" onClick={toggleChat}>
          <MessageSquare size={28} />
          {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
        </button>
      )}
    </div>
  );
}
