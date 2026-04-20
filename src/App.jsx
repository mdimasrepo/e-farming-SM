import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManajemenLahan from './pages/ManajemenLahan';
import DataTanaman from './pages/DataTanaman';
import JadwalKegiatan from './pages/JadwalKegiatan';
import Inventori from './pages/Inventori';
import LaporanAnalitik from './pages/LaporanAnalitik';
import Edukasi from './pages/Edukasi';
import Konsultasi from './pages/Konsultasi';
import Diagnosa from './pages/Diagnosa';
import Cuaca from './pages/Cuaca';
import Layout from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lahan" element={<ManajemenLahan />} />
        <Route path="/tanaman" element={<DataTanaman />} />
        <Route path="/jadwal" element={<JadwalKegiatan />} />
        <Route path="/inventori" element={<Inventori />} />
        <Route path="/laporan" element={<LaporanAnalitik />} />
        <Route path="/edukasi" element={<Edukasi />} />
        <Route path="/konsultasi" element={<Konsultasi />} />
        <Route path="/diagnosa" element={<Diagnosa />} />
        <Route path="/cuaca" element={<Cuaca />} />
      </Route>
    </Routes>
  );
}
