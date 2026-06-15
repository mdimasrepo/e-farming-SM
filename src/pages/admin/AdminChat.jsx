import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import './AdminChat.css';

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    const SOCKET_URL = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_admin');
    });

    newSocket.on('newMessage', (message) => {
      // Update conversations list with latest message
      setConversations(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.user.id === message.userId);
        if (idx !== -1) {
          copy[idx].latestMessage = message;
          // Move to top
          const [moved] = copy.splice(idx, 1);
          copy.unshift(moved);
        } else {
          // If it's a new user, we might want to refetch conversations
          fetchConversations();
        }
        return copy;
      });

      // Update active chat if it's the currently selected user
      if (activeUser && activeUser.user.id === message.userId) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => newSocket.disconnect();
  }, [activeUser]);

  const fetchConversations = async () => {
    try {
      const data = await api.get('/chat/admin/conversations');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeUser) {
      api.get(`/chat/admin/history/${activeUser.user.id}`)
        .then(data => setMessages(data))
        .catch(err => console.error(err));
        
      // Mark conversation as read locally
      setConversations(prev => prev.map(c => {
        if (c.user.id === activeUser.user.id) {
          return { ...c, latestMessage: { ...c.latestMessage, isRead: true } };
        }
        return c;
      }));
    }
  }, [activeUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeUser) return;

    try {
      const sentMsg = await api.post(`/chat/admin/send/${activeUser.user.id}`, { message: newMessage });
      setMessages(prev => {
        if (prev.find(m => m.id === sentMsg.id)) return prev;
        return [...prev, sentMsg];
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Pusat Bantuan</h2>
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cari petani..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="chat-list">
          {filteredConversations.length === 0 ? (
            <div className="chat-list-empty">Tidak ada percakapan</div>
          ) : (
            filteredConversations.map(conv => {
              const isUnread = !conv.latestMessage.isFromAdmin && !conv.latestMessage.isRead;
              return (
                <div 
                  key={conv.user.id} 
                  className={`chat-list-item ${activeUser?.user.id === conv.user.id ? 'active' : ''} ${isUnread ? 'unread' : ''}`}
                  onClick={() => setActiveUser(conv)}
                >
                  <div className="chat-list-avatar bg-primary">
                    <User size={20} color="white" />
                  </div>
                  <div className="chat-list-info">
                    <div className="chat-list-name-time">
                      <h4>{conv.user.name}</h4>
                      <span>
                        {new Date(conv.latestMessage.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="chat-list-preview">
                      {conv.latestMessage.isFromAdmin ? 'Anda: ' : ''}
                      {conv.latestMessage.message.length > 30 
                        ? conv.latestMessage.message.substring(0, 30) + '...' 
                        : conv.latestMessage.message}
                    </p>
                  </div>
                  {isUnread && <span className="unread-dot"></span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="chat-main">
        {activeUser ? (
          <>
            <div className="chat-main-header glass-panel">
              <div className="chat-list-avatar bg-primary">
                <User size={20} color="white" />
              </div>
              <div>
                <h3>{activeUser.user.name}</h3>
                <span className="text-sm text-gray-500">ID Petani: {activeUser.user.id}</span>
              </div>
            </div>

            <div className="chat-messages-area">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`chat-bubble-wrapper ${msg.isFromAdmin ? 'admin-reply' : 'user-msg'}`}>
                  <div className="chat-bubble">
                    <p>{msg.message}</p>
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-area glass-panel">
              <input 
                type="text" 
                placeholder="Ketik balasan untuk petani..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={!newMessage.trim()}>
                <Send size={18} /> Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="chat-main-empty">
            <MessageSquare size={64} className="text-gray-300" />
            <h3>Pilih percakapan untuk memulai</h3>
            <p>Pesan dari petani akan muncul di panel sebelah kiri.</p>
          </div>
        )}
      </div>
    </div>
  );
}
