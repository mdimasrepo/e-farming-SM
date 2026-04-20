import React, { useEffect, useState } from 'react';
import { Bell, Search, Sun, Moon, User } from 'lucide-react';
import './Topbar.css';

export default function Topbar() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="topbar glass-panel">
      <div className="search-bar">
        <Search className="search-icon" size={20} />
        <input type="text" placeholder="Cari data lahan, tanaman, dll..." />
      </div>
      
      <div className="topbar-actions">
        <button className="btn-icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="btn-icon notification-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Petani Cerdas</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
