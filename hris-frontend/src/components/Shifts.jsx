import React, { useEffect, useState } from 'react';
import { listShifts, createShift, deleteShift } from '../api';

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ name: '', start_time: '08:00', end_time: '17:00', is_night: false, description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await listShifts();
    setShifts(res.data);
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createShift(form);
      setForm({ name: '', start_time: '08:00', end_time: '17:00', is_night: false, description: '' });
      await load();
      setMessage('Shift berhasil dibuat.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal membuat shift');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    await deleteShift(id);
    await load();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Shift</h1>
      {message && <div className="mb-4 text-sm">{message}</div>}
      <form onSubmit={onSubmit} className="bg-white shadow p-4 rounded grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm mb-1">Nama</label>
          <input name="name" value={form.name} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Mulai</label>
          <input type="time" name="start_time" value={form.start_time} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Selesai</label>
          <input type="time" name="end_time" value={form.end_time} onChange={onChange} className="w-full border rounded p-2" required />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_night" checked={form.is_night} onChange={onChange} />
          <span>Shift malam</span>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded p-2" rows={2} />
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="bg-blue-900 text-white px-4 py-2 rounded">Simpan Shift</button>
        </div>
      </form>

      <div className="bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-2">Daftar Shift</h2>
        <ul className="divide-y">
          {shifts.map(s => (
            <li key={s.id} className="py-2 flex justify-between items-center">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">{s.start_time} - {s.end_time} {s.is_night ? '(Malam)' : ''}</div>
              </div>
              <button onClick={() => remove(s.id)} className="text-red-600 hover:underline">Hapus</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Shifts;

