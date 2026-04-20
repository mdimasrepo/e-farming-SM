const API_BASE = 'http://localhost:5000/api';

// Ambil token dari localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Simpan token + user info
export function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Hapus auth (logout)
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Cek apakah user sudah login
export function isAuthenticated() {
  return !!getToken();
}

// Ambil info user
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Wrapper fetch dengan Authorization header
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  
  // Jika token expired/invalid, redirect ke login
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
  }

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || 'Terjadi kesalahan.');
  }

  return data;
}

// ========== AUTH ==========
export async function loginAPI(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerAPI(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

// ========== LAHAN ==========
export async function getLahan() {
  return apiFetch('/lahan');
}

export async function createLahan(data) {
  return apiFetch('/lahan', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateLahan(id, data) {
  return apiFetch(`/lahan/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteLahan(id) {
  return apiFetch(`/lahan/${id}`, { method: 'DELETE' });
}

// ========== TANAMAN ==========
export async function getTanaman() {
  return apiFetch('/tanaman');
}

export async function createTanaman(data) {
  return apiFetch('/tanaman', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTanaman(id, data) {
  return apiFetch(`/tanaman/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteTanaman(id) {
  return apiFetch(`/tanaman/${id}`, { method: 'DELETE' });
}

// ========== JADWAL ==========
export async function getJadwal() {
  return apiFetch('/jadwal');
}

export async function createJadwal(data) {
  return apiFetch('/jadwal', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateJadwal(id, data) {
  return apiFetch(`/jadwal/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteJadwal(id) {
  return apiFetch(`/jadwal/${id}`, { method: 'DELETE' });
}

// ========== INVENTORI ==========
export async function getInventori() {
  return apiFetch('/inventori');
}

export async function createInventori(data) {
  return apiFetch('/inventori', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateInventori(id, data) {
  return apiFetch(`/inventori/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteInventori(id) {
  return apiFetch(`/inventori/${id}`, { method: 'DELETE' });
}

// ========== LAPORAN ==========
export async function getLaporanProduktivitas() {
  return apiFetch('/laporan/produktivitas');
}

export async function getLaporanRevenue() {
  return apiFetch('/laporan/revenue');
}

// ========== CUACA ==========
export async function getCuaca(lat, lon) {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
  return apiFetch(`/cuaca${params}`);
}

export async function searchLokasi(query) {
  return apiFetch(`/cuaca/search?q=${encodeURIComponent(query)}`);
}

// ========== DIAGNOSA AI ==========
export async function getGejala() {
  return apiFetch('/diagnosa/gejala');
}

export async function analyzeDiagnosa(plant, symptoms) {
  return apiFetch('/diagnosa/analyze', {
    method: 'POST',
    body: JSON.stringify({ plant, symptoms }),
  });
}

export async function analyzeDiagnosaPhoto(imageBase64, plantHint) {
  return apiFetch('/diagnosa/photo', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64, plantHint }),
  });
}
