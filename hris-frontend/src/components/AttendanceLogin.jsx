import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AttendanceLogin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!employeeId || !password) {
      setMessage('Masukkan ID Karyawan dan Password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/employee/login', {
        employee_id: employeeId,
        password,
      });

      const { token, employee_id } = res.data;
      if (token && employee_id) {
        localStorage.setItem('token', token);
        localStorage.setItem('employee_id', employee_id);
        setMessage('Login berhasil. Mengarahkan ke halaman absensi...');
        setTimeout(() => navigate('/attendance'), 700);
      } else {
        setMessage('Login gagal. Respon tidak valid.');
      }
    } catch (err) {
      const detail = err.response?.data?.message || 'Terjadi kesalahan saat login.';
      setMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <h1 className="text-2xl font-bold mb-6">Login Absensi Karyawan</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID Karyawan</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="Misal: EMP-20251227-0001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            placeholder="password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white rounded py-2 hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-sm text-gray-700">{message}</div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        Lupa atau belum punya password? Hubungi admin HR untuk set/reset.
      </div>
    </div>
  );
};

export default AttendanceLogin;