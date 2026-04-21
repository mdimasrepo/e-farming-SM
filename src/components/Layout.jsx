import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api, { checkMaintenanceStatus } from '../utils/api';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const res = await checkMaintenanceStatus();
        if (res.active && user.role !== 'admin') {
          navigate('/maintenance');
          return;
        }
      } catch (err) {
        console.error(err);
      }
      
      setChecking(false);
    };
    checkStatus();
  }, [navigate]);

  if (checking) return null;

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-main">
        <Topbar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
